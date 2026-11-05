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

// 1. Ruta pública de acceso
router.post("/login",
  /* 
    #swagger.security = [{ "bearerAuth": [] }]
  #swagger.summary = "Permite a un usuario iniciar sesión con una cuenta activa."
  #swagger.auto = false

  #swagger.requestBody = { required: true, content: {
  "application/json": { schema: { $ref: "#/components/schemas/IniciarSesion" } } }
  }

  #swagger.responses[201] = {
    description: "Inscripción creada.", content: {
    "application/json": { schema: { $ref: "#/components/schemas/UsuarioAutenticado" } } }
  }

  #swagger.responses[401] = {
    description: "Token ausente o inválido.", content: {
    "application/json": { schema: { $ref: "#/components/schemas/ErrorApi" },
    example: { mensaje: "Se requiere un token de acceso." } } }
  }

  #swagger.responses[400] = { description: "Cuerpo inválido o Bearer mal formado." }

  #swagger.responses[403] = { description: "Cuenta inactiva." }

  #swagger.responses[404] = { description: "Usuario no encontrado." }  
  */
  
  validarBody(iniciarSesionSchema), iniciarSesion);
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
  "/:id/roles",
  ...soloAdmin(),
  validarParametros(usuarioIdParamSchema),
  eliminarRol
);

export default router;