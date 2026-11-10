import "dotenv/config";

export const secretoJWT = process.env.JWT_SECRET;
export const expJWT = process.env.EXP_JWT;

if (!secretoJWT?.trim()) {
  throw new Error("Falta configurar la variable de entorno JWT_SECRET en el archivo .env.");
}

if (!expJWT?.trim()) {
  throw new Error("Falta configurar la variable de entorno EXP_JWT en el archivo .env.");
}