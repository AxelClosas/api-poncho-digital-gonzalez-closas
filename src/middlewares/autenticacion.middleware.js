import jwt from "jsonwebtoken";
import { verificarToken } from "../services/tokens.service.js";
import { tokenEstaRevocado } from "../services/revocaciones.service.js";

export const autenticarUsuario = async (req, res, next) => {
  const encabezado = req.get("Authorization");

  if (!encabezado) {
    res.set("WWW-Authenticate", "Bearer");
    return res.status(401).json({
      error: "Se requiere un token de acceso.",
    });
  }

  const coincidencia = /^Bearer +(\S+)$/i.exec(encabezado);
  if (!coincidencia) {
    res.set("WWW-Authenticate", 'Bearer error="invalid_request"');
    return res.status(400).json({
      error: "Formato de autorización inválido. Debe ser: Bearer <token>",
    });
  }

  try {
    req.usuario = verificarToken(coincidencia[1]);

    if (await tokenEstaRevocado(req.usuario.jti)) {
      throw new jwt.JsonWebTokenError("Token revocado.");
    }
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.set(
        "WWW-Authenticate",
        'Bearer error="invalid_token", error_description="The token has expired"'
      );
      return res.status(401).json({ error: "El token de acceso ha expirado." });
    }

    if (error instanceof jwt.JsonWebTokenError) {
      res.set("WWW-Authenticate", 'Bearer error="invalid_token"');
      return res.status(401).json({ error: "Token inválido, vencido o revocado." });
    }

    return next(error);
  }

  return next();
};