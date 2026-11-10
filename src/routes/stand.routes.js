import { Router } from "express";
import {
  obtenerTodos,
  obtenerPorId,
  crear,
  actualizar,
  eliminar,
} from "../controllers/stand.controller.js";

import { soloAdmin } from "../middlewares/soloAdmin.js";

import {
  validarBody,
  validarParametros,
} from "../middlewares/validacion.middleware.js";

// Importamos los schemas de Zod
import {
  crearStandSchema,
  actualizarStandSchema,
  standIdParamSchema,
} from "../validators/stand.schema.js";

const router = Router();


// Rutas Públicas (Lectura)
router.get("/", /*
    #swagger.auto = false
    #swagger.tags = ['Stands']
    #swagger.security = [{}]
    #swagger.summary = "Lista los stands con el nombre de su sector y pabellón."
    #swagger.description = "Devuelve un arreglo sin paginación. Esta consulta no devuelve IDs ni estado."

    #swagger.responses[200] = {
      description: 'Listado de stands.',
      content: {
        "application/json": {
          schema: { $ref: '#/components/schemas/ListaStands' }
        }
      }
    }
  */ obtenerTodos);
router.get("/:id", /*
    #swagger.auto = false
    #swagger.tags = ['Stands']
    #swagger.security = [{}]
    #swagger.summary = "Obtiene un stand por UUID, incluyendo su sector."

    #swagger.parameters['id'] = {
      in: 'path',
      required: true,
      '@schema': { type: 'string', format: 'uuid' }
    }

    #swagger.responses[200] = {
      description: 'Detalle del stand.',
      content: {
        "application/json": {
          schema: { $ref: '#/components/schemas/StandDetalle' }
        }
      }
    }

    #swagger.responses[400] = {
      description: 'UUID inválido.'
    }

    #swagger.responses[404] = {
      description: 'Stand no encontrado.'
    }
  */ validarParametros(standIdParamSchema), obtenerPorId);

// Rutas Protegidas (Gestión)
router.post(
  "/",/*
    #swagger.auto = false
    #swagger.tags = ['Stands']
    #swagger.security = [{ bearerAuth: [] }]
    #swagger.summary = "Crea un stand. Requiere rol ADMINISTRADOR."
    #swagger.description = "Actualmente el servicio crea el stand como DISPONIBLE aunque se envíe otro estado."

    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: { $ref: '#/components/schemas/CrearStand' }
        }
      }
    }

    #swagger.responses[201] = {
      description: 'Stand creado con su sector.',
      content: {
        "application/json": {
          schema: { $ref: '#/components/schemas/StandDetalle' }
        }
      }
    }

    #swagger.responses[400] = {
      description: 'Datos inválidos, sector inexistente o autorización mal formada.'
    }

    #swagger.responses[401] = {
      description: 'Token ausente, inválido, vencido o revocado.'
    }

    #swagger.responses[403] = {
      description: 'Cuenta inactiva o sin rol ADMINISTRADOR.'
    }
  */
  ...soloAdmin(),
  validarBody(crearStandSchema),
  crear
);

router.put(
  "/:id",/*
    #swagger.auto = false
    #swagger.tags = ['Stands']
    #swagger.security = [{ bearerAuth: [] }]
    #swagger.summary = "Actualiza un stand. Requiere rol ADMINISTRADOR."
    #swagger.description = "Todos los campos del cuerpo son opcionales."

    #swagger.parameters['id'] = {
      in: 'path',
      required: true,
      '@schema': { type: 'string', format: 'uuid' }
    }

    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: { $ref: '#/components/schemas/ActualizarStand' }
        }
      }
    }

    #swagger.responses[200] = {
      description: 'Stand actualizado con su sector.',
      content: {
        "application/json": {
          schema: { $ref: '#/components/schemas/StandDetalle' }
        }
      }
    }

    #swagger.responses[400] = {
      description: 'Datos o UUID inválidos, sector inexistente o autorización mal formada.'
    }

    #swagger.responses[401] = {
      description: 'Token ausente, inválido, vencido o revocado.'
    }

    #swagger.responses[403] = {
      description: 'Cuenta inactiva o sin rol ADMINISTRADOR.'
    }

    #swagger.responses[404] = {
      description: 'Stand no encontrado.'
    }
  */
  ...soloAdmin(),
  validarParametros(standIdParamSchema),
  validarBody(actualizarStandSchema),
  actualizar
);

router.delete(
  "/:id", /*
    #swagger.auto = false
    #swagger.tags = ['Pabellones']
    #swagger.security = [{ bearerAuth: [] }]
    #swagger.summary = "Elimina un pabellón. Requiere rol ADMINISTRADOR."

    #swagger.parameters['id'] = {
      in: 'path',
      required: true,
      '@schema': { type: 'string', format: 'uuid' }
    }

    #swagger.responses[200] = {
      description: 'Pabellón eliminado.',
      content: {
        "application/json": {
          schema: { $ref: '#/components/schemas/MensajeRespuesta' }
        }
      }
    }

    #swagger.responses[400] = {
      description: 'UUID inválido o autorización mal formada.'
    }

    #swagger.responses[401] = {
      description: 'Token ausente, inválido, vencido o revocado.'
    }

    #swagger.responses[403] = {
      description: 'Cuenta inactiva o sin rol ADMINISTRADOR.'
    }

    #swagger.responses[404] = {
      description: 'Pabellón no encontrado.'
    }

    #swagger.responses[409] = {
      description: 'El pabellón contiene sectores asociados.'
    }
  */
  ...soloAdmin(),
  validarParametros(standIdParamSchema),
  eliminar
);

export default router;
