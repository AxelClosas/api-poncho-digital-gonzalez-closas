import prisma from "../config/prisma.js";
import { crearError } from "../utils/errores.js";

export const obtenerPabellones = async () => {
  return prisma.pabellon.findMany({
    include: {
      sectores: {
        select: {
          id: true,
          nombre: true,
          descripcion: true,
        },
      },
    },
    orderBy: { id: "asc" },
  });
};

export const obtenerPabellonPorId = async (id) => {
  const pabellon = await prisma.pabellon.findUnique({
    where: { id },
    include: {
      sectores: true,
    },
  });

  if (!pabellon) {
    throw crearError(`Pabellón con ID ${id} no encontrado.`, 404);
  }

  return pabellon;
};

export const crearPabellon = async (datos) => {
  return prisma.pabellon.create({
    data: {
      nombre: datos.nombre,
      descripcion: datos.descripcion ?? null,
    },
  });
};

export const actualizarPabellon = async (id, datos) => {
  await obtenerPabellonPorId(id); // Comprueba existencia previa

  return prisma.pabellon.update({
    where: { id },
    data: datos,
  });
};

export const eliminarPabellon = async (id) => {
  await obtenerPabellonPorId(id);

  // Verificamos si tiene sectores asociados para evitar fallo de FK Restrict
  const sectoresAsociados = await prisma.sector.count({
    where: { pabellonId: id },
  });

  if (sectoresAsociados > 0) {
    throw crearError(
      "No se puede eliminar el pabellón porque contiene sectores asociados.",
      409
    );
  }

  return prisma.pabellon.delete({
    where: { id },
  });
};