import { Router } from "express";
import {
  obtenerTodos,
  obtenerPorId,
  crear,
  actualizar,
  eliminar,
} from "../controllers/stand.controller.js";

// Importamos los middlewares centrales
import { autenticarUsuario } from "../middlewares/autenticacion.middleware.js";
import {
  cargarContextoUsuario,
  autorizarRoles,
} from "../middlewares/autorizacion.middleware.js";
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

// Middleware compuesto: solo usuarios autenticados con rol ADMINISTRADOR
const soloAdmin = [
  autenticarUsuario,
  cargarContextoUsuario,
  autorizarRoles("ADMINISTRADOR"),
];

// Rutas Públicas (Lectura)
router.get("/", obtenerTodos);
router.get("/:id", validarParametros(standIdParamSchema), obtenerPorId);

// Rutas Protegidas (Gestión)
router.post(
  "/",
  ...soloAdmin,
  validarBody(crearStandSchema),
  crear
);

router.put(
  "/:id",
  ...soloAdmin,
  validarParametros(standIdParamSchema),
  validarBody(actualizarStandSchema),
  actualizar
);

router.delete(
  "/:id",
  ...soloAdmin,
  validarParametros(standIdParamSchema),
  eliminar
);

export default router;