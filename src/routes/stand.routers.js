import { Router } from "express";

import {
    obtenerTodos,
    obtenerPorId,
    crear,
    actualizar,
    eliminar
} from "../controllers/stand.controller.js";

import { validarId } from "../middlewares/validarId.js";
import { validarSchema } from "../middlewares/validarSchema.js";

import {
    crearStandSchema,
    actualizarStandSchema
} from "../schema/stand.schema.js";

const router = Router();

router.get("/", obtenerTodos);

router.get("/:id", validarId, obtenerPorId);

router.post(
    "/",
    validarSchema(crearStandSchema),
    crear
);

router.put(
    "/:id",
    validarId,
    validarSchema(actualizarStandSchema),
    actualizar
);

router.delete("/:id", validarId, eliminar);

export default router;