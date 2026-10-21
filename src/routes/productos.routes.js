import express from "express";
import {
  crearProducto,
  consultarProductos,
  obtenerProductoPorId,
  listarMisProductos,
  actualizarProducto,
  eliminarProducto,
} from "../controllers/productos.controller.js";

import { soloArtesano } from "../middlewares/soloArtesano.js";

import {
  validarBody,
  validarConsulta,
  validarParametros,
} from "../middlewares/validacion.middleware.js";
import {
  crearProductoSchema,
  actualizarProductoSchema,
  productoIdParamSchema,
  consultarProductosSchema,
} from "../validators/productos.schemas.js";

const router = express.Router();


// Rutas Públicas (Catálogo y Detalle)
router.get("/", validarConsulta(consultarProductosSchema), consultarProductos);
router.get("/:id", validarParametros(productoIdParamSchema), obtenerProductoPorId);

// Rutas Protegidas del Artesano
router.get("/me/mis-productos", ...soloArtesano(), listarMisProductos);
router.post("/", ...soloArtesano(), validarBody(crearProductoSchema), crearProducto);
router.put(
  "/:id",
  ...soloArtesano(),
  validarParametros(productoIdParamSchema),
  validarBody(actualizarProductoSchema),
  actualizarProducto
);
router.delete("/:id", ...soloArtesano(), validarParametros(productoIdParamSchema), eliminarProducto);

export default router;