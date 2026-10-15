import prisma from "../config/prisma.js";
import { crearError } from "../utils/errores.js";

export const listarEstados = async () => {
  return prisma.estado.findMany({
    orderBy: { id: "asc" },
  });
};

export const obtenerEstadoPorId = async (id) => {
  const estado = await prisma.estado.findUnique({ where: { id } });
  if (!estado) {
    throw crearError(`No existe un estado con ID ${id}.`, 404);
  }
  return estado;
};

export const crearEstado = async (datos) => {
  return prisma.estado.create({
    data: { nombre: datos.nombre },
  });
};

export const actualizarEstado = async (id, datos) => {
  await obtenerEstadoPorId(id);
  return prisma.estado.update({
    where: { id },
    data: { nombre: datos.nombre },
  });
};

export const eliminarEstado = async (id) => {
  await obtenerEstadoPorId(id);

  // Comprueba que no haya trámites o inscripciones activas con este estado
  const inscripcionesConEstado = await prisma.inscripcion.count({
    where: { estadoId: id },
  });

  if (inscripcionesConEstado > 0) {
    throw crearError("No se puede eliminar el estado porque existen inscripciones asociadas.", 409);
  }

  return prisma.estado.delete({ where: { id } });
};