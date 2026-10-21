import * as rolesService from "../services/roles.service.js";

export const listarRoles = async (req, res, next) => {
  try {
    const roles = await rolesService.listarRoles();
    return res.status(200).json(roles);
  } catch (error) {
    return next(error);
  }
};

export const obtenerRol = async (req, res, next) => {
  try {
    const rol = await rolesService.obtenerRolPorId(req.parametrosValidados.id);
    return res.status(200).json(rol);
  } catch (error) {
    return next(error);
  }
};

export const crearRol = async (req, res, next) => {
  try {
    const nuevoRol = await rolesService.crearRol(req.bodyValidado);
    return res.status(201).json(nuevoRol);
  } catch (error) {
    return next(error);
  }
};

export const actualizarRol = async (req, res, next) => {
  try {
    const rolActualizado = await rolesService.actualizarRol(
      req.parametrosValidados.id,
      req.bodyValidado
    );
    return res.status(200).json(rolActualizado);
  } catch (error) {
    return next(error);
  }
};

export const eliminarRol = async (req, res, next) => {
  try {
    await rolesService.eliminarRol(req.parametrosValidados.id);
    return res.status(204).end();
  } catch (error) {
    return next(error);
  }
};