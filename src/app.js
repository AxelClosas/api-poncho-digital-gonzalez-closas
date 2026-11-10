import express from "express"
import { logger } from "./middlewares/logger.js"
import { manejadorErrores } from "./middlewares/manejadorErrores.js"
import { noEncontrado } from "./middlewares/noEncontrado.js"

import swaggerUi from "swagger-ui-express";
import { readFileSync } from "node:fs";

import indexRoutes from "./routes/index.routes.js"

import { iniciarLimpiezaRevocaciones } from "./tareas/limpiezaRevocaciones.js";

// Serialización global de BigInt para evitar caídas en JSON.stringify
BigInt.prototype.toJSON = function () {
  return Number(this) <= Number.MAX_SAFE_INTEGER ? Number(this) : this.toString();
};

const app = express();
const PORT = 3000;
// Quizás pueda reutilizar la función ruta que definí en generar-docs.js para no repetir código
const swaggerDocument = JSON.parse(
  readFileSync(new URL("../swagger-output.json", import.meta.url), "utf8"),
);

app.use(logger)
app.use(express.json());

app.use("/api", indexRoutes);

app.get('/',
  /*
  #swagger.auto = false
  #swagger.tags = ["General"]
  #swagger.summary = "Información general de la API"
  */
  (req, res) => {
  res.json({
    "nombre": "API Poncho Digital",
    "version": "1.0.0",
    "descripcion": "API REST para la gestión del Festival del Poncho",
    "documentacion": "/docs",
    "endpoints": {
      "usuarios": "/api/usuarios",
      "rubros": "/api/rubros",
      "pabellones": "/api/pabellones",
      "stands": "/api/stands",
      "sectores": "/api/sectores",
      "emprendimientos": "/api/emprendimientos",
      "productos": "/api/productos",
      "inscripciones": "/api/inscripciones",
      "roles": "/api/roles",
      "estados": "/api/estados"
    }
  })
})

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(noEncontrado)



app.use(manejadorErrores)

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  iniciarLimpiezaRevocaciones()
});

export default app;