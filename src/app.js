import express from "express"
import { logger } from "./middlewares/logger.js"
import { manejadorErrores } from "./middlewares/manejadorErrores.js"
import { noEncontrado } from "./middlewares/noEncontrado.js"
import postulacionesRoutes from "./routes/postulaciones.routes.js"
import pabellonRoutes from "./routes/pabellon.routes.js"
import standRoutes from "./routes/stand.routers.js"
import sectorRoutes from "./routes/sector.routers.js"

const app = express();
const PORT = 3000;
app.use(logger)
app.use(express.json());

app.use("/api/pabellones",pabellonRoutes);
app.use("/api/stands",standRoutes);
app.use("/api/sectores",sectorRoutes);
app.use(postulacionesRoutes);

app.get('/', (req, res) => {
  res.json({ mensaje: 'API Funcionando' })
})

app.use(noEncontrado)

app.use(manejadorErrores)

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

export default app;