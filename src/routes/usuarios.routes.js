import { Router } from "express"
import {
  obtenerUsuarios,
  obtenerUsuarioPorId,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario
} from "../controllers/usuarios.controller.js"

import { validarCampos } from '../middlewares/validarCampos.js'

const router = Router()

router.get("/", obtenerUsuarios)
router.get("/:id", obtenerUsuarioPorId)

router.post("/", validarCampos, crearUsuario)
router.put("/:id", validarCampos, actualizarUsuario)


router.delete("/:id", eliminarUsuario)

export default router
