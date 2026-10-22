import prisma from "../config/prisma.js";
import { crearError } from "../utils/errores.js";

export const obtenerRubros = async () => {
  return prisma.rubro.findMany({
    orderBy: { id: "asc" },
  });
};

export const obtenerRubroPorId = async (id) => {
  const rubro = await prisma.rubro.findUnique({
    where: { id },
    include: {
      emprendimientos: {
        select: {
          id: true,
          nombre: true,
        },
      },
    },
  });

  if (!rubro) {
    throw crearError(`Rubro con ID ${id} no encontrado.`, 404);
  }

  return rubro;
};

export const crearRubro = async (datos) => {
  const rubroExistente = await prisma.rubro.findUnique({
    where: { nombre: datos.nombre },
  });

  if (rubroExistente) {
    throw crearError("Ya existe un rubro con ese nombre.", 409);
  }

  return prisma.rubro.create({
    data: {
      nombre: datos.nombre,
      descripcion: datos.descripcion ?? null,
    },
  });
};

export const actualizarRubro = async (id, datos) => {
  await obtenerRubroPorId(id);

  if (datos.nombre) {
    const existeNombre = await prisma.rubro.findFirst({
      where: {
        nombre: datos.nombre,
        id: { not: id },
      },
    });

    if (existeNombre) {
      throw crearError("Ya existe otro rubro con ese nombre.", 409);
    }
  }

  return prisma.rubro.update({
    where: { id },
    data: datos,
  });
};

export const eliminarRubro = async (id) => {
  await obtenerRubroPorId(id);

  // Evita eliminar si existen emprendimientos asociados a este rubro
  const emprendimientosAsociados = await prisma.emprendimiento.count({
    where: { rubroId: id },
  });

  if (emprendimientosAsociados > 0) {
    throw crearError(
      "No se puede eliminar el rubro porque tiene emprendimientos asociados.",
      409
    );
  }

  return prisma.rubro.delete({
    where: { id },
  });
};