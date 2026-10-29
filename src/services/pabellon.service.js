import prisma from "../config/prisma.js";
import { crearError } from "../utils/errores.js";
import { construirRespuestaPaginada } from "../utils/construirRespuestaPaginada.js"

export const obtenerPabellones = async ( criterios ) => {
  const {
    nombre, ordenPor, direccion, pagina, limite
  } = criterios
  
  // Filtros
  const where = {}

  if (nombre) {
    where.nombre = {
      contains: nombre,
      mode: "insensitive"
    }
  }

  // Criterios de paginación
  const desplazamiento = (pagina - 1) * limite

  const [ pabellones, total ] = await prisma.$transaction([
    prisma.pabellon.findMany({
      // Filtros
      where: where,
      // Criterio de ordenación
      // El segundo elemento del array en orderBy es el campo de desempate
      orderBy: [ { [ordenPor]: direccion}, { id: "asc"} ],

      // Criterio de paginación
      skip: desplazamiento,
      take: limite,

      // Incluir relaciones
      include: {
        sectores: {
          select: {
            id: true,
            nombre: true,
            descripcion: true,
          }
        }
      }
    }),
    prisma.pabellon.count({ where: where })
  ])

  const pabellonesDto = {
    nombre: "pabellones",
    datos: pabellones
  }
  // Construir respuesta paginada
  return construirRespuestaPaginada(pabellonesDto, total, pagina, limite )
};

export const obtenerPabellonPorId = async (id) => {
  const pabellon = await prisma.pabellon.findFirst({
    where: { id },
    include: {
      sectores: true,
    },
  });

  if (!pabellon) {
    throw crearError(`Pabellón con ID ${id} no encontrado.`, 404);
  }

  return pabellon;
};

export const crearPabellon = async (datos) => {
  return prisma.pabellon.create({
    data: {
      nombre: datos.nombre,
      descripcion: datos.descripcion ?? null,
    },
  });
};

export const actualizarPabellon = async (id, datos) => {
  await obtenerPabellonPorId(id); // Comprueba existencia previa

  return prisma.pabellon.update({
    where: { id },
    data: datos,
  });
};

export const eliminarPabellon = async (id) => {
  await obtenerPabellonPorId(id);

  // Verificamos si tiene sectores asociados para evitar fallo de FK Restrict
  const sectoresAsociados = await prisma.sector.count({
    where: { pabellonId: id },
  });

  if (sectoresAsociados > 0) {
    throw crearError(
      "No se puede eliminar el pabellón porque contiene sectores asociados.",
      409
    );
  }

  return prisma.pabellon.delete({
    where: { id },
  });
};