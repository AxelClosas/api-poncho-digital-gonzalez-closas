import "dotenv/config";
import prisma from "../src/config/prisma.js";

import { migrar } from "./migracionDatosNacionales.js";
import { crearRolSchema } from "../src/validators/roles.schemas.js";
import { crearRubroSchema } from "../src/validators/rubro.schema.js";
import { crearEstadoSchema } from "../src/validators/estados.schemas.js";
import { inicializarAdmin } from "./inicializarAdmin.js";
import {
  inicializarInfraestructura,
  inicializarCasosPrueba,
} from "./datosPrueba.js";

const variableDefinida = (variableSecreta, valorDefault = "") => {
  const secreto = process.env[variableSecreta] || valorDefault;
  if (!secreto?.trim()) {
    throw new Error(`Falta configurar la variable de entorno ${variableSecreta} en el archivo .env.`);
  }
  return secreto;
};

const inicializarCatalogo = async (datos, schema, modelo) => {
  const arr = datos
    .split(",")
    .map((d) => d.trim().toUpperCase())
    .filter((d) => d.length > 0);

  const dto = arr.map((d) => schema.parse({ nombre: d }));

  console.log(`Inicializando catálogo de ${modelo}...`);
  await prisma[modelo].createMany({
    data: dto,
    skipDuplicates: true,
  });
};

const imprimirResumen = () => {
  console.log("\n" + "=".repeat(88));
  console.log("            BASE DE DATOS INICIALIZADA Y CARGADA CON DATOS DE PRUEBA");
  console.log("=".repeat(88));
  console.log(
    "| ROL / CONCEPTO     | EMAIL                  | CONTRASEÑA             | ESTADO / DETALLE       |"
  );
  console.log("-".repeat(88));
  console.log(
    "| ADMINISTRADOR      | admin@poncho.com       | ContraseñaSegura2026!  | Activo y Habilitado    |"
  );
  console.log(
    "| ARTESANO 1         | artesano1@poncho.com   | ContraseñaSegura2026!  | Aprobado - SIN STAND   |"
  );
  console.log(
    "| ARTESANO 2         | artesano2@poncho.com   | ContraseñaSegura2026!  | Aprobado - STAND D-01  |"
  );
  console.log(
    "| POSTULANTE 3       | postulante@poncho.com  | ContraseñaSegura2026!  | NUEVO (Para evaluar)   |"
  );
  console.log("=".repeat(88) + "\n");
};

const inicializarBD = async () => {
  console.log("\n=======================================================");
  console.log("   INICIANDO PROCESO UNIFICADO DE BASE DE DATOS        ");
  console.log("=======================================================\n");

  // 1. Migración de datos geográficos (provincias, departamentos y localidades)
  await migrar();

  // 2. Catálogos base del sistema
  await inicializarCatalogo(
    variableDefinida("ROLES", "ADMINISTRADOR,ARTESANO"),
    crearRolSchema,
    "rol"
  );
  await inicializarCatalogo(
    variableDefinida("RUBROS", "ALFARERIA,TEJIDO,CUERO,MADERA,ORFEBRERIA"),
    crearRubroSchema,
    "rubro"
  );
  await inicializarCatalogo(
    variableDefinida("ESTADOS", "NUEVO,APROBADO,RECHAZADO,SOLICITUD_CAMBIO,ACTUALIZADO"),
    crearEstadoSchema,
    "estado"
  );

  // 3. Usuario administrador inicial
  const admin = await inicializarAdmin(false);

  // 4. Infraestructura física (Pabellones, Sectores, Stands)
  await inicializarInfraestructura();

  // 5. Casos de prueba (Artesanos, Productos, Asignación de Stand, Postulación nueva)
  await inicializarCasosPrueba(admin);

  // 6. Resumen en consola
  imprimirResumen();
};

try {
  await inicializarBD();
} catch (error) {
  console.error("Error al inicializar la base de datos:", error);
  process.exit(1);
} finally {
  await prisma.$disconnect();
}
