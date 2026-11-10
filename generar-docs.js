import swaggerAutogen from "swagger-autogen";
import { fileURLToPath } from "node:url";
import * as esquemas from "./src/docs/esquemas.js"

const doc = {
  info: {
    title: "API REST - Poncho Digital",
    version: "1.0.0",
    description: "Borrador: revisar esquemas, errores y permisos."
  },
  servers: [{
    url: "/",
    description: "Servidor actual"
  }],
  components: {
    securitySchemes: {
      bearerAuth: { type: "http", scheme: "bearer",
      bearerFormat: "JWT" }
    },
    "@schemas": esquemas
  },
  security: [{ bearerAuth: [] }]
};

const ruta = (archivo) => fileURLToPath(new URL(archivo, import.meta.url)).replaceAll("\\", "/");

const outputFile = ruta("./swagger-output.json");
const routes = [ruta("./src/app.js")];
const generar = swaggerAutogen({ openapi: "3.0.0" });
const resultado = await generar(outputFile, routes, doc);

if (!resultado.success) {
  throw new Error("No se pudo generar la especificación OpenAPI.");
}
