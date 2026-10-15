import "dotenv/config";

export const secretoJWT = process.env.JWT_SECRET;

if (!secretoJWT?.trim()) {
  throw new Error("Falta configurar la variable de entorno JWT_SECRET en el archivo .env.");
}