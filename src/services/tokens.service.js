import jwt from "jsonwebtoken";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import { secretoJWT } from "../config/jwt.js";

export const generarToken = (usuario) => {
  return jwt.sign(
    { sub: usuario.id, jti: randomUUID() },
    secretoJWT,
    {
      algorithm: "HS256",
      expiresIn: "15m",
    }
  );
};

export const verificarToken = (token) => {
  const payload = jwt.verify(token, secretoJWT, {
    algorithms: ["HS256"],
  });

  if (
    typeof payload !== "object" ||
    payload === null ||
    !z.string().uuid().safeParse(payload.sub).success ||
    !Number.isFinite(payload.exp)
  ) {
    throw new jwt.JsonWebTokenError("Contenido del token inválido.");
  }

  if (typeof payload.jti !== "string" || !payload.jti.trim()) {
    throw new jwt.JsonWebTokenError("Falta el identificador del token.");
  }

  return {
    id: payload.sub,
    jti: payload.jti,
    exp: payload.exp,
  };
};