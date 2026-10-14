import { Router } from "express";

import {
    obtenerTodos,
    obtenerPorId,
    crear,
    actualizar,
    eliminar
} from "../controllers/pabellon.controller.js";

import { validarId } from "../middlewares/validarId.js";
import { validarSchema } from "../middlewares/validarSchema.js";

import {
    crearPabellonSchema,
    actualizarPabellonSchema
} from "../schemas/pabellon.schema.js";

const router = Router();

router.get("/", obtenerTodos);

router.get("/:id", validarId, obtenerPorId);

router.post(
    "/",
    validarSchema(crearPabellonSchema),
    crear
);

router.put(
    "/:id",
    validarId,
    validarSchema(actualizarPabellonSchema),
    actualizar
);

router.delete("/:id", validarId, eliminar);

export default router;