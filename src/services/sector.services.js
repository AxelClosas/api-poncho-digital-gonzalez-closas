import prisma from "../config/prisma.js";
import { crearError } from "../utils/errores.js";

export const obtenerSectores = async () => {
  return prisma.sector.findMany({
    include: {
      pabellon: {
        select: {
          id: true,
          nombre: true,
        },
      },
      stands: {
        select: {
          id: true,
          nombre: true,
          estado: true,
        },
      },
    },
    orderBy: { id: "asc" },
  });
};

export const obtenerSectorPorId = async (id) => {
  const sector = await prisma.sector.findUnique({
    where: { id },
    include: {
      pabellon: true,
      stands: true,
    },
  });

  if (!sector) {
    throw crearError(`Sector con ID ${id} no encontrado.`, 404);
  }

  return sector;
};

export const crearSector = async (datos) => {
  const pabellonExiste = await prisma.pabellon.findUnique({
    where: { id: datos.pabellonId },
  });

  if (!pabellonExiste) {
    throw crearError(`El pabellón con ID ${datos.pabellonId} no existe.`, 400);
  }

  return prisma.sector.create({
    data: {
      nombre: datos.nombre,
      descripcion: datos.descripcion ?? null,
      pabellonId: datos.pabellonId,
    },
    include: {
      pabellon: true,
    },
  });
};

export const actualizarSector = async (id, datos) => {
  await obtenerSectorPorId(id);

  if (datos.pabellonId !== undefined) {
    const pabellonExiste = await prisma.pabellon.findUnique({
      where: { id: datos.pabellonId },
    });

    if (!pabellonExiste) {
      throw crearError(`El pabellón con ID ${datos.pabellonId} no existe.`, 400);
    }
  }

  return prisma.sector.update({
    where: { id },
    data: datos,
    include: {
      pabellon: true,
    },
  });
};

export const eliminarSector = async (id) => {
  await obtenerSectorPorId(id);

  const standsAsociados = await prisma.stand.count({
    where: { sectorId: id },
  });

  if (standsAsociados > 0) {
    throw crearError(
      "No se puede eliminar el sector porque contiene stands asociados.",
      409
    );
  }

  return prisma.sector.delete({
    where: { id },
  });
};