import prisma from "../config/prisma.js"
import { crearError } from "../utils/errores.js"

/**
 * Crear una nueva postulación en la base de datos (inicia en estado 3: Pendiente)
 */
export const crearPostulacion = async (datos) => {
  const { id_artesano, trayectoria } = datos

  return await prisma.inscripcion.create({
    data: {
      id_artesano: Number(id_artesano),
      trayectoria: trayectoria.trim(),
      id_estado: 3 // Pendiente
    },
    include: {
      artesano: {
        select: {
          id: true,
          ape_y_nom: true,
          email: true,
          cuil: true,
          id_rol: true,
          rol: true
        }
      },
      estado: true
    }
  })
}

/**
 * Obtener todas las postulaciones, admitiendo filtros opcionales por id_estado e id_artesano
 */
export const obtenerPostulaciones = async (filtros = {}) => {
  const where = {}

  if (filtros.id_estado) {
    const estadoNum = Number(filtros.id_estado)
    if (!isNaN(estadoNum)) {
      where.id_estado = estadoNum
    }
  }

  if (filtros.id_artesano) {
    const artesanoNum = Number(filtros.id_artesano)
    if (!isNaN(artesanoNum)) {
      where.id_artesano = artesanoNum
    }
  }

  return await prisma.inscripcion.findMany({
    where,
    include: {
      artesano: {
        select: {
          id: true,
          ape_y_nom: true,
          email: true,
          cuil: true,
          id_rol: true,
          rol: true
        }
      },
      estado: true,
      administrador: {
        select: {
          id: true,
          ape_y_nom: true,
          email: true,
          id_rol: true
        }
      }
    },
    orderBy: {
      fecha_solicitud: "desc"
    }
  })
}

/**
 * Obtener una postulación por su ID con relaciones
 */
export const obtenerPostulacionPorId = async (id) => {
  const postId = Number(id)

  const postulacion = await prisma.inscripcion.findUnique({
    where: { id: postId },
    include: {
      artesano: {
        select: {
          id: true,
          ape_y_nom: true,
          email: true,
          cuil: true,
          id_rol: true,
          rol: true,
          emprendimiento: true
        }
      },
      estado: true,
      administrador: {
        select: {
          id: true,
          ape_y_nom: true,
          email: true,
          id_rol: true
        }
      }
    }
  })

  if (!postulacion) {
    throw crearError("Postulación no encontrada", 404)
  }

  return postulacion
}

/**
 * Actualizar una postulación por parte del postulante (campo trayectoria).
 * Si el estado actual es 4 (Mod_Solicitada), transiciona automáticamente a 5 (En_Reevaluacion).
 */
export const actualizarPostulacion = async (id, datos) => {
  const postId = Number(id)
  const { trayectoria } = datos

  const actual = await prisma.inscripcion.findUnique({
    where: { id: postId }
  })

  if (!actual) {
    throw crearError("Postulación no encontrada", 404)
  }

  // Si estaba en Mod_Solicitada (4), transiciona automáticamente a En_Reevaluacion (5)
  const nuevoEstado = actual.id_estado === 4 ? 5 : actual.id_estado

  return await prisma.inscripcion.update({
    where: { id: postId },
    data: {
      trayectoria: trayectoria.trim(),
      id_estado: nuevoEstado
    },
    include: {
      artesano: {
        select: {
          id: true,
          ape_y_nom: true,
          email: true,
          cuil: true,
          id_rol: true,
          rol: true
        }
      },
      estado: true
    }
  })
}

/**
 * Evaluar una postulación por parte de un Administrador.
 * Si el nuevo estado es 1 (Aprobado), ejecuta una transacción atómica para actualizar
 * la postulación y promover al usuario al rol de Artesano (id_rol = 2).
 */
export const evaluarPostulacion = async (id, datosEvaluacion) => {
  const postId = Number(id)
  const { id_administrador, id_estado, observaciones } = datosEvaluacion
  const estadoNum = Number(id_estado)
  const adminNum = Number(id_administrador)

  const actual = await prisma.inscripcion.findUnique({
    where: { id: postId }
  })

  if (!actual) {
    throw crearError("Postulación no encontrada", 404)
  }

  return await prisma.$transaction(async (tx) => {
    const postulacionActualizada = await tx.inscripcion.update({
      where: { id: postId },
      data: {
        id_estado: estadoNum,
        id_administrador: adminNum,
        fecha_evaluacion: new Date(),
        observaciones: observaciones !== undefined ? observaciones : actual.observaciones
      },
      include: {
        artesano: {
          select: {
            id: true,
            ape_y_nom: true,
            email: true,
            cuil: true,
            id_rol: true,
            rol: true
          }
        },
        estado: true,
        administrador: {
          select: {
            id: true,
            ape_y_nom: true,
            email: true,
            id_rol: true
          }
        }
      }
    })

    if (estadoNum === 1) {
      await tx.usuario.update({
        where: { id: actual.id_artesano },
        data: { id_rol: 2 } // Rol Artesano
      })

      postulacionActualizada.artesano.id_rol = 2
    }

    return postulacionActualizada
  })
}

/**
 * Eliminar / cancelar una postulación en la base de datos
 */
export const eliminarPostulacion = async (id) => {
  const postId = Number(id)

  const actual = await prisma.inscripcion.findUnique({
    where: { id: postId }
  })

  if (!actual) {
    throw crearError("Postulación no encontrada", 404)
  }

  await prisma.inscripcion.delete({
    where: { id: postId }
  })

  return true
}
