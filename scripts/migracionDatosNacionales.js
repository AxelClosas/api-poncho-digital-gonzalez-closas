import prisma from '../src/config/prisma.js'

const GEOREF_BASE_URL = 'https://apis.datos.gob.ar/georef/api';

async function obtenerDatos(endpoint, params = {}) {
  const query = new URLSearchParams(params).toString();
  const url = `${GEOREF_BASE_URL}/${endpoint}?${query}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Error al consultar ${url}: ${response.statusText}`);
  }

  return response.json();
}

export async function migrar() {
  console.log('Iniciando migración de datos geográficos...');

  try {
    // ----------------------------------------------------
    // 1. PROVINCIAS
    // ----------------------------------------------------
    console.log('Descargando provincias...');
    const dataProvincias = await obtenerDatos('provincias', { max: 100 });
    
    const provincias = dataProvincias.provincias.map((p) => ({
      id: parseInt(p.id, 10),
      nombre: p.nombre,
    }));

    console.log(`Guardando ${provincias.length} provincias en la base de datos...`);
    await prisma.provincia.createMany({
      data: provincias,
      skipDuplicates: true,
    });

    // ----------------------------------------------------
    // 2. DEPARTAMENTOS
    // ----------------------------------------------------
    console.log('Descargando departamentos...');
    // Hay aprox. 530 departamentos en Argentina
    const dataDepartamentos = await obtenerDatos('departamentos', { max: 1000 });
    
    const departamentos = dataDepartamentos.departamentos.map((d) => ({
      id: parseInt(d.id, 10),
      nombre: d.nombre,
      provinciaId: parseInt(d.provincia.id, 10),
    }));

    console.log(`Guardando ${departamentos.length} departamentos en la base de datos...`);
    await prisma.departamento.createMany({
      data: departamentos,
      skipDuplicates: true,
    });

    // ----------------------------------------------------
    // 3. LOCALIDADES CENSALES
    // ----------------------------------------------------
    console.log('Descargando localidades...');
    // GeoRef tiene un límite de 5000 por query, suficiente para cubrir 
    // las ~4.000 localidades de INDEC en una sola petición.
    const dataLocalidades = await obtenerDatos('localidades', { max: 5000 });

    const localidades = dataLocalidades.localidades
      .filter((l) => l.departamento && l.departamento.id) // Omitir posibles registros sin departamento asignado
      .map((l) => ({
        id: parseInt(l.id, 10),
        nombre: l.nombre,
        departamentoId: parseInt(l.departamento.id, 10),
      }));

    console.log(`Guardando ${localidades.length} localidades en la base de datos...`);
    await prisma.localidad.createMany({
      data: localidades,
      skipDuplicates: true,
    });

    console.log('Migración completada con éxito.');
  } catch (error) {
    console.error('Error durante la migración:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}