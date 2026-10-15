// src/routes/rubro.routes.js
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
import { validarId } from "../middlewares/validarId.js";
import { validarSchema } from "../middlewares/validarSchema.js";
import {
  crearRubroSchema,
  actualizarRubroSchema,
} from "../validators/rubro.schema.js";

const router = Router();

const soloAdmin = [
  autenticarUsuario,
  cargarContextoUsuario,
  autorizarRoles("ADMINISTRADOR"),
];

// Rutas Públicas (Lectura)
router.get("/", obtenerTodos);
router.get("/:id", validarId, obtenerPorId);

// Rutas Protegidas
router.post("/", ...soloAdmin, validarSchema(crearRubroSchema), crear);
router.put("/:id", ...soloAdmin, validarId, validarSchema(actualizarRubroSchema), actualizar);
router.delete("/:id", ...soloAdmin, validarId, eliminar);

export default router;