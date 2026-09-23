import express from "express"
import {
  crear,
  obtenerTodas,
  obtenerPorId,
  actualizar,
  evaluar,
  eliminar
} from "../controllers/postulaciones.controller.js"
import {
  validarIdParam,
  validarCrearPostulacion,
  verificarPostulante,
  validarActualizarPostulacion,
  verificarEstadoModificable,
  verificarEvaluador,
  validarEvaluacion,
  verificarEstadoCancelable
} from "../middlewares/postulaciones.middlewares.js"

const router = express.Router()

router.post("/", validarCrearPostulacion, verificarPostulante, crear)
router.get("/", obtenerTodas)
router.get("/:id", validarIdParam, obtenerPorId)
router.put("/:id", validarIdParam, validarActualizarPostulacion, verificarEstadoModificable, actualizar)
router.patch("/:id/evaluar", validarIdParam, verificarEvaluador, validarEvaluacion, evaluar)
router.delete("/:id", validarIdParam, verificarEstadoCancelable, eliminar)

export default router