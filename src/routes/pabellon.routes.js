import { Router } from "express";
import {
  obtenerTodos,
  obtenerPorId,
  crear,
  actualizar,
  eliminar,
} from "../controllers/pabellon.controller.js";
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
  crearPabellonSchema,
  actualizarPabellonSchema,
  pabellonIdParamSchema,
} from "../validators/pabellon.schema.js";

const router = Router();

const soloAdmin = [
  autenticarUsuario,
  cargarContextoUsuario,
  autorizarRoles("ADMINISTRADOR"),
];

// Rutas Públicas (Lectura)
router.get("/", obtenerTodos);
router.get("/:id", validarParametros(pabellonIdParamSchema), obtenerPorId);

// Rutas Protegidas (Gestión Administrativa)
router.post(
  "/",
  ...soloAdmin,
  validarBody(crearPabellonSchema),
  crear
);

router.put(
  "/:id",
  ...soloAdmin,
  validarParametros(pabellonIdParamSchema),
  validarBody(actualizarPabellonSchema),
  actualizar
);

router.delete(
  "/:id",
  ...soloAdmin,
  validarParametros(pabellonIdParamSchema),
  eliminar
);

export default router;