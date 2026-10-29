import prisma from "../src/config/prisma.js"

import { migrar } from "./migracionDatosNacionales.js"

import { crearRolSchema } from "../src/validators/roles.schemas.js"
import { crearRubroSchema } from "../src/validators/rubro.schema.js"
import { crearEstadoSchema } from "../src/validators/estados.schemas.js"

const variableDefinida = (variableSecreta) => {
  const secreto = process.env[variableSecreta]
  if (!secreto?.trim()) {
    throw new Error(`Falta configurar la variable de entorno ${variableSecreta} en el archivo .env.`)
  }
  return secreto
}

const inicializar = async (datos, schema, modelo) => {
  const arr = datos.split(",")
    .map(d => d.trim().toUpperCase())
    .filter(d => d.length > 0);

  const dto = arr.map(d => schema.parse({ nombre: d}))

  console.log(`Inicializando ${modelo}...`)
  await prisma[modelo].createMany({
    data: dto,
    skipDuplicates: true
  })
}


const inicializarBD = async () => {
    // Migración de datos geográficos (provincias, departamentos y localidades)
    await migrar()
    // Roles
    await inicializar(variableDefinida("ROLES"), crearRolSchema, "rol")
    // Rubros
    await inicializar(variableDefinida("RUBROS"), crearRubroSchema, "rubro")
    // Estados
    await inicializar(variableDefinida("ESTADOS"), crearEstadoSchema, "estado")
}

try {
  await inicializarBD()
} catch (error) {
  console.error("Error al inicializar la base de datos: ", error)
} finally {
  await prisma.$disconnect()
}
