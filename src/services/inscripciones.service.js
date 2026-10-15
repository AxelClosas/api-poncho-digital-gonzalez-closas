import crypto from "node:crypto";
import bcrypt from "bcrypt";
import prisma from "../config/prisma.js";
import { crearError } from "../utils/errores.js";

export const postularse = async (datos) => {
  const { nombre, apellido, cuil, fechaNacimiento, sexo, email, password, localidadId, emprendimiento, nroEdicion } = datos;

  // Verificamos que la localidad exista en la base de datos
  const localidadExiste = await prisma.localidad.findUnique({
    where: { id: localidadId },
  });
  if (!localidadExiste) {
    throw crearError("La localidad seleccionada no existe.", 400);
  }

  // Verificamos que el rubro exista
  const rubroExiste = await prisma.rubro.findUnique({
    where: { id: emprendimiento.rubroId },
  });
  if (!rubroExiste) {
    throw crearError("El rubro indicado no existe.", 400);
  }

  // Obtenemos el estado inicial ("nuevo")
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

    // 1. Si no existe, creamos el usuario inactivo con contraseña aleatoria hasheada
    if (!usuario) {
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
          activo: false, // Inactivo hasta que sea aprobado o el admin solicite cambios
        },
      });
    }

    // 2. Manejo del Emprendimiento
    let emprendimientoId;
    if (usuario.emprendimiento) {
      emprendimientoId = usuario.emprendimiento.id;
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

    // 3. Verificamos si ya tiene una inscripción para esta edición
    const inscripcionExistente = await tx.inscripcion.findFirst({
      where: {
        usuarioId: usuario.id,
        nroEdicion,
      },
    });

    if (inscripcionExistente) {
      throw crearError(`Ya existe una inscripción registrada para este usuario en la edición ${nroEdicion}.`, 409);
    }

    // 4. Creamos la inscripción
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
            email: true,
            localidad: { select: { nombre: true, departamento: { select: { nombre: true } } } },
            emprendimiento: true,
          },
        },
      },
    });

    return {
      mensaje: esUsuarioNuevo
        ? "Postulación registrada con éxito. Su cuenta se encuentra pendiente de revisión y será activada cuando sea evaluada."
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
      { usuario: { email: { contains: busqueda, mode: "insensitive" } } },
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
        usuario: {
          select: {
            id: true,
            nombre: true,
            email: true,
            activo: true,
            localidad: {
              select: {
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

    // Si se pasa a aprobado o solicitud de cambio, activamos la cuenta del usuario
    if (["aprobado", "solicitud de cambio"].includes(nuevoEstado.nombre.toLowerCase())) {
      await tx.usuario.update({
        where: { id: inscripcion.usuarioId },
        data: { activo: true },
      });
      // Si el estado es "aprobado", se le asigna el rol ARTESANO si no lo tiene
      const rolArtesano = await tx.rol.findFirst({ where: { nombre: "ARTESANO" } });
      if (rolArtesano && nuevoEstado.nombre.toLowerCase() === "aprobado") {
        await tx.usuarioRol.upsert({
          where: {
            usuarioId_rolId: { usuarioId: inscripcion.usuarioId, rolId: rolArtesano.id },
          },
          update: {},
          create: { usuarioId: inscripcion.usuarioId, rolId: rolArtesano.id },
        });
      }
    }

    // Si se asigna un stand al aprobar
    if (standId && inscripcion.usuario.emprendimiento) {
      const stand = await tx.stand.findUnique({ where: { id: standId } });
      if (!stand) throw crearError("El stand indicado no existe.", 400);

      await tx.emprendimiento.update({
        where: { id: inscripcion.usuario.emprendimiento.id },
        data: { standId },
      });
      await tx.stand.update({
        where: { id: standId },
        data: { estado: "Ocupado" },
      });
    }

    return tx.inscripcion.update({
      where: { id },
      data: {
        estadoId,
        evaluadorId,
      },
      include: {
        estado: true,
        evaluador: { select: { id: true, nombre: true, email: true } },
      },
    });
  });
};