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

const router = express.Router();

// Middleware compuesto: solo usuarios autenticados con rol ADMINISTRADOR
const controlAdministrador = [
  autenticarUsuario,
  cargarContextoUsuario,
  autorizarRoles("ADMINISTRADOR"),
];

// 1. Ruta pública de acceso
router.post("/login", validarBody(iniciarSesionSchema), iniciarSesion);

// 2. Ruta para obtener el perfil propio del usuario autenticado
router.get("/me", autenticarUsuario, cargarContextoUsuario, obtenerMiPerfil);

// 3. Rutas protegidas exclusivas de Administración
router.post(
  "/administradores",
  ...controlAdministrador,
  validarBody(crearAdministradorSchema),
  crearAdministrador
);

router.get(
  "/",
  ...controlAdministrador,
  validarConsulta(consultarUsuariosSchema),
  consultarUsuarios
);

router.get(
  "/:id",
  ...controlAdministrador,
  validarParametros(usuarioIdParamSchema),
  obtenerUsuarioPorId
);

router.patch(
  "/:id/activo",
  ...controlAdministrador,
  validarParametros(usuarioIdParamSchema),
  validarBody(cambiarActivoSchema),
  cambiarEstadoActivo
);

router.post(
  "/:id/roles",
  ...controlAdministrador,
  validarParametros(usuarioIdParamSchema),
  validarBody(asignarRolSchema),
  agregarRol
);

router.delete(
  "/:id/roles/:rol",
  ...controlAdministrador,
  validarParametros(rolParamSchema),
  eliminarRol
);

export default router;