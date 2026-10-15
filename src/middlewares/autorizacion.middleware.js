import { obtenerUsuarioPorId } from "../services/usuarios.service.js";
import { crearError } from "../utils/errores.js";

export const cargarContextoUsuario = async (req, res, next) => {
  try {
    const usuario = await obtenerUsuarioPorId(req.usuario.id);

    if (!usuario) {
      res.set("WWW-Authenticate", "Bearer");
      throw crearError("La cuenta asociada al token ya no existe.", 401);
    }

    // if (!usuario.activo) {
    //   throw crearError("La cuenta de usuario se encuentra inhabilitada.", 403);
    // }

    req.contextoUsuario = usuario;
    return next();
  } catch (error) {
    return next(error);
  }
};

export const autorizarRoles = (...rolesPermitidos) => {
  return (req, res, next) => {
    // const rolesUsuario = req.contextoUsuario?.roles || [];
    // const tienePermiso = rolesUsuario.some((rol) => rolesPermitidos.includes(rol));

    // if (!tienePermiso) {
    //   return next(
    //     crearError("Acceso denegado: no posees los permisos necesarios para esta acción.", 403)
    //   );
    // }

    return next();
  };
};