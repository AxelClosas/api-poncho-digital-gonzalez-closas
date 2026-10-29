import { autenticarUsuario } from "../middlewares/autenticacion.middleware.js";
import {
  cargarContextoUsuario,
  autorizarRoles,
} from "../middlewares/autorizacion.middleware.js";

export const soloAdmin = () => [ autenticarUsuario, cargarContextoUsuario, autorizarRoles("ADMINISTRADOR") ]