import { Router } from "express";

import {
    obtenerTodos,
    obtenerPorId,
    actualizar,
    eliminar
} from "../controllers/emprendimiento.controller.js";

import {
    consultarEmprendimientosSchema,
    actualizarEmprendimientoSchema,
    emprendimientoIdParamSchema,
} from "../validators/emprendimiento.schema.js";

import {
    validarBody,
    validarParametros,
    validarConsulta,
}from "../middlewares/validacion.middleware.js";   

import { autenticarUsuario } from "../middlewares/autenticacion.middleware.js";

import {
    cargarContextoUsuario,
    autorizarRoles,
} from "../middlewares/autorizacion.middleware.js";

import { soloAdmin } from "../middlewares/soloAdmin.js"

const router = Router();

const artesanoOAdmin = [
    autenticarUsuario,
    cargarContextoUsuario,
    autorizarRoles("ARTESANO", "ADMINISTRADOR"),
];
//lecura publica
router.get("/", validarConsulta(consultarEmprendimientosSchema), obtenerTodos);

router.get("/:id", validarParametros (emprendimientoIdParamSchema), obtenerPorId);
//Creacion Administrativa
/*router.post(
    "/",
    ...soloAdmin,
    validarBody(crearEmprendimientoSchema),
    crear
);*/

//Actualizacion del propietario o de un administrador
router.patch(
    "/:id",
    ...artesanoOAdmin,
    validarParametros(emprendimientoIdParamSchema),
    validarBody(actualizarEmprendimientoSchema),
    actualizar
)

// Eliminacion Administrativa
// router.delete("/:id",...soloAdmin(),validarParametros(emprendimientoIdParamSchema), eliminar);

export default router;
