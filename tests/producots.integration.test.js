import assert from "node:assert/strict";
import { once } from "node:events";
import { before, beforeEach, after, test } from "node:test";

// Estas comprobaciones se ejecutan ANTES de importar app y Prisma.
assert.equal(
  process.env.NODE_ENV,
  "test",
  "Las pruebas requieren NODE_ENV=test."
);

assert.ok(
  process.env.DATABASE_URL,
  "Falta DATABASE_URL para las pruebas."
);

const urlBaseDatos = new URL(process.env.DATABASE_URL);
const nombreBase = decodeURIComponent(urlBaseDatos.pathname.slice(1));

assert.match(
  nombreBase,
  /^[a-zA-Z0-9_]+_test$/,
  "La base debe tener un nombre terminado en _test."
);

assert.ok(process.env.JWT_SECRET, "Falta JWT_SECRET.");
assert.ok(process.env.EXP_JWT, "Falta EXP_JWT.");

// Imports dinámicos: la validación anterior debe ocurrir primero.
const { default: prisma } = await import("../src/config/prisma.js");
const { default: app } = await import("../src/app.js");
const { generarToken } = await import("../src/services/tokens.service.js");

let servidor;
let baseURL;
let contexto;

before(async () => {
  await prisma.$connect();

  // Puerto libre asignado por el sistema.
  servidor = app.listen(0, "127.0.0.1");
  await once(servidor, "listening");

  baseURL = `http://127.0.0.1:${servidor.address().port}`;
});

beforeEach(async () => {
  // Orden de dependencias: primero hijos y luego padres.
  await prisma.$transaction([
    prisma.registroBusqueda.deleteMany(),
    prisma.tokenRevocado.deleteMany(),
    prisma.producto.deleteMany(),
    prisma.inscripcion.deleteMany(),
    prisma.usuarioRol.deleteMany(),
    prisma.emprendimiento.deleteMany(),
    prisma.stand.deleteMany(),
    prisma.sector.deleteMany(),
    prisma.pabellon.deleteMany(),
    prisma.usuario.deleteMany(),
    prisma.rol.deleteMany(),
    prisma.estado.deleteMany(),
    prisma.rubro.deleteMany(),
    prisma.localidad.deleteMany(),
    prisma.departamento.deleteMany(),
    prisma.provincia.deleteMany(),
  ]);

  contexto = await prepararDatos();
});

after(async () => {
  try {
    if (servidor?.listening) {
      await new Promise((resolve, reject) => {
        servidor.close((error) => {
          if (error) reject(error);
          else resolve();
        });

        servidor.closeIdleConnections();
      });
    }
  } finally {
    await prisma.$disconnect();
  }
});

async function prepararDatos() {
  await prisma.provincia.create({
    data: { id: 10, nombre: "Catamarca" },
  });

  await prisma.departamento.create({
    data: {
      id: 10049,
      nombre: "Capital",
      provinciaId: 10,
    },
  });

  await prisma.localidad.create({
    data: {
      id: 10049030n,
      nombre: "San Fernando del Valle de Catamarca",
      departamentoId: 10049,
    },
  });

  const rolArtesano = await prisma.rol.create({
    data: { nombre: "ARTESANO" },
  });

  const rolAdmin = await prisma.rol.create({
    data: { nombre: "ADMINISTRADOR" },
  });

  const aprobado = await prisma.estado.create({
    data: { nombre: "aprobado" },
  });

  async function crearUsuario(numero, rolId) {
    return prisma.usuario.create({
      data: {
        nombre: `Usuario ${numero}`,
        apellido: "Prueba",
        cuil: `20-1000000${numero}-0`,
        fechaNacimiento: new Date("1995-01-01T00:00:00Z"),
        sexo: "M",
        localidadId: 10049030n,
        email: `usuario${numero}@pruebas.com`,
        // Estas pruebas no pasan por login ni verifican contraseñas.
        passwordHash: "fixture-no-utilizado-para-login",
        activo: true,
        habilitado: true,
        roles: {
          create: { rolId },
        },
      },
    });
  }

  const artesano = await crearUsuario(1, rolArtesano.id);
  const otroArtesano = await crearUsuario(2, rolArtesano.id);
  const administrador = await crearUsuario(3, rolAdmin.id);

  const emprendimiento = await prisma.emprendimiento.create({
    data: {
      nombre: "Tejidos del propietario",
      usuarioId: artesano.id,
    },
  });

  const otroEmprendimiento = await prisma.emprendimiento.create({
    data: {
      nombre: "Tejidos de otro usuario",
      usuarioId: otroArtesano.id,
    },
  });

  await prisma.inscripcion.create({
    data: {
      nroEdicion: new Date().getFullYear(),
      usuarioId: artesano.id,
      estadoId: aprobado.id,
    },
  });

  const productoAjeno = await prisma.producto.create({
    data: {
      nombre: "Producto ajeno",
      descripcion: "Debe conservarse",
      precio: 25000,
      emprendimientoId: otroEmprendimiento.id,
    },
  });

  return {
    artesano,
    emprendimiento,
    productoAjeno,
    tokenArtesano: generarToken(artesano),
    tokenAdmin: generarToken(administrador),
  };
}

async function solicitar(
  ruta,
  { metodo = "GET", autorizacion, datos } = {}
) {
  const headers = {};

  if (autorizacion !== undefined) {
    headers.Authorization = autorizacion;
  }

  if (datos !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  const respuesta = await fetch(`${baseURL}${ruta}`, {
    method: metodo,
    headers,
    body: datos === undefined ? undefined : JSON.stringify(datos),
  });

  const texto = await respuesta.text();

  return {
    status: respuesta.status,
    headers: respuesta.headers,
    body: texto ? JSON.parse(texto) : null,
  };
}

test("sin token devuelve 401 y un cuerpo de error", async () => {
  const respuesta = await solicitar("/api/productos/me/mis-productos");

  assert.equal(respuesta.status, 401);
  assert.deepEqual(respuesta.body, {
    error: "Se requiere un token de acceso.",
  });
  assert.equal(respuesta.headers.get("www-authenticate"), "Bearer");
});

test("Authorization mal formado devuelve 400", async () => {
  const respuesta = await solicitar("/api/productos/me/mis-productos", {
    autorizacion: "Basic credenciales",
  });

  assert.equal(respuesta.status, 400);
  assert.deepEqual(respuesta.body, {
    error: "Formato de autorización inválido. Debe ser: Bearer <token>",
  });
});

test("token inválido devuelve 401", async () => {
  const respuesta = await solicitar("/api/productos/me/mis-productos", {
    autorizacion: "Bearer token-invalido",
  });

  assert.equal(respuesta.status, 401);
  assert.deepEqual(respuesta.body, {
    error: "Token inválido, vencido o revocado.",
  });
});

test("un usuario sin rol ARTESANO recibe 403", async () => {
  const respuesta = await solicitar("/api/productos/me/mis-productos", {
    autorizacion: `Bearer ${contexto.tokenAdmin}`,
  });

  assert.equal(respuesta.status, 403);
  assert.deepEqual(respuesta.body, {
    error: "Acceso denegado: no posees los permisos necesarios para esta acción.",
  });
});

test("el alta persiste el producto para la cuenta autenticada", async () => {
  const respuesta = await solicitar("/api/productos", {
    metodo: "POST",
    autorizacion: `Bearer ${contexto.tokenArtesano}`,
    datos: {
      nombre: "Poncho nuevo",
      descripcion: "Tejido artesanal",
      precio: 18000.5,
    },
  });

  assert.equal(respuesta.status, 201);
  assert.equal(respuesta.body.nombre, "Poncho nuevo");
  assert.equal(
    respuesta.body.emprendimientoId,
    contexto.emprendimiento.id
  );

  const persistido = await prisma.producto.findUnique({
    where: { id: respuesta.body.id },
    include: { emprendimiento: true },
  });

  assert.ok(persistido);
  assert.equal(persistido.nombre, "Poncho nuevo");
  assert.equal(persistido.precio.toString(), "18000.5");
  assert.equal(
    persistido.emprendimiento.usuarioId,
    contexto.artesano.id
  );
});

test("rechaza artesanoId por HTTP sin crear un producto", async () => {
  const cantidadAntes = await prisma.producto.count();

  const respuesta = await solicitar("/api/productos", {
    metodo: "POST",
    autorizacion: `Bearer ${contexto.tokenArtesano}`,
    datos: {
      nombre: "Producto inválido",
      precio: 100,
      artesanoId: contexto.artesano.id,
    },
  });

  assert.equal(respuesta.status, 400);
  assert.equal(respuesta.body.error, "Los datos enviados son inválidos.");
  assert.equal(await prisma.producto.count(), cantidadAntes);
});

for (const metodo of ["PUT", "DELETE"]) {
  test(`${metodo} sobre producto ajeno devuelve 404 y lo conserva`, async () => {
    const antes = await prisma.producto.findUniqueOrThrow({
      where: { id: contexto.productoAjeno.id },
    });

    const respuesta = await solicitar(`/api/productos/${antes.id}`, {
      metodo,
      autorizacion: `Bearer ${contexto.tokenArtesano}`,
      datos: metodo === "PUT" ? { nombre: "Cambio indebido" } : undefined,
    });

    // Se consulta después de la solicitud para comprobar persistencia.
    const despues = await prisma.producto.findUnique({
      where: { id: antes.id },
    });

    assert.ok(despues, "El producto ajeno debe seguir existiendo.");
    assert.deepEqual(despues, antes, "El producto debe conservar sus datos.");
    assert.equal(respuesta.status, 404);
    assert.deepEqual(respuesta.body, {
      error: "Producto no encontrado.",
    });
  });
}