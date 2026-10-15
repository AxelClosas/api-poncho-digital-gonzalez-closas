import jwt from "jsonwebtoken";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import { secretoJWT } from "../config/jwt.js";
import { crearError } from "../utils/errores.js";

export const generarToken = (usuario) => {
  return jwt.sign(
    { sub: usuario.id, jti: randomUUID() },
    secretoJWT,
    {
      algorithm: "HS256",
      expiresIn: "4h",
    }
  );
};

export const verificarToken = (token) => {
  // Si expira o la firma es inválida, jwt.verify lanza el error directamente
  const payload = jwt.verify(token, secretoJWT, {
    algorithms: ["HS256"],
  });

  // Validamos que el payload decodificado contenga un UUID válido en el campo sub
  if (
    typeof payload !== "object" ||
    payload === null ||
    !z.string().uuid().safeParse(payload.sub).success
  ) {
    throw crearError("El contenido del token no es válido.", 401);
  }

  return {
    id: payload.sub,
    jti: payload.jti,
    exp: payload.exp,
  };
};