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
import { registrarTendencia } from "../middlewares/tendencias.middleware.js";
import {
  crearProductoSchema,
  actualizarProductoSchema,
  productoIdParamSchema,
  consultarProductosSchema,
} from "../validators/productos.schemas.js";

const router = express.Router();


// Rutas Públicas (Catálogo y Detalle)
router.get("/",
  /*
  #swagger.auto = false
  #swagger.tags = ['Productos']
  #swagger.security = [{}] 
  #swagger.summary = 'Consultar el catálogo de productos con filtros y paginación'

  #swagger.parameters['busqueda'] ={
    in: 'query',
    description:'Búsqueda parcial por nombre o descripción, sin distinguir mayúsculas.',
    required: false,
    type: 'string'
  }

  #swagger.parameters['emprendimientoId'] = {
      in: 'query',
      description: 'Filtrar por el nombre del emprendimiento.',
      required: false,
      type: 'string'
    }

    #swagger.parameters['rubro'] = {
      in: 'query',
      description: 'Filtrar por el nombre del rubro del emprendimiento.',
      required: false,
      type: 'string'
    }

    #swagger.parameters['ordenPor'] = {
      in: 'query',
      required: false,
      type: 'string',
      schema: {
        '@enum': ['nombre', 'precio', 'id'],
      },
      default: 'id'
    }

    #swagger.parameters['direccion'] = {
      in: 'query',
      required: false,
      type: 'string',
      schema: {
        '@enum': ['asc', 'desc'],
      },
      default: 'asc'
    }

    #swagger.parameters['pagina'] = {
      in: 'query',
      required: false,
      type: 'integer',
      minimum: 1,
      default: 1
    }

    #swagger.parameters['limite'] = {
      in: 'query',
      description: 'Cantidad de productos por página. Máximo: 50.',
      required: false,
      type: 'integer',
      minimum: 1,
      maximum: 50,
      default: 10
    }

    #swagger.responses[200] = {
      description: 'Listado paginado de productos.',
      content: {
        "application/json": {
          schema: { $ref: '#/components/schemas/ListaProductosPaginada' }
        }
      }
    }

    #swagger.responses[400] = {
      description: 'Parámetros de consulta inválidos.'
    }
  */
  validarConsulta(consultarProductosSchema),
  registrarTendencia("PRODUCTO"),
  consultarProductos);
router.get("/:id",
  /*
  #swagger.auto = false
  #swagger.tags = ['Productos']
  #swagger.summary = 'Obtiene un producto por su UUID.'
  #swagger.security = [{}] 

  #swagger.parameters['id'] = {
    in: 'path',
    required: true,
    schema: { type: 'string', format: 'uuid' }
  }

  #swagger.responses[200] = {
    description: 'Detalles del producto.',
    content: {
      "application/json": {
        schema: { $ref: '#/components/schemas/Producto' }
      }
    }
  }

  #swagger.responses[400] = {
    description: 'Parámetros de ruta inválidos.'
  }

  #swagger.responses[404] = {
    description: 'Producto no encontrado.'
  }
  */ validarParametros(productoIdParamSchema), obtenerProductoPorId);

// Rutas Protegidas del Artesano
router.get("/me/mis-productos",
  /*
  #swagger.auto = false
  #swagger.tags = ['Productos']
  #swagger.security = [{ "bearerAuth": [] }]
  #swagger.summary = 'Listar los productos del artesano autenticado.' 

  #swagger.responses[200] = {
      description: 'Productos propios. Devuelve [] si no posee un emprendimiento o productos.',
      content: {
        "application/json": {
          schema: {
            type: 'array',
            items: { $ref: '#/components/schemas/Producto' }
          }
        }
      }
    }
    
    #swagger.responses[400] = {
      description: 'Formato de autorización inválido.'
    }

    #swagger.responses[401] = {
      description: 'Token ausente, inválido, vencido o revocado.'
    }

    #swagger.responses[403] = {
      description: 'Cuenta inactiva o usuario sin el rol ARTESANO.'
    }
  */ ...soloArtesano(), listarMisProductos);
router.post("/",
  /*
    #swagger.auto = false
    #swagger.tags = ['Productos']
    #swagger.security = [{ bearerAuth: [] }]
    #swagger.summary = "Crea un producto en el emprendimiento del artesano autenticado."

    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: { $ref: '#/components/schemas/CrearProducto' }
        }
      }
    }

    #swagger.responses[201] = {
      description: 'Producto creado correctamente.',
      content: {
        "application/json": {
          schema: { $ref: '#/components/schemas/ProductoDetalle' }
        }
      }
    }

    #swagger.responses[400] = {
      description: 'Datos inválidos, formato de autorización incorrecto o artesano sin emprendimiento.'
    }

    #swagger.responses[401] = {
      description: 'Token ausente, inválido, vencido o revocado.'
    }

    #swagger.responses[403] = {
      description: 'Cuenta inactiva o usuario sin el rol ARTESANO.'
    }
  */
  ...soloArtesano(), validarBody(crearProductoSchema), crearProducto);
router.put(
  "/:id",/*
    #swagger.auto = false
    #swagger.tags = ['Productos']
    #swagger.security = [{ bearerAuth: [] }]
    #swagger.summary = "Actualiza un producto del artesano autenticado."
    #swagger.description = "Todos los campos del cuerpo son opcionales."

    #swagger.parameters['id'] = {
      in: 'path',
      required: true,
      schema: { type: 'string', format: 'uuid' }
    }

    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: { $ref: '#/components/schemas/ActualizarProducto' }
        }
      }
    }

    #swagger.responses[200] = {
      description: 'Producto actualizado correctamente.',
      content: {
        "application/json": {
          schema: { $ref: '#/components/schemas/ProductoDetalle' }
        }
      }
    }

    #swagger.responses[400] = {
      description: 'UUID, cuerpo o formato de autorización inválidos.'
    }

    #swagger.responses[401] = {
      description: 'Token ausente, inválido, vencido o revocado.'
    }

    #swagger.responses[403] = {
      description: 'Cuenta inactiva, usuario sin rol ARTESANO o producto perteneciente a otro usuario.'
    }

    #swagger.responses[404] = {
      description: 'Producto no encontrado.'
    }
  */
  ...soloArtesano(),
  validarParametros(productoIdParamSchema),
  validarBody(actualizarProductoSchema),
  actualizarProducto
);
router.delete("/:id",/*
    #swagger.auto = false
    #swagger.tags = ['Productos']
    #swagger.security = [{ bearerAuth: [] }]
    #swagger.summary = "Elimina un producto del artesano autenticado."

    #swagger.parameters['id'] = {
      in: 'path',
      required: true,
      schema: { type: 'string', format: 'uuid' }
    }

    #swagger.responses[204] = {
      description: 'Producto eliminado correctamente. Sin cuerpo de respuesta.'
    }

    #swagger.responses[400] = {
      description: 'UUID o formato de autorización inválidos.'
    }

    #swagger.responses[401] = {
      description: 'Token ausente, inválido, vencido o revocado.'
    }

    #swagger.responses[403] = {
      description: 'Cuenta inactiva, usuario sin rol ARTESANO o producto perteneciente a otro usuario.'
    }

    #swagger.responses[404] = {
      description: 'Producto no encontrado.'
    }
  */ ...soloArtesano(), validarParametros(productoIdParamSchema), eliminarProducto);

export default router;