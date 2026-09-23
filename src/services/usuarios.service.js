import prisma from "../config/prisma.js"
import { crearError } from "../utils/errores.js"

/**
 * Obtener todos los usuarios con su rol asociado
 */
export const obtenerUsuarios = async () => {
  return await prisma.usuario.findMany({
    include: {
      rol: true
    }
  })
}

/**
 * Obtener usuario por ID con su rol asociado
 */
export const obtenerUsuarioPorId = async (id) => {
  const usuarioId = Number(id)

  const usuario = await prisma.usuario.findUnique({
    where: { id: usuarioId },
    include: {
      rol: true
    }
  })

  if (!usuario) {
    throw crearError("Usuario no encontrado", 404)
  }

  return usuario
}

/**
 * Crear un nuevo usuario (rol visitante por defecto si no se especifica)
 */
export const crearUsuario = async (datos) => {
  const { cuil, ape_y_nom, localidad, provincia, email, password, id_rol } = datos

  if (!cuil || !ape_y_nom || !localidad || !provincia || !email || !password) {
    throw crearError("Faltan campos requeridos para crear el usuario", 400, {
      camposRequeridos: ["cuil", "ape_y_nom", "localidad", "provincia", "email", "password"]
    })
  }

  try {
    return await prisma.usuario.create({
      data: {
        cuil,
        ape_y_nom,
        localidad,
        provincia,
        email,
        password,
        id_rol: id_rol ? Number(id_rol) : 3
      },
      include: {
        rol: true
      }
    })
  } catch (error) {
    if (error.code === "P2002") {
      throw crearError("El email o CUIL ya se encuentra registrado", 409, {
        campos: error.meta?.target || ["email/cuil"]
      })
    }
    if (error.code === "P2003") {
      throw crearError("El rol especificado no existe", 400, { campo: "id_rol" })
    }
    throw error
  }
}

/**
 * Actualizar un usuario existente (método PUT)
 */
export const actualizarUsuario = async (id, datos) => {
  const usuarioId = Number(id)
  const { cuil, ape_y_nom, localidad, provincia, email, password, id_rol } = datos

  if (!cuil || !ape_y_nom || !localidad || !provincia || !email || !password) {
    throw crearError("Faltan campos requeridos para actualizar el usuario vía PUT", 400, {
      camposRequeridos: ["cuil", "ape_y_nom", "localidad", "provincia", "email", "password"]
    })
  }

  const existente = await prisma.usuario.findUnique({
    where: { id: usuarioId }
  })

  if (!existente) {
    throw crearError("Usuario no encontrado", 404)
  }

  try {
    return await prisma.usuario.update({
      where: { id: usuarioId },
      data: {
        cuil,
        ape_y_nom,
        localidad,
        provincia,
        email,
        password,
        ...(id_rol !== undefined && { id_rol: Number(id_rol) })
      },
      include: {
        rol: true
      }
    })
  } catch (error) {
    if (error.code === "P2002") {
      throw crearError("El email o CUIL ya se encuentra registrado", 409, {
        campos: error.meta?.target || ["email/cuil"]
      })
    }
    if (error.code === "P2025") {
      throw crearError("Usuario no encontrado", 404)
    }
    if (error.code === "P2003") {
      throw crearError("El rol especificado no existe", 400, { campo: "id_rol" })
    }
    throw error
  }
}

/**
 * Eliminar un usuario por ID
 */
export const eliminarUsuario = async (id) => {
  const usuarioId = Number(id)

  const existente = await prisma.usuario.findUnique({
    where: { id: usuarioId }
  })

  if (!existente) {
    throw crearError("Usuario no encontrado", 404)
  }

  try {
    await prisma.usuario.delete({
      where: { id: usuarioId }
    })
    return true
  } catch (error) {
    if (error.code === "P2025") {
      throw crearError("Usuario no encontrado", 404)
    }
    throw error
  }
}
