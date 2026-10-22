import { autenticarUsuario } from "../middlewares/autenticacion.middleware.js";
import {
  cargarContextoUsuario,
  autorizarRoles,
} from "../middlewares/autorizacion.middleware.js";

export const soloArtesano = () => [ autenticarUsuario, cargarContextoUsuario, autorizarRoles("ARTESANO") ]