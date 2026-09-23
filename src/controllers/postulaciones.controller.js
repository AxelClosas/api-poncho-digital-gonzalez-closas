import * as postulacionesService from "../services/postulaciones.service.js"

/**
 * POST /api/postulaciones
 * Registrar una nueva postulación
 */
export const crear = async (req, res, next) => {
  try {
    const postulacion = await postulacionesService.crearPostulacion(req.body)
    res.status(201).json(postulacion)
  } catch (error) {
    next(error)
  }
}

/**
 * GET /api/postulaciones
 * Listar postulaciones con filtros opcionales (query params)
 */
export const obtenerTodas = async (req, res, next) => {
  try {
    const postulaciones = await postulacionesService.obtenerPostulaciones(req.query)
    res.status(200).json(postulaciones)
  } catch (error) {
    next(error)
  }
}

/**
 * GET /api/postulaciones/:id
 * Obtener detalle de una postulación por su ID
 */
export const obtenerPorId = async (req, res, next) => {
  try {
    const postulacion = await postulacionesService.obtenerPostulacionPorId(req.params.id)
    res.status(200).json(postulacion)
  } catch (error) {
    next(error)
  }
}

/**
 * PUT /api/postulaciones/:id
 * Actualizar trayectoria de la postulación por parte del postulante
 */
export const actualizar = async (req, res, next) => {
  try {
    const postulacion = await postulacionesService.actualizarPostulacion(req.params.id, req.body)
    res.status(200).json(postulacion)
  } catch (error) {
    next(error)
  }
}

/**
 * PATCH /api/postulaciones/:id/evaluar
 * Evaluar una postulación por parte de un administrador
 */
export const evaluar = async (req, res, next) => {
  try {
    const postulacion = await postulacionesService.evaluarPostulacion(req.params.id, req.body)
    res.status(200).json(postulacion)
  } catch (error) {
    next(error)
  }
}

/**
 * DELETE /api/postulaciones/:id
 * Cancelar o eliminar una postulación pendiente
 */
export const eliminar = async (req, res, next) => {
  try {
    await postulacionesService.eliminarPostulacion(req.params.id)
    res.status(204).send()
  } catch (error) {
    next(error)
  }
}