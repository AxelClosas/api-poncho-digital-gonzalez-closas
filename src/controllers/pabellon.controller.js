import * as pabellonService from "../services/pabellon.service.js";

export const obtenerTodos = async (req, res, next) => {
  try {
    const pabellones = await pabellonService.obtenerPabellones();
    return res.status(200).json(pabellones);
  } catch (error) {
    return next(error);
  }
};

export const obtenerPorId = async (req, res, next) => {
  try {
    const pabellon = await pabellonService.obtenerPabellonPorId(
      req.parametrosValidados.id
    );
    return res.status(200).json(pabellon);
  } catch (error) {
    return next(error);
  }
};

export const crear = async (req, res, next) => {
  try {
    const nuevoPabellon = await pabellonService.crearPabellon(req.bodyValidado);
    return res.status(201).json(nuevoPabellon);
  } catch (error) {
    return next(error);
  }
};

export const actualizar = async (req, res, next) => {
  try {
    const pabellonActualizado = await pabellonService.actualizarPabellon(
      req.parametrosValidados.id,
      req.bodyValidado
    );
    return res.status(200).json(pabellonActualizado);
  } catch (error) {
    return next(error);
  }
};

export const eliminar = async (req, res, next) => {
  try {
    await pabellonService.eliminarPabellon(req.parametrosValidados.id);
    return res.status(200).json({
      mensaje: "Pabellón eliminado correctamente.",
    });
  } catch (error) {
    return next(error);
  }
};