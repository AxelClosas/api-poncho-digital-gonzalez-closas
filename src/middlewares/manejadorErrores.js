export const manejadorErrores = (err, req, res, next) => {
  const status = err.status || 500

  if (status >= 500) {
    console.error(err)
    return res.status(status).json({ mensaje: 'Error interno del servidor' })
  }

  const respuesta = { mensaje: err.message }
  if (err.detalles !== undefined && err.detalles !== null) {
    respuesta.detalles = err.detalles
  }

  res.status(status).json(respuesta)
}