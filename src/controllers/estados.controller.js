import * as estadosService from "../services/estados.service.js";

export const listarEstados = async (req, res, next) => {
  try {
    const estados = await estadosService.listarEstados();
    return res.status(200).json(estados);
  } catch (error) {
    return next(error);
  }
};

export const obtenerEstado = async (req, res, next) => {
  try {
    const estado = await estadosService.obtenerEstadoPorId(req.parametrosValidados.id);
    return res.status(200).json(estado);
  } catch (error) {
    return next(error);
  }
};

export const crearEstado = async (req, res, next) => {
  try {
    const nuevoEstado = await estadosService.crearEstado(req.bodyValidado);
    return res.status(201).json(nuevoEstado);
  } catch (error) {
    return next(error);
  }
};

export const actualizarEstado = async (req, res, next) => {
  try {
    const estadoActualizado = await estadosService.actualizarEstado(
      req.parametrosValidados.id,
      req.bodyValidado
    );
    return res.status(200).json(estadoActualizado);
  } catch (error) {
    return next(error);
  }
};

export const eliminarEstado = async (req, res, next) => {
  try {
    await estadosService.eliminarEstado(req.parametrosValidados.id);
    return res.status(204).end();
  } catch (error) {
    return next(error);
  }
};