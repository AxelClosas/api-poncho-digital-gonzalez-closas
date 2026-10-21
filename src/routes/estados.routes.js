import express from "express";
import {
  listarEstados,
  obtenerEstado,
  crearEstado,
  actualizarEstado,
  eliminarEstado,
} from "../controllers/estados.controller.js";

import { soloAdmin } from "../middlewares/soloAdmin.js";

import {
  validarBody,
  validarParametros,
} from "../middlewares/validacion.middleware.js";
import {
  crearEstadoSchema,
  actualizarEstadoSchema,
  estadoIdParamSchema,
} from "../validators/estados.schemas.js";

const router = express.Router();



router.get("/", ...soloAdmin(), listarEstados);
router.get("/:id", ...soloAdmin(), validarParametros(estadoIdParamSchema), obtenerEstado);
router.post("/", ...soloAdmin(), validarBody(crearEstadoSchema), crearEstado);
router.put("/:id", ...soloAdmin(), validarParametros(estadoIdParamSchema), validarBody(actualizarEstadoSchema), actualizarEstado);
router.delete("/:id", ...soloAdmin(), validarParametros(estadoIdParamSchema), eliminarEstado);

export default router;