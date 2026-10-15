export const crearError = (mensaje, status = 500, detalles = null) => {
  const error = new Error(mensaje);
  error.status = status;
  if (detalles) {
    error.detalles = detalles;
  }
  return error;
};

export const detallarErroresZod = (errorZod) =>
  errorZod.issues.map((issue) => ({
    campo: issue.path.join('.') || null,
    mensaje: issue.message,
  }));