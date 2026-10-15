import * as standService from "../services/stand.services.js";

export const obtenerTodos = async (req, res, next) => {
  try {
    const stands = await standService.obtenerStands();
    return res.status(200).json(stands);
  } catch (error) {
    return next(error);
  }
};

export const obtenerPorId = async (req, res, next) => {
  try {
    // Usamos parametrosValidados.id en lugar de params.id
    const stand = await standService.obtenerStandPorId(req.parametrosValidados.id);
    return res.status(200).json(stand);
  } catch (error) {
    return next(error);
  }
};

export const crear = async (req, res, next) => {
  try {
    // Usamos bodyValidado en lugar de body
    const nuevoStand = await standService.crearStand(req.bodyValidado);
    return res.status(201).json(nuevoStand);
  } catch (error) {
    return next(error);
  }
};

export const actualizar = async (req, res, next) => {
  try {
    const stand = await standService.actualizarStand(
      req.parametrosValidados.id,
      req.bodyValidado
    );
    return res.status(200).json(stand);
  } catch (error) {
    return next(error);
  }
};

export const eliminar = async (req, res, next) => {
  try {
    await standService.eliminarStand(req.parametrosValidados.id);
    return res.status(200).json({
      mensaje: "Stand eliminado correctamente",
    });
  } catch (error) {
    return next(error);
  }
};