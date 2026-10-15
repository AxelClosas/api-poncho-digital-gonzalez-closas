import { Router } from "express";
import {
  obtenerTodos,
  obtenerPorId,
  crear,
  actualizar,
  eliminar,
} from "../controllers/sector.controller.js";
import { autenticarUsuario } from "../middlewares/autenticacion.middleware.js";
import {
  cargarContextoUsuario,
  autorizarRoles,
} from "../middlewares/autorizacion.middleware.js";
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

const soloAdmin = [
  autenticarUsuario,
  cargarContextoUsuario,
  autorizarRoles("ADMINISTRADOR"),
];

// Rutas Públicas (Lectura)
router.get("/", obtenerTodos);
router.get("/:id", validarParametros(sectorIdParamSchema), obtenerPorId);

// Rutas Protegidas (Gestión Administrativa)
router.post(
  "/",
  ...soloAdmin,
  validarBody(crearSectorSchema),
  crear
);

router.put(
  "/:id",
  ...soloAdmin,
  validarParametros(sectorIdParamSchema),
  validarBody(actualizarSectorSchema),
  actualizar
);

router.delete(
  "/:id",
  ...soloAdmin,
  validarParametros(sectorIdParamSchema),
  eliminar
);

export default router;