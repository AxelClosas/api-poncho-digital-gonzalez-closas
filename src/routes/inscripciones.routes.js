import express from "express";
import {
  postularse,
  consultarInscripciones,
  cambiarEstadoInscripcion,
} from "../controllers/inscripciones.controller.js";
import { autenticarUsuario } from "../middlewares/autenticacion.middleware.js";
import {
  cargarContextoUsuario,
  autorizarRoles,
} from "../middlewares/autorizacion.middleware.js";
import {
  validarBody,
  validarConsulta,
  validarParametros,
} from "../middlewares/validacion.middleware.js";
import {
  postularseSchema,
  consultarInscripcionesSchema,
  cambiarEstadoSchema,
  inscripcionIdParamSchema,
} from "../validators/inscripciones.schemas.js";

const router = express.Router();

const evaluadoresOAdmin = [
  autenticarUsuario,
  cargarContextoUsuario,
  autorizarRoles("ADMINISTRADOR", "EVALUADOR"),
];

// 1. Postulación pública (abierta a postulantes)
router.post("/postularse", validarBody(postularseSchema), postularse);

// 2. Consulta de trámites (requiere rol ADMINISTRADOR o EVALUADOR)
router.get(
  "/",
  ...evaluadoresOAdmin,
  validarConsulta(consultarInscripcionesSchema),
  consultarInscripciones
);

// 3. Evaluar trámite (cambiar estado y opcionalmente asignar/liberar stand)
router.patch(
  "/:id/estado",
  ...evaluadoresOAdmin,
  validarParametros(inscripcionIdParamSchema),
  validarBody(cambiarEstadoSchema),
  cambiarEstadoInscripcion
);

export default router;