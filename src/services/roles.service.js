import prisma from "../config/prisma.js";
import { crearError } from "../utils/errores.js";

export const listarRoles = async () => {
  return prisma.rol.findMany({
    orderBy: { nombre: "asc" },
  });
};

export const obtenerRolPorId = async (id) => {
  const rol = await prisma.rol.findUnique({ where: { id } });
  if (!rol) {
    throw crearError(`No existe un rol con ID ${id}.`, 404);
  }
  return rol;
};

export const crearRol = async (datos) => {
  return prisma.rol.create({
    data: { nombre: datos.nombre },
  });
};

export const actualizarRol = async (id, datos) => {
  await obtenerRolPorId(id); // Valida existencia previa
  return prisma.rol.update({
    where: { id },
    data: { nombre: datos.nombre },
  });
};

export const eliminarRol = async (id) => {
  await obtenerRolPorId(id);

  // Evita eliminar si hay usuarios con este rol asignado
  const usuariosConRol = await prisma.usuarioRol.count({
    where: { rolId: id },
  });

  if (usuariosConRol > 0) {
    throw crearError("No se puede eliminar el rol porque está asignado a usuarios.", 409);
  }

  return prisma.rol.delete({ where: { id } });
};