import { Router } from "express";
import {
  obtenerTodos,
  obtenerPorId,
  crear,
  actualizar,
  eliminar,
} from "../controllers/stand.controller.js";

import { soloAdmin } from "../middlewares/soloAdmin.js";

import {
  validarBody,
  validarParametros,
} from "../middlewares/validacion.middleware.js";

// Importamos los schemas de Zod
import {
  crearStandSchema,
  actualizarStandSchema,
  standIdParamSchema,
} from "../validators/stand.schema.js";

const router = Router();


// Rutas Públicas (Lectura)
router.get("/", obtenerTodos);
router.get("/:id", validarParametros(standIdParamSchema), obtenerPorId);

// Rutas Protegidas (Gestión)
router.post(
  "/",
  ...soloAdmin(),
  validarBody(crearStandSchema),
  crear
);

router.put(
  "/:id",
  ...soloAdmin(),
  validarParametros(standIdParamSchema),
  validarBody(actualizarStandSchema),
  actualizar
);

router.delete(
  "/:id",
  ...soloAdmin(),
  validarParametros(standIdParamSchema),
  eliminar
);

export default router;