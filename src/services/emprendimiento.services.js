import prisma from "../config/prisma.js";

import { crearError } from "../utils/errores.js";

const seleccionEmprendimiento = {
  id: true,
  nombre: true,
  descripcion: true,
  rubroId: true,
  standId: true,
  rubro: {
    select: {
      id: true,
      nombre: true,
    },
  },
  stand: {
    select: {
      id: true,
      nombre: true,
      estado: true,
    },
  },
};

const validarRubro = async (cliente, rubroId) => {
  // Omitido: conservar el valor actual.
  // Null: quitar la asociación.
  if (rubroId === undefined || rubroId === null) {
    return;
  }

  const rubro = await cliente.rubro.findUnique({
    where: { id: rubroId },
    select: { id: true },
  });

  if (!rubro) {
    throw crearError("El rubro indicado no existe.", 400);
  }
};

export const obtenerEmprendimientos = async (criterios) => {
  const { busqueda, rubroId, standId, usuarioId, conStand,
    ordenPor, direccion, pagina, limite } = criterios;
  const where = {};
  if (rubroId !== undefined) where.rubroId = rubroId;
  if (usuarioId !== undefined) where.usuarioId = usuarioId;
  if (standId !== undefined) where.standId = standId;
  else if (conStand !== undefined) where.standId = conStand ? { not: null } : null;
  if (busqueda) {
    where.OR = [
      { nombre: { contains: busqueda, mode: "insensitive" } },
      { descripcion: { contains: busqueda, mode: "insensitive" } },
    ];
  }
  const orderBy = ordenPor === "id"
    ? [{ id: direccion }]
    : [{ [ordenPor]: direccion }, { id: "asc" }];
  const [emprendimientos, total] = await prisma.$transaction([
    prisma.emprendimiento.findMany({
      where,
      select: seleccionEmprendimiento,
      orderBy,
      skip: (pagina - 1) * limite,
      take: limite,
    }),
    prisma.emprendimiento.count({ where }),
  ], { isolationLevel: "RepeatableRead" });
  return {
    emprendimientos,
    paginacion: { pagina, limite, total, totalPaginas: Math.ceil(total / limite) },
  };
};

export const obtenerEmprendimientoPorId = async (id) => {
  const emprendimiento = await prisma.emprendimiento.findUnique({
    where: { id },
    select: seleccionEmprendimiento,
  });
  if (!emprendimiento) {
    throw crearError("Emprendimiento no encontrado.", 404);
  }

  return emprendimiento;
};

export const crearEmprendimiento = async (usuario, emprendimiento) => {
  const nroEdicion = new Date().getFullYear()
  const inscripcionExistente = await prisma.inscripcion.count({
    where: { usuarioId: usuario.id, nroEdicion }
  })

  if (inscripcionExistente)
    throw crearError("El usuario ya registra una inscripción para esta edición.", 400)

  const existeRubro = await prisma.rubro.count({ where: { id: emprendimiento.rubroId } })

  if (!existeRubro)
    throw crearError("El rubro indicado no existe.", 404)


  if (!usuario.emprendimiento) {
    return await prisma.$transaction(async (tx) => {
      const estadoNuevaInscripcion = await tx.estado.findFirst({
        where: { nombre: { contains: "nuevo", mode: "insensitive" } }
      })

      if (!estadoNuevaInscripcion)
        throw crearError("No se encuentra el estado 'nuevo'.", 404)

      const nuevoEmprendimiento = await tx.emprendimiento.create({
        data: {
          nombre: emprendimiento.nombre,
          descripcion: emprendimiento?.descripcion ?? null,
          rubro: { connect: { id: emprendimiento.rubroId } },
          usuario: { connect: { id: usuario.id } }
        },
      })

      const nuevaInscripcion = await tx.inscripcion.create({
        data: {
          nroEdicion,
          usuario: { connect: { id: usuario.id } },
          estado: { connect: { id: estadoNuevaInscripcion.id } }
        }
      })

      return { nuevoEmprendimiento, nuevaInscripcion }
    })
  } else {
    throw crearError("El usuario ya cuenta con un emprendimiento registrado.", 400)
  }
};

export const actualizarEmprendimiento = async (
  id,
  datos,
  usuarioActual
) => {
  const emprendimiento = await prisma.emprendimiento.findUnique({
    where: { id },
  });

  if (!emprendimiento) {
    throw crearError("Emprendimiento no encontrado.", 404);
  }

  const esAdmin = usuarioActual.roles.includes("ADMINISTRADOR");
  const esPropietario = emprendimiento.usuarioId === usuarioActual.id;

  if (!esAdmin && !esPropietario) {
    throw crearError(
      "No tenés permiso para modificar este emprendimiento.",
      403
    );
  }

  return prisma.$transaction(async (tx) => {
    if (datos.rubroId !== undefined) {
      await validarRubro(tx, datos.rubroId);
    }

    const emprendimientoActualizado = await tx.emprendimiento.update({
      where: { id },
      data: {
        nombre: datos.nombre,
        descripcion: datos.descripcion,
        rubroId: datos.rubroId,
      },
      select: seleccionEmprendimiento,
    });

    const nroEdicion = new Date().getFullYear();

    const inscripcionActual = await tx.inscripcion.findFirst({
      where: {
        usuarioId: emprendimiento.usuarioId,
        nroEdicion,
      },
      include: {
        estado: true,
      },
    });

    if (
      inscripcionActual &&
      inscripcionActual.estado.nombre.toLowerCase() === "solicitud_cambio"
    ) {
      const estadoActualizado = await tx.estado.findFirst({
        where: {
          nombre: { contains: "actualizado", mode: "insensitive" },
        },
      });

      if (!estadoActualizado) {
        throw crearError(
          "El estado 'actualizado' no está configurado en el sistema.",
          404
        );
      }

      await tx.inscripcion.update({
        where: { id: inscripcionActual.id },
        data: { estadoId: estadoActualizado.id },
      });
    }

    return emprendimientoActualizado;
  });
};

export const eliminarEmprendimiento = async (id) => {
  return await prisma.emprendimiento.delete({
    where: {
      id,
    }
  });
};
