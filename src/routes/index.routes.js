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
import reportesRoutes from "./reportes.routes.js";


const router = Router()

router.use("/usuarios",
  /* #swagger.tags = ["usuarios"]
  #swagger.security = [{ bearerAuth: [] }]*/
  usuariosRoutes);

router.use("/pabellones",
  /* #swagger.tags = ["pabellones"] */
  pabellonRoutes);

router.use("/stands",
  /* #swagger.tags = ["stands"] */
  standRoutes);

router.use("/sectores",
  /* #swagger.tags = ["sectores"] */
  sectorRoutes);

router.use("/emprendimientos",
  /* #swagger.tags = ["emprendimientos"] */
  emprendimientoRoutes);

router.use("/rubros",
  /* #swagger.tags = ["rubros"] */
  rubroRoutes);

router.use("/roles",
  /* #swagger.tags = ["roles"] */
  rolesRoutes);

router.use("/estados",
  /* #swagger.tags = ["estados"] */
  estadosRoutes);

router.use("/productos",
  /* #swagger.tags = ["productos"] */
  productosRoutes);

router.use("/inscripciones",
  /* #swagger.tags = ["inscripciones"]
  
  */
  
  inscripcionesRoutes
);

router.use("/reportes",
  /* #swagger.tags = ["Reportes"]
     #swagger.security = [{ bearerAuth: [] }]
  */
  reportesRoutes
);

export default router