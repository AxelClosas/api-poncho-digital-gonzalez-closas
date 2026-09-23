export const crearError = (mensaje, status, detalles = null) => {
  const error = new Error(mensaje)
  error.status = status
  if (detalles !== null && detalles !== undefined) {
    error.detalles = detalles
  }

  return error
}