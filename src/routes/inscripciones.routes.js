import express from "express";
import {
  postularse,
  consultarInscripciones,
  cambiarEstadoInscripcion,
} from "../controllers/inscripciones.controller.js";

import { soloAdmin } from "../middlewares/soloAdmin.js";

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


// 1. Postulación pública (abierta a postulantes)
router.post("/postularse", validarBody(postularseSchema), postularse);

// 2. Consulta de trámites (requiere rol Administrador)
router.get(
  "/",
  ...soloAdmin(),
  validarConsulta(consultarInscripcionesSchema),
  consultarInscripciones
);

// 3. Evaluar trámite (cambiar estado y opcionalmente asignar/liberar stand)
router.patch(
  "/:id/estado",
  ...soloAdmin(),
  validarParametros(inscripcionIdParamSchema),
  validarBody(cambiarEstadoSchema),
  cambiarEstadoInscripcion
);

export default router;