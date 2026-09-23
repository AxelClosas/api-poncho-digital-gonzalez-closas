import prisma from "../config/prisma.js"
import { crearError } from "../utils/errores.js"

/**
 * Valida que el parámetro :id de la ruta sea un número entero positivo
 */
export const validarIdParam = (req, res, next) => {
  const idNumero = Number(req.params.id)

  if (isNaN(idNumero) || !Number.isInteger(idNumero) || idNumero <= 0) {
    return next(crearError("El ID de la postulación debe ser un número entero válido y positivo", 400))
  }

  next()
}

/**
 * Valida la presencia y formato de los campos al crear una postulación
 */
export const validarCrearPostulacion = (req, res, next) => {
  const { id_artesano, trayectoria } = req.body

  if (id_artesano === undefined || id_artesano === null || isNaN(Number(id_artesano)) || !Number.isInteger(Number(id_artesano)) || Number(id_artesano) <= 0) {
    return next(crearError("El campo id_artesano es obligatorio y debe ser un número entero positivo", 400, {
      campo: "id_artesano"
    }))
  }

  if (typeof trayectoria !== "string" || trayectoria.trim() === "") {
    return next(crearError("El campo trayectoria es obligatorio y debe ser un texto no vacío", 400, {
      campo: "trayectoria"
    }))
  }

  next()
}

/**
 * Valida en base de datos que el usuario postulante exista, sea Visitante (id_rol = 3)
 * y que no posea otra postulación activa (estados 3: Pendiente, 4: Mod_Solicitada, 5: En_Reevaluacion)
 */
export const verificarPostulante = async (req, res, next) => {
  try {
    const idUsuario = Number(req.body.id_artesano)

    const usuario = await prisma.usuario.findUnique({
      where: { id: idUsuario }
    })

    if (!usuario) {
      return next(crearError("El usuario postulante especificado no existe", 400, {
        id_artesano: idUsuario
      }))
    }

    if (usuario.id_rol !== 3) {
      return next(crearError("Solo los usuarios con rol Visitante pueden solicitar una postulación", 400, {
        rol_actual: usuario.id_rol,
        requerido: 3
      }))
    }

    const postulacionActiva = await prisma.inscripcion.findFirst({
      where: {
        id_artesano: idUsuario,
        id_estado: { in: [3, 4, 5] }
      }
    })

    if (postulacionActiva) {
      return next(crearError("El usuario ya posee una postulación activa en curso", 409, {
        id_postulacion_activa: postulacionActiva.id,
        id_estado: postulacionActiva.id_estado
      }))
    }

    next()
  } catch (error) {
    next(error)
  }
}

/**
 * Valida que el campo trayectoria esté presente y no vacío al actualizar una postulación
 */
export const validarActualizarPostulacion = (req, res, next) => {
  const { trayectoria } = req.body

  if (typeof trayectoria !== "string" || trayectoria.trim() === "") {
    return next(crearError("El campo trayectoria es obligatorio y debe ser un texto no vacío", 400, {
      campo: "trayectoria"
    }))
  }

  next()
}

/**
 * Valida que la postulación exista y su estado actual permita modificación por el postulante
 * (solo permitido en estado 3: Pendiente o 4: Mod_Solicitada)
 */
export const verificarEstadoModificable = async (req, res, next) => {
  try {
    const idPostulacion = Number(req.params.id)

    const postulacion = await prisma.inscripcion.findUnique({
      where: { id: idPostulacion }
    })

    if (!postulacion) {
      return next(crearError("Postulación no encontrada", 404))
    }

    if (postulacion.id_estado !== 3 && postulacion.id_estado !== 4) {
      return next(crearError("La postulación no se encuentra en un estado modificable (solo permitido en Pendiente o Mod_Solicitada)", 400, {
        id_estado_actual: postulacion.id_estado
      }))
    }

    req.postulacionActual = postulacion
    next()
  } catch (error) {
    next(error)
  }
}

/**
 * Valida que el usuario evaluador exista en la BD y posea rol de Administrador (id_rol = 1)
 */
export const verificarEvaluador = async (req, res, next) => {
  try {
    const { id_administrador } = req.body

    if (id_administrador === undefined || id_administrador === null || isNaN(Number(id_administrador)) || !Number.isInteger(Number(id_administrador)) || Number(id_administrador) <= 0) {
      return next(crearError("El campo id_administrador es obligatorio y debe ser un número entero positivo", 400, {
        campo: "id_administrador"
      }))
    }

    const admin = await prisma.usuario.findUnique({
      where: { id: Number(id_administrador) }
    })

    if (!admin) {
      return next(crearError("El usuario evaluador especificado no existe", 400, {
        id_administrador
      }))
    }

    if (admin.id_rol !== 1) {
      return next(crearError("El usuario especificado no posee permisos de Administrador para evaluar postulaciones", 403, {
        id_rol: admin.id_rol
      }))
    }

    next()
  } catch (error) {
    next(error)
  }
}

/**
 * Valida los parámetros de evaluación de la postulación:
 * id_estado debe ser 1 (Aprobado), 2 (Rechazado) o 4 (Mod_Solicitada).
 * Si es 2 o 4, observaciones es obligatorio.
 */
export const validarEvaluacion = (req, res, next) => {
  const { id_estado, observaciones } = req.body
  const estadoNum = Number(id_estado)

  if (isNaN(estadoNum) || ![1, 2, 4].includes(estadoNum)) {
    return next(crearError("El id_estado debe ser 1 (Aprobado), 2 (Rechazado) o 4 (Mod_Solicitada)", 400, {
      estadosValidos: [1, 2, 4]
    }))
  }

  if ((estadoNum === 2 || estadoNum === 4) && (typeof observaciones !== "string" || observaciones.trim() === "")) {
    return next(crearError("El campo observaciones es obligatorio cuando el estado es Rechazado o Mod_Solicitada", 400, {
      campo: "observaciones"
    }))
  }

  next()
}

/**
 * Valida que la postulación exista y solo permita cancelarse si está en estado 3 (Pendiente)
 */
export const verificarEstadoCancelable = async (req, res, next) => {
  try {
    const idPostulacion = Number(req.params.id)

    const postulacion = await prisma.inscripcion.findUnique({
      where: { id: idPostulacion }
    })

    if (!postulacion) {
      return next(crearError("Postulación no encontrada", 404))
    }

    if (postulacion.id_estado !== 3) {
      return next(crearError("Solo se pueden cancelar o eliminar postulaciones que se encuentren en estado Pendiente", 400, {
        id_estado_actual: postulacion.id_estado
      }))
    }

    next()
  } catch (error) {
    next(error)
  }
}
