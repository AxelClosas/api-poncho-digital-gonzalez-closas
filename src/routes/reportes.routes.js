import express from "express";
import {
  reporteArtesanos,
  reporteArtesanosPorLocalidad,
  reporteArtesanosPorRubro,
  reporteOcupacionStands,
  reporteProductosPorArtesano,
  reporteTendenciasBusqueda,
} from "../controllers/reportes.controller.js";

import { soloAdmin } from "../middlewares/soloAdmin.js";

const router = express.Router();

// 1. Reporte de artesanos registrados
router.get(
  "/artesanos",
  /* 
    #swagger.tags = ['Reportes']
    #swagger.summary = "Genera el reporte consolidado de artesanos registrados (Solo Administrador)."
    #swagger.auto = false
    #swagger.responses[200] = {
      description: "Métricas y listado de artesanos registrados obtenido con éxito.",
      content: { "application/json": { schema: { $ref: "#/components/schemas/ReporteArtesanosRespuesta" } } }
    }
    #swagger.responses[401] = {
      description: "Token ausente, inválido o revocado.",
      content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorApi" } } }
    }
    #swagger.responses[403] = {
      description: "Acceso denegado: requiere rol ADMINISTRADOR.",
      content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorApi" } } }
    }
  */
  ...soloAdmin(),
  reporteArtesanos
);

// 2. Reporte de artesanos registrados por localidad
router.get(
  "/artesanos-por-localidad",
  /* 
    #swagger.tags = ['Reportes']
    #swagger.summary = "Genera la distribución geográfica de artesanos por localidad y departamento (Solo Administrador)."
    #swagger.auto = false
    #swagger.responses[200] = {
      description: "Distribución geográfica de artesanos obtenida con éxito.",
      content: { "application/json": { schema: { $ref: "#/components/schemas/ReporteArtesanosPorLocalidadRespuesta" } } }
    }
    #swagger.responses[401] = {
      description: "Token ausente, inválido o revocado.",
      content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorApi" } } }
    }
    #swagger.responses[403] = {
      description: "Acceso denegado: requiere rol ADMINISTRADOR.",
      content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorApi" } } }
    }
  */
  ...soloAdmin(),
  reporteArtesanosPorLocalidad
);

// 3. Reporte de artesanos registrados por rubro
router.get(
  "/artesanos-por-rubro",
  /* 
    #swagger.tags = ['Reportes']
    #swagger.summary = "Genera la distribución de emprendimientos artesanos clasificados por rubro (Solo Administrador)."
    #swagger.auto = false
    #swagger.responses[200] = {
      description: "Distribución por rubro artesanal obtenida con éxito.",
      content: { "application/json": { schema: { $ref: "#/components/schemas/ReporteArtesanosPorRubroRespuesta" } } }
    }
    #swagger.responses[401] = {
      description: "Token ausente, inválido o revocado.",
      content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorApi" } } }
    }
    #swagger.responses[403] = {
      description: "Acceso denegado: requiere rol ADMINISTRADOR.",
      content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorApi" } } }
    }
  */
  ...soloAdmin(),
  reporteArtesanosPorRubro
);

// 4. Reporte de stands ocupados y disponibles
router.get(
  "/stands-ocupacion",
  /* 
    #swagger.tags = ['Reportes']
    #swagger.summary = "Genera el reporte de capacidad y ocupación de stands global y por pabellón (Solo Administrador)."
    #swagger.auto = false
    #swagger.responses[200] = {
      description: "Métricas de ocupación de stands obtenidas con éxito.",
      content: { "application/json": { schema: { $ref: "#/components/schemas/ReporteOcupacionStandsRespuesta" } } }
    }
    #swagger.responses[401] = {
      description: "Token ausente, inválido o revocado.",
      content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorApi" } } }
    }
    #swagger.responses[403] = {
      description: "Acceso denegado: requiere rol ADMINISTRADOR.",
      content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorApi" } } }
    }
  */
  ...soloAdmin(),
  reporteOcupacionStands
);

// 5. Reporte de productos publicados por artesano
router.get(
  "/productos-por-artesano",
  /* 
    #swagger.tags = ['Reportes']
    #swagger.summary = "Genera la auditoría de cantidad de productos publicados y precios promedio por artesano (Solo Administrador)."
    #swagger.auto = false
    #swagger.responses[200] = {
      description: "Listado de productos publicados por artesano obtenido con éxito.",
      content: { "application/json": { schema: { $ref: "#/components/schemas/ReporteProductosPorArtesanoRespuesta" } } }
    }
    #swagger.responses[401] = {
      description: "Token ausente, inválido o revocado.",
      content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorApi" } } }
    }
    #swagger.responses[403] = {
      description: "Acceso denegado: requiere rol ADMINISTRADOR.",
      content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorApi" } } }
    }
  */
  ...soloAdmin(),
  reporteProductosPorArtesano
);

// 6. Reporte de tendencias de búsqueda de visitantes
router.get(
  "/tendencias-busqueda",
  /* 
    #swagger.tags = ['Reportes']
    #swagger.summary = "Genera el ranking de tendencias de términos más buscados por los visitantes (Solo Administrador)."
    #swagger.auto = false
    #swagger.parameters['dias'] = { in: 'query', type: 'integer', default: 30, description: 'Rango de días hacia atrás a analizar' }
    #swagger.parameters['limite'] = { in: 'query', type: 'integer', default: 10, description: 'Cantidad máxima de términos en el ranking' }
    #swagger.parameters['entidad'] = { in: 'query', type: 'string', enum: ['PRODUCTO', 'EMPRENDIMIENTO'], description: 'Filtrar por catálogo específico' }
    #swagger.responses[200] = {
      description: "Ranking de tendencias de búsqueda obtenido con éxito.",
      content: { "application/json": { schema: { $ref: "#/components/schemas/ReporteTendenciasBusquedaRespuesta" } } }
    }
    #swagger.responses[401] = {
      description: "Token ausente, inválido o revocado.",
      content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorApi" } } }
    }
    #swagger.responses[403] = {
      description: "Acceso denegado: requiere rol ADMINISTRADOR.",
      content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorApi" } } }
    }
  */
  ...soloAdmin(),
  reporteTendenciasBusqueda
);

export default router;

