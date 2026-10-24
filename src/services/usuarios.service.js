import bcrypt from "bcrypt";
import prisma from "../config/prisma.js";
import { crearError } from "../utils/errores.js";

const proyeccionUsuario = {
  id: true,
  nombre: true,
  apellido: true,
  cuil: true,
  fechaNacimiento: true,
  sexo: true,
  email: true,
  activo: true,
  ultimoAcceso: true,
  createdAt: true,
  localidad: {
    select: {
      id: true,
      nombre: true,
      departamento: {
        select: {
          id: true,
          nombre: true,
          provincia: { select: { id: true, nombre: true } },
        },
      },
    },
  },
  roles: {
    select: {
      rol: { select: { id: true, nombre: true } },
    },
  },
  emprendimiento: {
    select: {
      id: true,
      nombre: true,
      rubro: { select: { id: true, nombre: true } },
      stand: { select: { id: true, nombre: true, estado: true } },
    },
  },
};

export const crearAdministrador = async (dto) => {
  const {
    nombre,
    apellido,
    email,
    password,
    cuil,
    sexo,
    fechaNacimiento,
    localidadId,
  } = dto;

  const emailExistente = await prisma.usuario.findUnique({
    where: { email },
  });
  if (emailExistente) {
    throw crearError("Ya existe un usuario con el email proporcionado.", 400);
  }

  const usuarioExistente = await prisma.usuario.findUnique({
    where: { cuil },
  });
  if (usuarioExistente) {
    throw crearError("Ya existe un usuario con el CUIL proporcionado.", 400);
  }

  const localidadExiste = await prisma.localidad.findUnique({
    where: { id: localidadId },
  });
  if (!localidadExiste) {
    throw crearError("La localidad indicada no existe.", 400);
  }

  const rolAdmin = await prisma.rol.findFirst({
    where: { nombre: { contains: "ADMINISTRADOR", mode: "insensitive"} },
  });
  if (!rolAdmin) {
    throw crearError("El rol ADMINISTRADOR no está configurado en el sistema.", 500);
  }

  const passwordHash = await bcrypt.hash(password, 10);

  return prisma.usuario.create({
    data: {
      nombre,
      apellido,
      cuil,
      sexo,
      fechaNacimiento,
      email,
      passwordHash,
      localidadId,
      activo: true,
      roles: {
        create: {
          rol: { connect: { id: rolAdmin.id } },
        },
      },
    },
    select: proyeccionUsuario,
  });
};

export const iniciarSesion = async (dto) => {
  const { email, password } = dto;

  const usuario = await prisma.usuario.findUnique({
    where: { email },
    include: {
      roles: { include: { rol: true } },
    },
  });

  if (!usuario) {
    throw crearError("Las credenciales son inválidas.", 401);
  }

  const passwordValida = await bcrypt.compare(password, usuario.passwordHash);
  if (!passwordValida) {
    throw crearError("Las credenciales son inválidas.", 401);
  }

  if (!usuario.activo) {
    throw crearError(
      "Tu cuenta se encuentra inactiva o tu postulación está pendiente de revisión.",
      401
    );
  }

  await prisma.usuario.update({
    where: { id: usuario.id },
    data: { ultimoAcceso: new Date(), activo: true },
  });

  return {
    id: usuario.id,
    nombre: usuario.nombre,
    apellido: usuario.apellido,
    email: usuario.email,
    roles: usuario.roles.map((r) => r.rol.nombre),
  };
};

export const consultarUsuarios = async (criterios) => {
  const { busqueda, activo, rol, localidadId, ordenPor, direccion, pagina, limite } = criterios;

  const where = {};

  if (activo !== undefined) where.activo = activo;
  if (localidadId !== undefined) where.localidadId = localidadId;

  if (busqueda) {
    where.OR = [
      { nombre: { contains: busqueda, mode: "insensitive" } },
      { apellido: { contains: busqueda, mode: "insensitive" } },
      { email: { contains: busqueda, mode: "insensitive" } },
      { cuil: { contains: busqueda } },
    ];
  }

  if (rol) {
    where.roles = {
      some: { rol: { nombre: { contains: rol, mode: "insensitive" } } },
    };
  }

  const desplazamiento = (pagina - 1) * limite;

  const [usuarios, total] = await prisma.$transaction([
    prisma.usuario.findMany({
      where,
      orderBy: [{ [ordenPor]: direccion }, { id: "asc" }],
      skip: desplazamiento,
      take: limite,
      select: proyeccionUsuario,
    }),
    prisma.usuario.count({ where }),
  ]);

  return {
    usuarios: usuarios.map((u) => ({
      ...u,
      roles: u.roles.map((r) => r.rol.nombre),
    })),
    paginacion: {
      pagina,
      limite,
      total,
      totalPaginas: Math.ceil(total / limite),
    },
  };
};

export const obtenerUsuarioPorId = async (id) => {
  const usuario = await prisma.usuario.findUnique({
    where: { id },
    select: proyeccionUsuario,
  });

  if (!usuario) {
    throw crearError(`Usuario con ID ${id} no encontrado.`, 404);
  }

  return {
    ...usuario,
    roles: usuario.roles.map((r) => r.rol.nombre),
  };
};

export const cambiarEstadoActivo = async (usuarioId, nuevoEstadoActivo) => {
  return prisma.$transaction(async (tx) => {
    const usuario = await tx.usuario.findUnique({
      where: { id: usuarioId },
      include: { roles: { include: { rol: true } } },
    });

    if (!usuario) {
      throw crearError(`Usuario con ID ${usuarioId} no encontrado.`, 404);
    }

    const esAdmin = usuario.roles.some((r) => r.rol.nombre === "ADMINISTRADOR");

    // Regla de seguridad: no desactivar al último admin activo
    if (!nuevoEstadoActivo && usuario.activo && esAdmin) {
      const otrosAdmins = await tx.usuario.count({
        where: {
          id: { not: usuarioId },
          activo: true,
          roles: { some: { rol: { nombre: "ADMINISTRADOR" } } },
        },
      });

      if (otrosAdmins === 0) {
        throw crearError("No se puede desactivar al único administrador activo del sistema.", 409);
      }
    }

    return tx.usuario.update({
      where: { id: usuarioId },
      data: { activo: nuevoEstadoActivo },
      select: { id: true, nombre: true, apellido: true, email: true, activo: true },
    });
  });
};

export const agregarRolAUsuario = async (usuarioId, nombreRol) => {
  console.log("NOMBRE ROL: ", nombreRol);
  return prisma.$transaction(async (tx) => {
    const usuario = await tx.usuario.findUnique({ where: { id: usuarioId } });
    if (!usuario) {
      throw crearError(`Usuario con ID ${usuarioId} no encontrado.`, 404);
    }

    const rol = await tx.rol.findFirst({ where: { nombre: { contains: nombreRol, mode: "insensitive" } } });
    if (!rol) {
      throw crearError(`El rol ${nombreRol} no existe.`, 400);
    }

    await tx.usuarioRol.upsert({
      where: {
        usuarioId_rolId: { usuarioId, rolId: rol.id },
      },
      update: {},
      create: { usuarioId, rolId: rol.id },
    });

    return { mensaje: `Rol ${nombreRol} asignado exitosamente.` };
  });
};

export const retirarRolDeUsuario = async (usuarioId, nombreRol) => {
  return prisma.$transaction(async (tx) => {
    const usuario = await tx.usuario.findUnique({
      where: { id: usuarioId },
      include: { roles: { include: { rol: true } } },
    });

    if (!usuario) {
      throw crearError(`Usuario con ID ${usuarioId} no encontrado.`, 404);
    }

    const rolAsignado = usuario.roles.find((r) => r.rol.nombre === nombreRol);
    if (!rolAsignado) {
      throw crearError(`El usuario no tiene asignado el rol ${nombreRol}.`, 400);
    }

    if (usuario.roles.length === 1) {
      throw crearError("El usuario debe conservar al menos un rol.", 409);
    }

    if (nombreRol === "ADMINISTRADOR" && usuario.activo) {
      const otrosAdmins = await tx.usuario.count({
        where: {
          id: { not: usuarioId },
          activo: true,
          roles: { some: { rol: { nombre: "ADMINISTRADOR" } } },
        },
      });

      if (otrosAdmins === 0) {
        throw crearError("No se puede retirar el rol al único administrador activo.", 409);
      }
    }

    await tx.usuarioRol.delete({
      where: {
        usuarioId_rolId: { usuarioId, rolId: rolAsignado.rolId },
      },
    });

    return { mensaje: `Rol ${nombreRol} retirado exitosamente.` };
  });
};