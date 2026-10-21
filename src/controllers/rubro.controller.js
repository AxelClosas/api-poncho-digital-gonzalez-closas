import * as rubroService from "../services/rubro.services.js";

export const obtenerTodos = async (req, res, next) => {
  try {
    const rubros = await rubroService.obtenerRubros();
    return res.status(200).json(rubros);
  } catch (error) {
    return next(error);
  }
};

export const obtenerPorId = async (req, res, next) => {
  try {
    const rubro = await rubroService.obtenerRubroPorId(req.parametrosValidados.id);
    return res.status(200).json(rubro);
  } catch (error) {
    return next(error);
  }
};

export const crear = async (req, res, next) => {
  try {
    const nuevoRubro = await rubroService.crearRubro(req.bodyValidado);
    return res.status(201).json(nuevoRubro);
  } catch (error) {
    return next(error);
  }
};

export const actualizar = async (req, res, next) => {
  try {
    const rubro = await rubroService.actualizarRubro(
      req.parametrosValidados.id,
      req.bodyValidado
    );
    return res.status(200).json(rubro);
  } catch (error) {
    return next(error);
  }
};

export const eliminar = async (req, res, next) => {
  try {
    await rubroService.eliminarRubro(req.parametrosValidados.id);
    return res.status(200).json({ mensaje: "Rubro eliminado correctamente." });
  } catch (error) {
    return next(error);
  }
};