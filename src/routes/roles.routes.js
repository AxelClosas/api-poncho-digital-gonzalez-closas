import express from "express";
import {
  listarRoles,
  obtenerRol,
  crearRol,
  actualizarRol,
  eliminarRol,
} from "../controllers/roles.controller.js";
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
  crearRolSchema,
  actualizarRolSchema,
  rolIdParamSchema,
} from "../validators/roles.schemas.js";

const router = express.Router();

const soloAdmin = [
  autenticarUsuario,
  cargarContextoUsuario,
  autorizarRoles("ADMINISTRADOR"),
];

router.get("/", ...soloAdmin, listarRoles);
router.get("/:id", ...soloAdmin, validarParametros(rolIdParamSchema), obtenerRol);
router.post("/", ...soloAdmin, validarBody(crearRolSchema), crearRol);
router.put("/:id", ...soloAdmin, validarParametros(rolIdParamSchema), validarBody(actualizarRolSchema), actualizarRol);
router.delete("/:id", ...soloAdmin, validarParametros(rolIdParamSchema), eliminarRol);

export default router;