import { verificarToken } from "../services/tokens.service.js";
import { crearError } from "../utils/errores.js";

export const autenticarUsuario = (req, res, next) => {
  try {
    const encabezado = req.get("Authorization");

    if (!encabezado) {
      res.set("WWW-Authenticate", "Bearer");
      throw crearError("Se requiere un token de acceso.", 401);
    }

    const coincidencia = /^Bearer +(\S+)$/i.exec(encabezado);

    if (!coincidencia) {
      res.set("WWW-Authenticate", 'Bearer error="invalid_request"');
      throw crearError("Formato de autorización inválido. Debe ser: Bearer <token>", 400);
    }

    // Inyecta id, jti y exp en la petición
    req.usuario = verificarToken(coincidencia[1]);
    return next();
  } catch (error) {
    return next(error);
  }
};