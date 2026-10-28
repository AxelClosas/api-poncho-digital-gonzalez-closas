import prisma from "../config/prisma.js";
import { crearError } from "../utils/errores.js";

export const obtenerStands = async () => {
  return await prisma.stand.findMany({
    include: { sector: true }, // Incluye la info del sector al que pertenece
  });
};

export const obtenerStandPorId = async (id) => {
  const stand = await prisma.stand.findUnique({
    where: { id: id },
    include: { sector: true },
  });

  if (!stand) {
    throw crearError(`Stand con ID ${id} no encontrado.`, 404);
  }
  return stand;
};

export const crearStand = async (datos) => {
  // 1. Verificamos que el sector exista
  const sectorExiste = await prisma.sector.findUnique({
    where: { id: datos.sectorId },
  });

  if (!sectorExiste) {
    throw crearError(`El sector con ID ${datos.sectorId} no existe.`, 400);
  }

  // 2. Creamos el stand
  return await prisma.stand.create({
    data: {
      nombre: datos.nombre,
      sectorId: datos.sectorId,
      estado: datos.estado ?? "Disponible",
    },
    include: { sector: true },
  });
};

export const actualizarStand = async (id, datos) => {
  // 1. Verificamos que el stand exista
  await obtenerStandPorId(id);

  // 2. Si se envió un sectorId nuevo, verificamos que exista
  if (datos.sectorId) {
    const sectorExiste = await prisma.sector.findUnique({
      where: { id: datos.sectorId },
    });
    if (!sectorExiste) {
      throw crearError(`El sector con ID ${datos.sectorId} no existe.`, 400);
    }
  }

  // 3. Actualizamos
  return await prisma.stand.update({
    where: { id: id },
    data: {
      nombre: datos.nombre,
      sectorId: datos.sectorId,
      estado: datos.estado,
    },
    include: { sector: true },
  });
};

export const eliminarStand = async (id) => {
  await obtenerStandPorId(id);
  return await prisma.stand.delete({
    where: { id: id },
  });
};