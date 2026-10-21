import { crearError, detallarErroresZod } from '../utils/errores.js';

export const validarBody = (schema) => (req, res, next) => {
  const resultado = schema.safeParse(req.body);
  if (!resultado.success) {
    const detalles = detallarErroresZod(resultado.error);
    return next(crearError('Los datos enviados son inválidos.', 400, detalles));
  }
  req.bodyValidado = resultado.data;
  next();
};

export const validarConsulta = (schema) => (req, res, next) => {
  const resultado = schema.safeParse(req.query);
  if (!resultado.success) {
    const detalles = detallarErroresZod(resultado.error);
    return next(crearError('Los parámetros de consulta son inválidos.', 400, detalles));
  }
  req.consultaValidada = resultado.data;
  next();
};

export const validarParametros = (schema) => (req, res, next) => {
  const resultado = schema.safeParse(req.params);
  if (!resultado.success) {
    const detalles = detallarErroresZod(resultado.error);
    return next(crearError('Los parámetros de la ruta son inválidos.', 400, detalles));
  }
  req.parametrosValidados = resultado.data;
  next();
};