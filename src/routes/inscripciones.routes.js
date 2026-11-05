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
router.post("/postularse",
  /*
  #swagger.security = [{}]
  #swagger.summary = "Permite a un usuario postularse a un puesto en el Festival del Poncho."
  #swagger.auto = false

  #swagger.requestBody = { required: true, content: {
  "application/json": { schema: { $ref: "#/components/schemas/NuevaPostulacion" } } }
  }

  #swagger.responses[201] = {
    description: "Inscripción creada.", content: {
    "application/json": { schema: { $ref: "#/components/schemas/PostulacionCreada" } } }
  }

  #swagger.responses[401] = {
    description: "Token ausente o inválido.", content: {
    "application/json": { schema: { $ref: "#/components/schemas/ErrorApi" },
    example: { mensaje: "Se requiere un token de acceso." } } }
  }

  #swagger.responses[400] = { description: "Cuerpo inválido o Bearer mal formado." }

  #swagger.responses[403] = { description: "Cuenta inactiva." }

  #swagger.responses[404] = { description: "Evento inexistente." }

  #swagger.responses[409] = { description: "Inscripción duplicada o conflicto de datos." }
*/
  validarBody(postularseSchema), postularse
  
);


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