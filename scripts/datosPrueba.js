import bcrypt from "bcrypt";
import prisma from "../src/config/prisma.js";

const PASSWORD_COMUN = "ContraseñaSegura2026!";

export const inicializarInfraestructura = async () => {
  console.log("Inicializando infraestructura física (pabellones, sectores y stands)...");

  const estructura = [
    {
      nombre: "Pabellón Poncho Diseño",
      descripcion: "Sector exclusivo para diseño contemporáneo e indumentaria de autor.",
      sectores: [
        {
          nombre: "Sector Textil Contemporáneo",
          descripcion: "Prendas de autor y accesorios en fibra.",
          stands: ["Stand D-01", "Stand D-02", "Stand D-03", "Stand D-04"],
        },
        {
          nombre: "Sector Joyería y Metales",
          descripcion: "Orfebrería y accesorios en plata, cobre y alpaca.",
          stands: ["Stand J-01", "Stand J-02", "Stand J-03"],
        },
      ],
    },
    {
      nombre: "Pabellón Artesanías Tradicionales",
      descripcion: "Espacio para maestros artesanos tradicionales del país.",
      sectores: [
        {
          nombre: "Sector Telar y Randa",
          descripcion: "Tejidos tradicionales del monte y valles.",
          stands: ["Stand T-01", "Stand T-02", "Stand T-03"],
        },
        {
          nombre: "Sector Madera y Cerámica",
          descripcion: "Artesanías en algarrobo, cardón y barro cocido.",
          stands: ["Stand MC-01", "Stand MC-02", "Stand MC-03"],
        },
      ],
    },
  ];

  for (const pab of estructura) {
    let pabellon = await prisma.pabellon.findFirst({
      where: { nombre: pab.nombre },
    });

    if (!pabellon) {
      pabellon = await prisma.pabellon.create({
        data: {
          nombre: pab.nombre,
          descripcion: pab.descripcion,
        },
      });
    }

    for (const sec of pab.sectores) {
      let sector = await prisma.sector.findFirst({
        where: {
          nombre: sec.nombre,
          pabellonId: pabellon.id,
        },
      });

      if (!sector) {
        sector = await prisma.sector.create({
          data: {
            nombre: sec.nombre,
            descripcion: sec.descripcion,
            pabellonId: pabellon.id,
          },
        });
      }

      for (const standNom of sec.stands) {
        const standExistente = await prisma.stand.findFirst({
          where: {
            nombre: standNom,
            sectorId: sector.id,
          },
        });

        if (!standExistente) {
          await prisma.stand.create({
            data: {
              nombre: standNom,
              sectorId: sector.id,
              estado: "DISPONIBLE",
            },
          });
        }
      }
    }
  }

  console.log("Pabellones, sectores y stands listos.");
};

export const inicializarCasosPrueba = async (adminUsuario) => {
  console.log("Inicializando casos de prueba (artesanos, productos, stands e inscripciones)...");

  const passwordHash = await bcrypt.hash(PASSWORD_COMUN, 10);
  const nroEdicion = new Date().getFullYear();

  // Obtenemos localidad para asociar a los usuarios de prueba
  const localidad =
    (await prisma.localidad.findFirst({
      where: { nombre: { contains: "San Fernando del Valle de Catamarca", mode: "insensitive" } },
    })) ||
    (await prisma.localidad.findFirst()) ||
    { id: BigInt(10049030) };

  // Obtenemos roles
  const rolArtesano = await prisma.rol.findFirst({
    where: { nombre: { contains: "ARTESANO", mode: "insensitive" } },
  });

  // Obtenemos estados
  const estadoAprobado = await prisma.estado.findFirst({
    where: { nombre: { contains: "aprobado", mode: "insensitive" } },
  });
  const estadoNuevo = await prisma.estado.findFirst({
    where: { nombre: { contains: "nuevo", mode: "insensitive" } },
  });

  // Obtenemos rubros
  const rubroTejido =
    (await prisma.rubro.findFirst({ where: { nombre: { contains: "TEJIDO", mode: "insensitive" } } })) ||
    (await prisma.rubro.findFirst());

  const rubroAlfareria =
    (await prisma.rubro.findFirst({ where: { nombre: { contains: "ALFARERIA", mode: "insensitive" } } })) ||
    (await prisma.rubro.findFirst());

  const rubroOrfebreria =
    (await prisma.rubro.findFirst({ where: { nombre: { contains: "ORFEBRERIA", mode: "insensitive" } } })) ||
    (await prisma.rubro.findFirst({ where: { nombre: { contains: "MADERA", mode: "insensitive" } } })) ||
    rubroTejido;

  // --------------------------------------------------------------------------
  // CASO 1: usuario-artesano-1 (Aprobado, productos, SIN STAND)
  // --------------------------------------------------------------------------
  const emailArtesano1 = "artesano1@poncho.com";
  let usuario1 = await prisma.usuario.findFirst({
    where: { email: emailArtesano1 },
    include: { emprendimiento: true },
  });

  if (!usuario1) {
    usuario1 = await prisma.usuario.create({
      data: {
        nombre: "Mariana",
        apellido: "Tejerina",
        email: emailArtesano1,
        passwordHash,
        cuil: "27351112224",
        sexo: "F",
        fechaNacimiento: new Date("1988-06-15"),
        localidadId: localidad.id,
        activo: true,
        habilitado: true,
        roles: rolArtesano
          ? {
              create: {
                rol: { connect: { id: rolArtesano.id } },
              },
            }
          : undefined,
      },
      include: { emprendimiento: true },
    });
    console.log(`Usuario creado: ${emailArtesano1}`);
  }

  // Emprendimiento 1 (SIN STAND)
  let emprendimiento1 = usuario1.emprendimiento;
  if (!emprendimiento1) {
    emprendimiento1 = await prisma.emprendimiento.create({
      data: {
        nombre: "Telares del Valle Calchaquí",
        descripcion: "Prendas de vicuña y llama tejidas artesanalmente en telar criollo.",
        usuarioId: usuario1.id,
        rubroId: rubroTejido?.id,
        standId: null,
      },
    });
    console.log(`Emprendimiento creado: ${emprendimiento1.nombre} (Sin stand)`);
  }

  // Productos del Emprendimiento 1
  const cantidadProductos1 = await prisma.producto.count({
    where: { emprendimientoId: emprendimiento1.id },
  });
  if (cantidadProductos1 === 0) {
    await prisma.producto.createMany({
      data: [
        {
          nombre: "Poncho Catamarqueño Tradicional",
          descripcion: "Tejido a mano con lana pura de oveja teñida con tintes naturales.",
          precio: 85000.0,
          emprendimientoId: emprendimiento1.id,
        },
        {
          nombre: "Bufanda de Llama Hilada Fina",
          descripcion: "Prenda suave y abrigada confeccionada con fibra de primera esquila.",
          precio: 22000.5,
          emprendimientoId: emprendimiento1.id,
        },
        {
          nombre: "Camino de Mesa Rústico",
          descripcion: "Diseño autóctono con guardas diaguitas tejido en telar a pedal.",
          precio: 16500.0,
          emprendimientoId: emprendimiento1.id,
        },
      ],
    });
    console.log("Productos creados para Artesano 1.");
  }

  // Inscripción 1 (Aprobada)
  const inscripcion1 = await prisma.inscripcion.findFirst({
    where: { usuarioId: usuario1.id, nroEdicion },
  });
  if (!inscripcion1 && estadoAprobado) {
    await prisma.inscripcion.create({
      data: {
        nroEdicion,
        usuarioId: usuario1.id,
        estadoId: estadoAprobado.id,
        evaluadorId: adminUsuario?.id || null,
        observaciones: "Postulación aprobada. Documentación y calidad artesanal verificada.",
      },
    });
    console.log("Inscripción creada para Artesano 1 (Estado: aprobado, Sin Stand).");
  }

  // --------------------------------------------------------------------------
  // CASO 2: usuario-artesano-2 (Aprobado, productos, CON STAND ASIGNADO)
  // --------------------------------------------------------------------------
  const emailArtesano2 = "artesano2@poncho.com";
  let usuario2 = await prisma.usuario.findFirst({
    where: { email: emailArtesano2 },
    include: { emprendimiento: true },
  });

  if (!usuario2) {
    usuario2 = await prisma.usuario.create({
      data: {
        nombre: "Lorenzo",
        apellido: "Carrizo",
        email: emailArtesano2,
        passwordHash,
        cuil: "20324445558",
        sexo: "M",
        fechaNacimiento: new Date("1984-11-20"),
        localidadId: localidad.id,
        activo: true,
        habilitado: true,
        roles: rolArtesano
          ? {
              create: {
                rol: { connect: { id: rolArtesano.id } },
              },
            }
          : undefined,
      },
      include: { emprendimiento: true },
    });
    console.log(`Usuario creado: ${emailArtesano2}`);
  }

  // Stand asignado para artesano 2: "Stand D-01"
  const standParaAsignar = await prisma.stand.findFirst({
    where: { nombre: "Stand D-01" },
  });

  let emprendimiento2 = usuario2.emprendimiento;
  if (!emprendimiento2) {
    emprendimiento2 = await prisma.emprendimiento.create({
      data: {
        nombre: "Cerámica Nativa La Ciénaga",
        descripcion: "Piezas utilitarias y decorativas modeladas a mano y cocidas a leña.",
        usuarioId: usuario2.id,
        rubroId: rubroAlfareria?.id,
        standId: standParaAsignar ? standParaAsignar.id : null,
      },
    });

    if (standParaAsignar) {
      await prisma.stand.update({
        where: { id: standParaAsignar.id },
        data: { estado: "OCUPADO" },
      });
    }
    console.log(`Emprendimiento creado: ${emprendimiento2.nombre} (Con Stand: Stand D-01)`);
  }

  // Productos del Emprendimiento 2
  const cantidadProductos2 = await prisma.producto.count({
    where: { emprendimientoId: emprendimiento2.id },
  });
  if (cantidadProductos2 === 0) {
    await prisma.producto.createMany({
      data: [
        {
          nombre: "Vasija Ceremonial Aguada",
          descripcion: "Reproducción arqueológica pulida a piedra con engobe mineral.",
          precio: 38000.0,
          emprendimientoId: emprendimiento2.id,
        },
        {
          nombre: "Juego de Cazuelas de Barro x6",
          descripcion: "Set de cazuelas resistentes al calor directo para guisados y horno.",
          precio: 25000.0,
          emprendimientoId: emprendimiento2.id,
        },
        {
          nombre: "Cuenco Rústico Ahumado",
          descripcion: "Pieza única terminada con reducción de humo de jarilla.",
          precio: 14000.0,
          emprendimientoId: emprendimiento2.id,
        },
      ],
    });
    console.log("Productos creados para Artesano 2.");
  }

  // Inscripción 2 (Aprobada)
  const inscripcion2 = await prisma.inscripcion.findFirst({
    where: { usuarioId: usuario2.id, nroEdicion },
  });
  if (!inscripcion2 && estadoAprobado) {
    await prisma.inscripcion.create({
      data: {
        nroEdicion,
        usuarioId: usuario2.id,
        estadoId: estadoAprobado.id,
        evaluadorId: adminUsuario?.id || null,
        observaciones: "Postulación aprobada con stand Stand D-01 asignado.",
      },
    });
    console.log("Inscripción creada para Artesano 2 (Estado: aprobado, Con Stand D-01).");
  }

  // --------------------------------------------------------------------------
  // CASO 3: postulación-nueva / inscripcion-3 (Estado: nuevo, para evaluar)
  // --------------------------------------------------------------------------
  const emailPostulante = "postulante@poncho.com";
  let usuario3 = await prisma.usuario.findFirst({
    where: { email: emailPostulante },
    include: { emprendimiento: true },
  });

  if (!usuario3) {
    usuario3 = await prisma.usuario.create({
      data: {
        nombre: "Sofía",
        apellido: "Gómez",
        email: emailPostulante,
        passwordHash,
        cuil: "27409998881",
        sexo: "F",
        fechaNacimiento: new Date("1996-03-08"),
        localidadId: localidad.id,
        activo: true,
        habilitado: false, // Aún no habilitada
      },
      include: { emprendimiento: true },
    });
    console.log(`Usuario postulante creado: ${emailPostulante}`);
  }

  // Emprendimiento 3
  let emprendimiento3 = usuario3.emprendimiento;
  if (!emprendimiento3) {
    emprendimiento3 = await prisma.emprendimiento.create({
      data: {
        nombre: "Cincelados del Cerro",
        descripcion: "Cuchillería criolla y piezas de platería regional cinceladas a mano.",
        usuarioId: usuario3.id,
        rubroId: rubroOrfebreria?.id,
        standId: null,
      },
    });
    console.log(`Emprendimiento de postulación creado: ${emprendimiento3.nombre}`);
  }

  // Inscripción 3 (Estado "nuevo", lista para evaluar en Swagger)
  const inscripcion3 = await prisma.inscripcion.findFirst({
    where: { usuarioId: usuario3.id, nroEdicion },
  });
  if (!inscripcion3 && estadoNuevo) {
    const nuevaInscripcion = await prisma.inscripcion.create({
      data: {
        nroEdicion,
        usuarioId: usuario3.id,
        estadoId: estadoNuevo.id,
        evaluadorId: null,
        observaciones: null,
      },
    });
    console.log(`Inscripción de prueba lista para evaluar creada (ID: ${nuevaInscripcion.id}, Estado: nuevo).`);
  }
};

