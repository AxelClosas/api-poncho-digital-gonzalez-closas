import express from "express";
import {
  crearAdministrador,
  iniciarSesion,
  consultarUsuarios,
  obtenerUsuarioPorId,
  obtenerMiPerfil,
  cambiarEstadoActivo,
  agregarRol,
  eliminarRol,
} from "../controllers/usuarios.controller.js";

import { autenticarUsuario } from "../middlewares/autenticacion.middleware.js";
import {
  cargarContextoUsuario,
  autorizarRoles,
} from "../middlewares/autorizacion.middleware.js";

import { soloAdmin } from "../middlewares/soloAdmin.js";

import {
  validarBody,
  validarConsulta,
  validarParametros,
} from "../middlewares/validacion.middleware.js";
import {
  crearAdministradorSchema,
  iniciarSesionSchema,
  consultarUsuariosSchema,
  usuarioIdParamSchema,
  cambiarActivoSchema,
  asignarRolSchema,
  rolParamSchema,
} from "../validators/usuarios.schemas.js";

import { cerrarSesion } from "../controllers/sesiones.controller.js";


const router = express.Router();

// Middleware compuesto: solo usuarios autenticados con rol ADMINISTRADOR
// const controlAdministrador = [
//   autenticarUsuario,
//   cargarContextoUsuario,
//   autorizarRoles("Administrador"),
// ];

// 1. Ruta pública de acceso
router.post("/login", validarBody(iniciarSesionSchema), iniciarSesion);
router.post("/logout", autenticarUsuario, cerrarSesion);

// 2. Ruta para obtener el perfil propio del usuario autenticado
router.get("/me", autenticarUsuario, cargarContextoUsuario, obtenerMiPerfil);

// 3. Rutas protegidas exclusivas de Administración
// Crear ADMIN
router.post(
  "/administradores",
  ...soloAdmin(),
  validarBody(crearAdministradorSchema),
  crearAdministrador
);

// CONSULTAR USUARIOS
router.get(
  "/",
  ...soloAdmin(),
  validarConsulta(consultarUsuariosSchema),
  consultarUsuarios
);

// OBTENER USUARIO POR ID
router.get(
  "/:id",
  ...soloAdmin(),
  validarParametros(usuarioIdParamSchema),
  obtenerUsuarioPorId
);

// CAMBIAR ESTADO ACTIVO - ACTIVAR CUENTA DE USUARIO
router.patch(
  "/:id/activo",
  ...soloAdmin(),
  validarParametros(usuarioIdParamSchema),
  validarBody(cambiarActivoSchema),
  cambiarEstadoActivo
);

// ASIGNAR NUEVO ROL A USUARIO
router.post(
  "/:id/roles",
  ...soloAdmin(),
  validarParametros(usuarioIdParamSchema),
  validarBody(asignarRolSchema),
  agregarRol
);

// ELIMINAR ROL DE USUARIO
// TODO: Cambiar id autoincremental de roles por UUID y actualizar la ruta para que sea más RESTful: /usuarios/:id/roles/:rolId
router.delete(
  "/:id/roles/:rol",
  ...soloAdmin(),
  validarParametros(rolParamSchema),
  eliminarRol
);

export default router;