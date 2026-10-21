import { Router } from "express"

import pabellonRoutes from "./pabellon.routes.js"
import standRoutes from "./stand.routes.js"
import sectorRoutes from "./sector.routes.js"
import emprendimientoRoutes from "./emprendimiento.routes.js";
import rubroRoutes from "./rubro.routes.js";
import productosRoutes from "./productos.routes.js";
import inscripcionesRoutes from "./inscripciones.routes.js";

import rolesRoutes from "./roles.routes.js";
import estadosRoutes from "./estados.routes.js";
import usuariosRoutes from "./usuarios.routes.js";


const router = Router()

router.use("/usuarios", usuariosRoutes);

router.use("/pabellones", pabellonRoutes);
router.use("/stands", standRoutes);
router.use("/sectores", sectorRoutes);
router.use("/emprendimientos", emprendimientoRoutes);
router.use("/rubros", rubroRoutes);
router.use("/roles", rolesRoutes);
router.use("/estados", estadosRoutes);
router.use("/productos", productosRoutes);
router.use("/inscripciones", inscripcionesRoutes);

export default router