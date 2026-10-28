import "dotenv/config";
import bcrypt from "bcrypt";
import prisma from "../src/config/prisma.js";
import { crearAdministradorSchema } from "../src/validators/usuarios.schemas.js";

try {
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