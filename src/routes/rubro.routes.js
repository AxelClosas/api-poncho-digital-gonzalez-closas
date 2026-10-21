import { Router } from "express";
import {
  obtenerTodos,
  obtenerPorId,
  crear,
  actualizar,
  eliminar,
} from "../controllers/rubro.controller.js";
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
  crearRubroSchema,
  actualizarRubroSchema,
  rubroIdParamSchema,
} from "../validators/rubro.schema.js";

const router = Router();

const soloAdmin = [
  autenticarUsuario,
  cargarContextoUsuario,
  autorizarRoles("ADMINISTRADOR"),
];

// Rutas Públicas (Lectura)
router.get("/", obtenerTodos);
router.get("/:id", validarParametros(rubroIdParamSchema), obtenerPorId);

// Rutas Protegidas (Gestión Administrativa)
router.post(
  "/",
  ...soloAdmin,
  validarBody(crearRubroSchema),
  crear
);

router.put(
  "/:id",
  ...soloAdmin,
  validarParametros(rubroIdParamSchema),
  validarBody(actualizarRubroSchema),
  actualizar
);

router.delete(
  "/:id",
  ...soloAdmin,
  validarParametros(rubroIdParamSchema),
  eliminar
);

export default router;