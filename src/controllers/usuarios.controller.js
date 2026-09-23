import * as usuariosService from "../services/usuarios.service.js"
import { crearError } from "../utils/errores.js"

/**
 * GET /api/usuarios
 * Retorna todos los usuarios con su rol
 */
export const obtenerUsuarios = async (req, res, next) => {
  try {
    const usuarios = await usuariosService.obtenerUsuarios()
    res.status(200).json(usuarios)
  } catch (error) {
    next(error)
  }
}

/**
 * GET /api/usuarios/:id
 * Retorna un usuario por su ID
 */
export const obtenerUsuarioPorId = async (req, res, next) => {
  try {
    const { id } = req.params
    const idNumero = Number(id)

    if (isNaN(idNumero) || !Number.isInteger(idNumero) || idNumero <= 0) {
      throw crearError("El ID de usuario debe ser un número entero válido", 400)
    }

    const usuario = await usuariosService.obtenerUsuarioPorId(idNumero)
    res.status(200).json(usuario)
  } catch (error) {
    next(error)
  }
}

/**
 * POST /api/usuarios
 * Registra un nuevo usuario
 */
export const crearUsuario = async (req, res, next) => {
  try {
    const usuarioCreado = await usuariosService.crearUsuario(req.body)
    res.status(201).json(usuarioCreado)
  } catch (error) {
    next(error)
  }
}

/**
 * PUT /api/usuarios/:id
 * Actualiza los datos de un usuario existente
 */
export const actualizarUsuario = async (req, res, next) => {
  try {
    const { id } = req.params
    const idNumero = Number(id)

    if (isNaN(idNumero) || !Number.isInteger(idNumero) || idNumero <= 0) {
      throw crearError("El ID de usuario debe ser un número entero válido", 400)
    }

    const usuarioActualizado = await usuariosService.actualizarUsuario(idNumero, req.body)
    res.status(200).json(usuarioActualizado)
  } catch (error) {
    next(error)
  }
}

/**
 * DELETE /api/usuarios/:id
 * Elimina un usuario por su ID
 */
export const eliminarUsuario = async (req, res, next) => {
  try {
    const { id } = req.params
    const idNumero = Number(id)

    if (isNaN(idNumero) || !Number.isInteger(idNumero) || idNumero <= 0) {
      throw crearError("El ID de usuario debe ser un número entero válido", 400)
    }

    await usuariosService.eliminarUsuario(idNumero)
    res.status(204).send()
  } catch (error) {
    next(error)
  }
}
