import express from "express"
import { logger } from "./middlewares/logger.js"
import { manejadorErrores } from "./middlewares/manejadorErrores.js"
import { noEncontrado } from "./middlewares/noEncontrado.js"

import indexRoutes from "./routes/index.routes.js"

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
});

export default app;