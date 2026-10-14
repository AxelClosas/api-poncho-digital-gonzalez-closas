import {router} from "express";

import{
    obtenerTodos,
    obtenerPorId,
    crear,
    actualizar,
    eliminar  
}  from "../controllers/sector.controllers.js";

import { validarId } from "../middlewares/validarId.js";
import { validarSchema } from "../middlewares/validarSchema.js";

import {
    crearSectorSchema,
    actualizarSectorSchema
} from "../schema/sector.schema.js";

const router = router();

router.ger("/", obtenerTodos);

router.get("/:id",validarId, obtenerPorId);

router.post(
    "/", validarSchema(crearSectorSchema),crear
);

router.put(
    "/:id", validarId, validarSchema(actualizarSectorSchema), actualizar
);

router.delete("/:id", validarId, eliminar);

export default router;
