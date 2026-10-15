import express from "express"
import { logger } from "./middlewares/logger.js"
import { manejadorErrores } from "./middlewares/manejadorErrores.js"
import { noEncontrado } from "./middlewares/noEncontrado.js"
import postulacionesRoutes from "./routes/postulaciones.routes.js"
import pabellonRoutes from "./routes/pabellon.routes.js"
import standRoutes from "./routes/stand.routers.js"
import sectorRoutes from "./routes/sector.routers.js"
import emprendimientoRoutes from "./routes/emprendimiento.routers.js";
import rubroRoutes from "./routes/rubro.routers.js";

const app = express();
const PORT = 3000;
app.use(logger)
app.use(express.json());

app.use("/api/pabellones",pabellonRoutes);
app.use("/api/stands",standRoutes);
app.use("/api/sectores",sectorRoutes);
app.use(postulacionesRoutes);
app.use("/api/emprendimientos", emprendimientoRoutes);
app.use("/api/rubros", rubroRoutes);


app.get('/', (req, res) => {
  res.json({ mensaje: 'API Funcionando' })
})

app.use(noEncontrado)

app.use(manejadorErrores)

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

export default app;