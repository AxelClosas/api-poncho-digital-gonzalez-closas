import express from "express";
import {
  crearProducto,
  consultarProductos,
  obtenerProductoPorId,
  listarMisProductos,
  actualizarProducto,
  eliminarProducto,
} from "../controllers/productos.controller.js";
import { autenticarUsuario } from "../middlewares/autenticacion.middleware.js";
import {
  cargarContextoUsuario,
  autorizarRoles,
} from "../middlewares/autorizacion.middleware.js";
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

const soloArtesanos = [
  autenticarUsuario,
  cargarContextoUsuario,
  autorizarRoles("ARTESANO"),
];

// Rutas Públicas (Catálogo y Detalle)
router.get("/", validarConsulta(consultarProductosSchema), consultarProductos);
router.get("/:id", validarParametros(productoIdParamSchema), obtenerProductoPorId);

// Rutas Protegidas del Artesano
router.get("/me/mis-productos", ...soloArtesanos, listarMisProductos);
router.post("/", ...soloArtesanos, validarBody(crearProductoSchema), crearProducto);
router.put(
  "/:id",
  ...soloArtesanos,
  validarParametros(productoIdParamSchema),
  validarBody(actualizarProductoSchema),
  actualizarProducto
);
router.delete("/:id", ...soloArtesanos, validarParametros(productoIdParamSchema), eliminarProducto);

export default router;