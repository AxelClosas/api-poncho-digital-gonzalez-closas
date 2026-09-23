import { crearError } from "../utils/errores.js"


export const validarCampos = (req, res, next) => {
  const { cuil, ape_y_nom, localidad, provincia, email, password, id_rol } = req.body

  if (!cuil || !ape_y_nom || !localidad || !provincia || !email || !password) {
    next(crearError("Faltan campos requeridos para crear el usuario", 400, {
      camposRequeridos: ["cuil", "ape_y_nom", "localidad", "provincia", "email", "password"]
    }))
  }

  next()
}