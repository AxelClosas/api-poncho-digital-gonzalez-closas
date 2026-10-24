import "dotenv/config";
import bcrypt from "bcrypt";
import prisma from "../src/config/prisma.js";
import { crearAdministradorSchema } from "../src/validators/usuarios.schemas.js";
import { crearRolSchema } from "../src/validators/roles.schemas.js";

const inicializarRoles = async () => {
  const roles = process.env.ROLES
  const arrayRoles = roles.split(",")
    .map(rol => rol.trim().toUpperCase())
    .filter(rol => rol.length > 0);

  const rolesDto = arrayRoles.map( rol => crearRolSchema.parse({ nombre: rol}) )

  try {
    console.log("Inicializando roles...")
    await prisma.rol.createMany({
      data: rolesDto,
      skipDuplicates: true
    })


    const rolesCreados = await prisma.rol.findMany()
    console.log("Roles inicializados:", rolesCreados)
  } catch (error) {
    console.error("Error al inicializar roles:", error)
  }
}


try {
  await inicializarRoles()


  const dto = crearAdministradorSchema.strict().parse({
    nombre: process.env.ADMIN_NOMBRE,
    apellido: process.env.ADMIN_APELLIDO,
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
    cuil: process.env.ADMIN_CUIL,
    sexo: process.env.ADMIN_SEXO,
    fechaNacimiento: process.env.ADMIN_FECHA_NACIMIENTO,
    localidadId: process.env.ADMIN_LOCALIDAD,
  });

  const passwordHash = await bcrypt.hash(dto.password, 10);

  const rolAdmin = await prisma.rol.findFirst({
    where: { nombre: { contains: "ADMINISTRADOR", mode: "insensitive"} },
  });

  await prisma.usuario.create({
    data: {
      nombre: dto.nombre,
      apellido: dto.apellido,
      email: dto.email,
      passwordHash,
      cuil: dto.cuil,
      sexo: dto.sexo,
      fechaNacimiento: dto.fechaNacimiento,
      localidadId: dto.localidadId,

      activo: true,

      roles: {
        create: {
          rol: { connect: { id: rolAdmin.id } },
        },
      },
    },
  });
  console.log("Administrador inicial creado.");
} finally {
  await prisma.$disconnect();
}