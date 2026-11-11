import "dotenv/config";
import bcrypt from "bcrypt";
import { fileURLToPath } from "node:url";
import prisma from "../src/config/prisma.js";
import { crearAdministradorSchema } from "../src/validators/usuarios.schemas.js";

export const inicializarAdmin = async (desconectarPrisma = true) => {
  try {
    const localidadDefault = await prisma.localidad.findFirst({
      select: { id: true },
    });

    const dto = crearAdministradorSchema.strict().parse({
      nombre: process.env.ADMIN_NOMBRE || "superadmin",
      apellido: process.env.ADMIN_APELLIDO || "poncho",
      email: process.env.ADMIN_EMAIL || "admin@poncho.com",
      password: process.env.ADMIN_PASSWORD || "ContraseñaSegura2026!",
      cuil: process.env.ADMIN_CUIL || "20-85999222-9",
      sexo: process.env.ADMIN_SEXO || "M",
      fechaNacimiento: process.env.ADMIN_FECHA_NACIMIENTO || "1980-01-01",
      localidadId: process.env.ADMIN_LOCALIDAD || (localidadDefault ? String(localidadDefault.id) : "10049030"),
    });

    const adminExistente = await prisma.usuario.findFirst({
      where: {
        OR: [
          { email: dto.email },
          { cuil: dto.cuil },
        ],
      },
    });

    if (adminExistente) {
      console.log(`El usuario administrador (${dto.email}) ya existe. Omitiendo creación.`);
      return adminExistente;
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const rolAdmin = await prisma.rol.findFirst({
      where: { nombre: { contains: "ADMINISTRADOR", mode: "insensitive" } },
    });

    if (!rolAdmin) {
      throw new Error("El rol ADMINISTRADOR no existe. Debe inicializar los roles primero.");
    }

    const nuevoAdmin = await prisma.usuario.create({
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
        habilitado: true,
        roles: {
          create: {
            rol: { connect: { id: rolAdmin.id } },
          },
        },
      },
    });
    console.log(`Administrador inicial creado exitosamente (${nuevoAdmin.email}).`);
    return nuevoAdmin;
  } finally {
    if (desconectarPrisma) {
      await prisma.$disconnect();
    }
  }
};

// Si se ejecuta directamente este archivo:
const esEjecucionDirecta =
  process.argv[1] &&
  fileURLToPath(import.meta.url).replaceAll("\\", "/").toLowerCase() ===
    process.argv[1].replaceAll("\\", "/").toLowerCase();

if (esEjecucionDirecta) {
  try {
    await inicializarAdmin(true);
  } catch (error) {
    console.error("Error al inicializar administrador:", error);
    process.exit(1);
  }
}
