import * as inscripcionesService from "../services/inscripciones.service.js";

export const postularse = async (req, res, next) => {
  try {
    const resultado = await inscripcionesService.postularse(req.bodyValidado);
    return res.status(201).json(resultado);
  } catch (error) {
    return next(error);
  }
};

export const consultarInscripciones = async (req, res, next) => {
  try {
    const resultado = await inscripcionesService.consultarInscripciones(req.consultaValidada);
    return res.status(200).json(resultado);
  } catch (error) {
    return next(error);
  }
};

export const cambiarEstadoInscripcion = async (req, res, next) => {
  try {
    const evaluadorId = req.usuario?.id; // Proviene del middleware de autenticación (req.usuario)
    const inscripcion = await inscripcionesService.cambiarEstadoInscripcion(
      req.parametrosValidados.id,
      req.bodyValidado,
      evaluadorId
    );
    return res.status(200).json(inscripcion);
  } catch (error) {
    return next(error);
  }
};