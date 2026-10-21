import { Router } from "express";
import {
  obtenerTodos,
  obtenerPorId,
  crear,
  actualizar,
  eliminar,
} from "../controllers/sector.controller.js";

import { soloAdmin } from "../middlewares/soloAdmin.js";

import {
  validarBody,
  validarParametros,
} from "../middlewares/validacion.middleware.js";
import {
  crearSectorSchema,
  actualizarSectorSchema,
  sectorIdParamSchema,
} from "../validators/sector.schema.js";

const router = Router();


// Rutas Públicas (Lectura)
router.get("/", obtenerTodos);
router.get("/:id", validarParametros(sectorIdParamSchema), obtenerPorId);

// Rutas Protegidas (Gestión Administrativa)
router.post(
  "/",
  ...soloAdmin(),
  validarBody(crearSectorSchema),
  crear
);

router.put(
  "/:id",
  ...soloAdmin(),
  validarParametros(sectorIdParamSchema),
  validarBody(actualizarSectorSchema),
  actualizar
);

router.delete(
  "/:id",
  ...soloAdmin(),
  validarParametros(sectorIdParamSchema),
  eliminar
);

export default router;