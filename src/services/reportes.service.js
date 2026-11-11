import prisma from "../config/prisma.js";

/**
 * Reporte 1: Artesanos registrados
 * Retorna métricas globales de artesanos (total, habilitados, inhabilitados, con/sin emprendimiento)
 * y el listado consolidado con sus datos de contacto y emprendimiento.
 */
export const obtenerReporteArtesanos = async () => {
  const filtroRolArtesano = {
    roles: {
      some: {
        rol: { nombre: { contains: "ARTESANO", mode: "insensitive" } },
      },
    },
  };

  const [totalArtesanos, habilitados, inhabilitados, artesanos] = await Promise.all([
    prisma.usuario.count({ where: filtroRolArtesano }),
    prisma.usuario.count({ where: { ...filtroRolArtesano, habilitado: true } }),
    prisma.usuario.count({ where: { ...filtroRolArtesano, habilitado: false } }),
    prisma.usuario.findMany({
      where: filtroRolArtesano,
      select: {
        id: true,
        nombre: true,
        apellido: true,
        email: true,
        cuil: true,
        activo: true,
        habilitado: true,
        createdAt: true,
        localidad: {
          select: {
            nombre: true,
            departamento: { select: { nombre: true } },
          },
        },
        emprendimiento: {
          select: {
            id: true,
            nombre: true,
            rubro: { select: { nombre: true } },
            stand: { select: { nombre: true } },
          },
        },
      },
      orderBy: [{ apellido: "asc" }, { nombre: "asc" }],
    }),
  ]);

  const conEmprendimiento = artesanos.filter((a) => a.emprendimiento !== null).length;
  const sinEmprendimiento = totalArtesanos - conEmprendimiento;

  return {
    metricas: {
      totalArtesanos,
      habilitados,
      inhabilitados,
      conEmprendimiento,
      sinEmprendimiento,
    },
    artesanos: artesanos.map((a) => ({
      id: a.id,
      nombreCompleto: `${a.apellido}, ${a.nombre}`,
      email: a.email,
      cuil: a.cuil,
      activo: a.activo,
      habilitado: a.habilitado,
      localidad: a.localidad
        ? `${a.localidad.nombre} (${a.localidad.departamento?.nombre || ""})`
        : "Sin localidad asignada",
      emprendimiento: a.emprendimiento ? a.emprendimiento.nombre : null,
      rubro: a.emprendimiento?.rubro ? a.emprendimiento.rubro.nombre : null,
      stand: a.emprendimiento?.stand ? a.emprendimiento.stand.nombre : null,
      fechaRegistro: a.createdAt,
    })),
  };
};

/**
 * Reporte 2: Artesanos registrados por localidad
 * Distribución geográfica agrupada por localidad y departamento.
 */
export const obtenerReporteArtesanosPorLocalidad = async () => {
  const agrupados = await prisma.usuario.groupBy({
    by: ["localidadId"],
    where: {
      roles: {
        some: {
          rol: { nombre: { contains: "ARTESANO", mode: "insensitive" } },
        },
      },
    },
    _count: {
      id: true,
    },
    orderBy: {
      _count: {
        id: "desc",
      },
    },
  });

  const idsLocalidades = agrupados.map((a) => a.localidadId);

  const localidades = await prisma.localidad.findMany({
    where: { id: { in: idsLocalidades } },
    select: {
      id: true,
      nombre: true,
      departamento: {
        select: {
          nombre: true,
          provincia: { select: { nombre: true } },
        },
      },
    },
  });

  const mapaLocalidades = new Map(localidades.map((l) => [l.id.toString(), l]));

  return agrupados.map((item) => {
    const loc = mapaLocalidades.get(item.localidadId.toString());
    return {
      localidadId: item.localidadId.toString(),
      localidad: loc ? loc.nombre : "Desconocida",
      departamento: loc?.departamento ? loc.departamento.nombre : "Sin departamento",
      provincia: loc?.departamento?.provincia ? loc.departamento.provincia.nombre : "Catamarca",
      totalArtesanos: item._count.id,
    };
  });
};

/**
 * Reporte 3: Artesanos registrados por rubro
 * Distribución de emprendimientos según rubro artesanal.
 */
export const obtenerReporteArtesanosPorRubro = async () => {
  const rubros = await prisma.rubro.findMany({
    select: {
      id: true,
      nombre: true,
      descripcion: true,
      _count: {
        select: { emprendimientos: true },
      },
    },
    orderBy: {
      nombre: "asc",
    },
  });

  const totalEmprendimientosConRubro = rubros.reduce(
    (acc, r) => acc + r._count.emprendimientos,
    0
  );

  return {
    totalEmprendimientos: totalEmprendimientosConRubro,
    distribucion: rubros.map((r) => ({
      rubroId: r.id,
      rubro: r.nombre,
      descripcion: r.descripcion,
      totalEmprendimientos: r._count.emprendimientos,
      porcentaje:
        totalEmprendimientosConRubro > 0
          ? `${((r._count.emprendimientos / totalEmprendimientosConRubro) * 100).toFixed(1)}%`
          : "0.0%",
    })),
  };
};

/**
 * Reporte 4: Cantidad de stands ocupados y disponibles
 * Métrica de capacidad física del predio ferial global y por pabellón.
 */
export const obtenerReporteOcupacionStands = async () => {
  const totalStands = await prisma.stand.count();

  const standsPorEstado = await prisma.stand.groupBy({
    by: ["estado"],
    _count: { id: true },
  });

  let disponibles = 0;
  let ocupados = 0;

  for (const item of standsPorEstado) {
    if (item.estado === "DISPONIBLE") disponibles = item._count.id;
    if (item.estado === "OCUPADO") ocupados = item._count.id;
  }

  const porcentajeOcupacion =
    totalStands > 0 ? `${((ocupados / totalStands) * 100).toFixed(1)}%` : "0.0%";

  // Desglose por pabellón
  const pabellones = await prisma.pabellon.findMany({
    select: {
      id: true,
      nombre: true,
      sectores: {
        select: {
          id: true,
          nombre: true,
          stands: {
            select: { estado: true },
          },
        },
      },
    },
    orderBy: { nombre: "asc" },
  });

  const porPabellon = pabellones.map((p) => {
    let pabTotal = 0;
    let pabDisponibles = 0;
    let pabOcupados = 0;

    for (const sec of p.sectores) {
      for (const st of sec.stands) {
        pabTotal++;
        if (st.estado === "DISPONIBLE") pabDisponibles++;
        if (st.estado === "OCUPADO") pabOcupados++;
      }
    }

    return {
      pabellonId: p.id,
      pabellon: p.nombre,
      totalStands: pabTotal,
      disponibles: pabDisponibles,
      ocupados: pabOcupados,
      porcentajeOcupacion:
        pabTotal > 0 ? `${((pabOcupados / pabTotal) * 100).toFixed(1)}%` : "0.0%",
    };
  });

  return {
    totalStands,
    disponibles,
    ocupados,
    porcentajeOcupacion,
    porPabellon,
  };
};

/**
 * Reporte 5: Productos publicados por artesano
 * Lista consolidada de emprendimientos con cantidad de productos y precio promedio.
 */
export const obtenerReporteProductosPorArtesano = async () => {
  const emprendimientos = await prisma.emprendimiento.findMany({
    select: {
      id: true,
      nombre: true,
      usuario: {
        select: {
          id: true,
          nombre: true,
          apellido: true,
          email: true,
          habilitado: true,
        },
      },
      rubro: {
        select: { nombre: true },
      },
      stand: {
        select: { nombre: true },
      },
      _count: {
        select: { productos: true },
      },
      productos: {
        select: { precio: true },
      },
    },
    orderBy: { nombre: "asc" },
  });

  return emprendimientos.map((emp) => {
    const totalProductos = emp._count.productos;
    let sumaPrecios = 0;
    for (const prod of emp.productos) {
      sumaPrecios += Number(prod.precio);
    }
    const precioPromedio =
      totalProductos > 0 ? Number((sumaPrecios / totalProductos).toFixed(2)) : 0;

    return {
      emprendimientoId: emp.id,
      emprendimiento: emp.nombre,
      artesano: `${emp.usuario.apellido}, ${emp.usuario.nombre}`,
      email: emp.usuario.email,
      habilitado: emp.usuario.habilitado,
      rubro: emp.rubro?.nombre || "Sin rubro",
      stand: emp.stand?.nombre || "Sin stand asignado",
      totalProductos,
      precioPromedio,
    };
  });
};

/**
 * Reporte 6: Tendencias de búsqueda
 * Ranking de términos más buscados por los visitantes mediante middleware.
 */
export const obtenerReporteTendenciasBusqueda = async (criterios = {}) => {
  const limite = Number(criterios.limite) || 10;
  const dias = Number(criterios.dias) || 30;
  const entidad = criterios.entidad ? String(criterios.entidad).toUpperCase() : undefined;

  const fechaDesde = new Date();
  fechaDesde.setDate(fechaDesde.getDate() - dias);

  const where = {
    createdAt: { gte: fechaDesde },
  };

  if (entidad) {
    where.entidad = entidad;
  }

  const [tendencias, totalRegistros] = await Promise.all([
    prisma.registroBusqueda.groupBy({
      by: ["termino"],
      where,
      _count: {
        termino: true,
      },
      orderBy: {
        _count: {
          termino: "desc",
        },
      },
      take: limite,
    }),
    prisma.registroBusqueda.count({ where }),
  ]);

  return {
    periodoDias: dias,
    entidadFiltro: entidad || "TODAS",
    totalConsultasPeriodo: totalRegistros,
    ranking: tendencias.map((t, index) => ({
      posicion: index + 1,
      termino: t.termino,
      totalConsultas: t._count.termino,
      porcentaje:
        totalRegistros > 0
          ? `${((t._count.termino / totalRegistros) * 100).toFixed(1)}%`
          : "0.0%",
    })),
  };
};

