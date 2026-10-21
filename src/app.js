import express from "express"
import { logger } from "./middlewares/logger.js"
import { manejadorErrores } from "./middlewares/manejadorErrores.js"
import { noEncontrado } from "./middlewares/noEncontrado.js"

import indexRoutes from "./routes/index.routes.js"

import { iniciarLimpiezaRevocaciones } from "./tareas/limpiezaRevocaciones.js";

// Serialización global de BigInt para evitar caídas en JSON.stringify
BigInt.prototype.toJSON = function () {
  return Number(this) <= Number.MAX_SAFE_INTEGER ? Number(this) : this.toString();
};

const app = express();
const PORT = 3000;
app.use(logger)
app.use(express.json());

app.use("/api", indexRoutes);

app.get('/', (req, res) => {
  res.json({ mensaje: 'API Funcionando' })
})

app.use(noEncontrado)

app.use(manejadorErrores)

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  iniciarLimpiezaRevocaciones()
});

export default app;