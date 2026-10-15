import jwt from "jsonwebtoken";

export const manejadorErrores = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  if (err instanceof jwt.TokenExpiredError) {
    res.set("WWW-Authenticate", 'Bearer error="invalid_token", error_description="The token has expired"');
    return res.status(401).json({ error: "El token de acceso ha expirado." });
  }

  if (err instanceof jwt.JsonWebTokenError) {
    res.set("WWW-Authenticate", 'Bearer error="invalid_token"');
    return res.status(401).json({ error: "Token de acceso inválido o con formato erróneo." });
  }

  // Mapeo de errores de Prisma
  const erroresPrisma = {
    P2002: { status: 409, mensaje: 'Ya existe un registro con esos datos únicos.' },
    P2003: { status: 409, mensaje: 'La operación afecta registros relacionados o la clave foránea no existe.' },
    P2025: { status: 404, mensaje: 'Registro no encontrado.' },
    P2034: { status: 409, mensaje: 'Conflicto de concurrencia. Por favor reintente.' },
  };

  if (err.code && erroresPrisma[err.code]) {
    const errorMapeado = erroresPrisma[err.code];
    return res.status(errorMapeado.status).json({
      error: errorMapeado.mensaje,
    });
  }

  const statusCode = err.status || 500;

  if (statusCode >= 500) {
    console.error('Error no controlado:', err);
    return res.status(statusCode).json({ error: 'Error interno del servidor.' });
  }

  const respuesta = { error: err.message };
  if (err.detalles) {
    respuesta.detalles = err.detalles;
  }

  return res.status(statusCode).json(respuesta);
};

export const noEncontrado = (req, res) => {
  res.status(404).json({
    mensaje: `Ruta no encontrada: ${req.method} ${req.originalUrl}`
  })
}