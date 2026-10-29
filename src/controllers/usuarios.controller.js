import * as usuariosService from "../services/usuarios.service.js";
import { generarToken } from "../services/tokens.service.js";

export const crearAdministrador = async (req, res, next) => {
  try {
    const admin = await usuariosService.crearAdministrador(req.bodyValidado);
    return res.status(201).json(admin);
  } catch (error) {
    return next(error);
  }
};

export const iniciarSesion = async (req, res, next) => {
  try {
    const sesion = await usuariosService.iniciarSesion(req.bodyValidado);
    const token = generarToken(sesion);
    // Nota: Aquí se integrará la generación del JWT más adelante
    return res.status(200).json({
      mensaje: "Inicio de sesión exitoso.",
      usuario: sesion,
      token: token,
    });
  } catch (error) {
    return next(error);
  }
};

export const consultarUsuarios = async (req, res, next) => {
  try {
    const resultado = await usuariosService.consultarUsuarios(req.consultaValidada);
    return res.status(200).json(resultado);
  } catch (error) {
    return next(error);
  }
};

export const obtenerUsuarioPorId = async (req, res, next) => {
  try {
    const usuario = await usuariosService.obtenerUsuarioPorId(req.parametrosValidados.id);
    return res.status(200).json(usuario);
  } catch (error) {
    return next(error);
  }
};

export const obtenerMiPerfil = async (req, res, next) => {
  try {
    // req.usuario vendrá inyectado por el middleware de autenticación (JWT)
    const usuario = await usuariosService.obtenerUsuarioPorId(req.usuario.id);
    return res.status(200).json(usuario);
  } catch (error) {
    return next(error);
  }
};

export const cambiarEstadoActivo = async (req, res, next) => {
  try {
    const usuarioActualizado = await usuariosService.cambiarEstadoActivo(
      req.parametrosValidados.id,
      req.bodyValidado.activo
    );
    return res.status(200).json(usuarioActualizado);
  } catch (error) {
    return next(error);
  }
};

export const agregarRol = async (req, res, next) => {
  try {
    const resultado = await usuariosService.agregarRolAUsuario(
      req.parametrosValidados.id,
      req.bodyValidado.nombre
    );
    return res.status(200).json(resultado);
  } catch (error) {
    return next(error);
  }
};

export const eliminarRol = async (req, res, next) => {
  try {
    const resultado = await usuariosService.retirarRolDeUsuario(
      req.parametrosValidados.id,
      req.parametrosValidados.rol
    );
    return res.status(200).json(resultado);
  } catch (error) {
    return next(error);
  }
};