import bcrypt from "bcrypt";
import prisma from "../config/prisma.js";
import { crearError } from "../utils/errores.js";

export const postularse = async (datos) => {
  const {
    nombre,
    apellido,
    cuil,
    fechaNacimiento,
    sexo,
    email,
    password,
    localidadId,
    emprendimiento,
    nroEdicion,
  } = datos;

  // 1. Verificamos que la localidad exista en la base de datos (con tipo BigInt)
  const localidadExiste = await prisma.localidad.findUnique({
    where: { id: localidadId },
  });
  if (!localidadExiste) {
    throw crearError("La localidad seleccionada no existe.", 400);
  }

  // 2. Verificamos que el rubro exista
  const rubroExiste = await prisma.rubro.findUnique({
    where: { id: emprendimiento.rubroId },
  });
  if (!rubroExiste) {
    throw crearError("El rubro indicado no existe.", 400);
  }

  // 3. Obtenemos el estado inicial ("nuevo")
  const estadoNuevo = await prisma.estado.findFirst({
    where: { nombre: "nuevo" },
  });
  if (!estadoNuevo) {
    throw crearError("El estado inicial 'nuevo' no está configurado en el sistema.", 500);
  }

  return prisma.$transaction(async (tx) => {
    let usuario = await tx.usuario.findUnique({
      where: { email },
      include: { emprendimiento: true },
    });

    let esUsuarioNuevo = false;

    // 4. Si el usuario no existe, verificamos CUIL único y lo creamos
    if (!usuario) {
      const cuilExistente = await tx.usuario.findUnique({
        where: { cuil },
      });
      if (cuilExistente) {
        throw crearError("Ya existe un usuario registrado con el CUIL proporcionado.", 409);
      }

      esUsuarioNuevo = true;
      const passwordHash = await bcrypt.hash(password, 10);

      usuario = await tx.usuario.create({
        data: {
          nombre,
          apellido,
          cuil,
          fechaNacimiento,
          sexo,
          email,
          localidadId,
          passwordHash,
          activo: false, // Inactivo hasta que un evaluador lo apruebe o solicite cambios
        },
      });
    }

    // 5. Manejo del Emprendimiento (Crear o Actualizar datos provistos)
    let emprendimientoId;
    if (usuario.emprendimiento) {
      const emprendimientoActualizado = await tx.emprendimiento.update({
        where: { id: usuario.emprendimiento.id },
        data: {
          nombre: emprendimiento.nombre,
          descripcion: emprendimiento.descripcion ?? null,
          rubroId: emprendimiento.rubroId,
        },
      });
      emprendimientoId = emprendimientoActualizado.id;
    } else {
      const nuevoEmprendimiento = await tx.emprendimiento.create({
        data: {
          nombre: emprendimiento.nombre,
          descripcion: emprendimiento.descripcion ?? null,
          rubroId: emprendimiento.rubroId,
          usuarioId: usuario.id,
        },
      });
      emprendimientoId = nuevoEmprendimiento.id;
    }

    // 6. Verificamos que no exista duplicidad de trámite para la misma edición
    const inscripcionExistente = await tx.inscripcion.findFirst({
      where: {
        usuarioId: usuario.id,
        nroEdicion,
      },
    });

    if (inscripcionExistente) {
      throw crearError(`Ya existe una inscripción registrada para este usuario en la edición ${nroEdicion}.`, 409);
    }

    // 7. Creamos la inscripción con estado inicial "nuevo"
    const inscripcion = await tx.inscripcion.create({
      data: {
        nroEdicion,
        usuarioId: usuario.id,
        estadoId: estadoNuevo.id,
      },
      include: {
        estado: true,
        usuario: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            cuil: true,
            email: true,
            localidad: {
              select: {
                id: true,
                nombre: true,
                departamento: { select: { nombre: true } },
              },
            },
            emprendimiento: {
              include: { rubro: true },
            },
          },
        },
      },
    });

    return {
      mensaje: esUsuarioNuevo
        ? "Postulación registrada con éxito. Su cuenta se encuentra pendiente de revisión."
        : "Postulación registrada con éxito para su usuario existente.",
      inscripcion,
    };
  });
};

export const consultarInscripciones = async (criterios) => {
  const { nroEdicion, estadoId, busqueda, ordenPor, direccion, pagina, limite } = criterios;

  const where = {};

  if (nroEdicion) where.nroEdicion = nroEdicion;
  if (estadoId) where.estadoId = estadoId;

  if (busqueda) {
    where.OR = [
      { usuario: { nombre: { contains: busqueda, mode: "insensitive" } } },
      { usuario: { apellido: { contains: busqueda, mode: "insensitive" } } },
      { usuario: { email: { contains: busqueda, mode: "insensitive" } } },
      { usuario: { cuil: { contains: busqueda } } },
      { usuario: { emprendimiento: { nombre: { contains: busqueda, mode: "insensitive" } } } },
    ];
  }

  const desplazamiento = (pagina - 1) * limite;

  const [inscripciones, total] = await prisma.$transaction([
    prisma.inscripcion.findMany({
      where,
      orderBy: [{ [ordenPor]: direccion }, { id: "asc" }],
      skip: desplazamiento,
      take: limite,
      include: {
        estado: true,
        evaluador: {
          select: { id: true, nombre: true, apellido: true, email: true },
        },
        usuario: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            cuil: true,
            email: true,
            activo: true,
            localidad: {
              select: {
                id: true,
                nombre: true,
                departamento: {
                  select: {
                    nombre: true,
                    provincia: { select: { nombre: true } },
                  },
                },
              },
            },
            emprendimiento: {
              include: {
                rubro: true,
                stand: true,
              },
            },
          },
        },
      },
    }),
    prisma.inscripcion.count({ where }),
  ]);

  return {
    inscripciones,
    paginacion: {
      pagina,
      limite,
      total,
      totalPaginas: Math.ceil(total / limite),
    },
  };
};

export const cambiarEstadoInscripcion = async (id, datos, evaluadorId) => {
  const { estadoId, standId } = datos;

  return prisma.$transaction(async (tx) => {
    const inscripcion = await tx.inscripcion.findUnique({
      where: { id },
      include: {
        usuario: { include: { emprendimiento: true } },
      },
    });

    if (!inscripcion) {
      throw crearError(`Inscripción con ID ${id} no encontrada.`, 404);
    }

    const nuevoEstado = await tx.estado.findUnique({
      where: { id: estadoId },
    });

    if (!nuevoEstado) {
      throw crearError("El estado indicado no existe.", 400);
    }

    const nombreEstadoLower = nuevoEstado.nombre.toLowerCase();

    // Si se pasa a aprobado o solicitud de cambio, activamos la cuenta del usuario
    if (["aprobado", "solicitud de cambio"].includes(nombreEstadoLower)) {
      await tx.usuario.update({
        where: { id: inscripcion.usuarioId },
        data: { activo: true },
      });

      // Si el estado es "aprobado", se le asigna el rol ARTESANO si no lo tiene
      if (nombreEstadoLower === "aprobado") {
        const rolArtesano = await tx.rol.findFirst({ where: { nombre: "ARTESANO" } });
        if (rolArtesano) {
          await tx.usuarioRol.upsert({
            where: {
              usuarioId_rolId: { usuarioId: inscripcion.usuarioId, rolId: rolArtesano.id },
            },
            update: {},
            create: { usuarioId: inscripcion.usuarioId, rolId: rolArtesano.id },
          });
        }
      }
    }

    // Si se pasa a rechazado, se desactiva la cuenta si no tiene otras postulaciones aprobadas
    if (nombreEstadoLower === "rechazado") {
      const otrasAprobadas = await tx.inscripcion.count({
        where: {
          usuarioId: inscripcion.usuarioId,
          id: { not: id },
          estado: { nombre: "aprobado" },
        },
      });

      if (otrasAprobadas === 0) {
        await tx.usuario.update({
          where: { id: inscripcion.usuarioId },
          data: { activo: false },
        });
      }
    }

    // Manejo de asignación o liberación de Stand
    if (inscripcion.usuario.emprendimiento) {
      const standActualId = inscripcion.usuario.emprendimiento.standId;

      // Si se envía un nuevo standId
      if (standId) {
        const stand = await tx.stand.findUnique({ where: { id: standId } });
        if (!stand) throw crearError("El stand indicado no existe.", 400);

        if (stand.estado !== "Disponible" && stand.id !== standActualId) {
          throw crearError("El stand seleccionado no se encuentra disponible.", 409);
        }

        // Si ya tenía otro stand previamente, liberamos el viejo
        if (standActualId && standActualId !== standId) {
          await tx.stand.update({
            where: { id: standActualId },
            data: { estado: "Disponible" },
          });
        }

        // Asignamos el nuevo y lo ocupamos
        await tx.emprendimiento.update({
          where: { id: inscripcion.usuario.emprendimiento.id },
          data: { standId },
        });
        await tx.stand.update({
          where: { id: standId },
          data: { estado: "Ocupado" },
        });
      } else if (standId === null && standActualId) {
        // Si se envió standId: null explícito, se libera el stand
        await tx.emprendimiento.update({
          where: { id: inscripcion.usuario.emprendimiento.id },
          data: { standId: null },
        });
        await tx.stand.update({
          where: { id: standActualId },
          data: { estado: "Disponible" },
        });
      }
    }

    return tx.inscripcion.update({
      where: { id },
      data: {
        estadoId,
        evaluadorId,
      },
      include: {
        estado: true,
        evaluador: { select: { id: true, nombre: true, apellido: true, email: true } },
      },
    });
  });
};