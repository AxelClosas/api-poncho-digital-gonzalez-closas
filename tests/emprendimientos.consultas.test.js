import assert from "node:assert/strict";
import { test } from "node:test";
import { consultarEmprendimientosSchema } from "../src/validators/emprendimiento.schema.js";
import { validarConsulta } from "../src/middlewares/validacion.middleware.js";
import prisma from "../src/config/prisma.js";
import { obtenerEmprendimientos } from "../src/services/emprendimiento.services.js";

test("consulta vacía usa una página acotada y orden por id", () => {
  const consulta = consultarEmprendimientosSchema.parse({});
  assert.deepEqual(consulta, {
    ordenPor: "id", direccion: "asc", pagina: 1, limite: 10,
  });
});

test("rechaza límites inválidos, campos desconocidos y filtros contradictorios", () => {
  for (const consulta of [
    { pagina: "0" }, { pagina: "1.5" }, { pagina: "21474837" },
    { limite: "101" }, { limite: "0" }, { busqueda: "  " },
    { ordenPor: "usuarioId" }, { direccion: "invalid" },
    { usuarioId: "invalido" }, { conStand: "1" },
    { standId: "1", conStand: "false" }, { estadoId: "1" },
    { rubroId: "2147483648" }, { pagina: ["1", "2"] },
  ]) {
    assert.equal(consultarEmprendimientosSchema.safeParse(consulta).success,
      false, JSON.stringify(consulta));
  }
});

test("middleware entrega filtros transformados y comunica errores 400", () => {
  const middleware = validarConsulta(consultarEmprendimientosSchema);
  const req = { query: { conStand: "false", rubroId: "2", busqueda: " lana " } };
  middleware(req, {}, (error) => assert.equal(error, undefined));
  assert.equal(req.consultaValidada.conStand, false);
  assert.equal(req.consultaValidada.rubroId, 2);
  assert.equal(req.consultaValidada.busqueda, "lana");
  middleware({ query: { limite: "1000" } }, {}, (error) => {
    assert.equal(error.status, 400);
  });
});

test("listado y total usan los mismos filtros y conservan desempate por id", async (t) => {
  let listado;
  let conteo;
  const findManyOriginal = prisma.emprendimiento.findMany;
  const countOriginal = prisma.emprendimiento.count;
  const transaccionOriginal = prisma.$transaction;
  t.after(() => {
    prisma.emprendimiento.findMany = findManyOriginal;
    prisma.emprendimiento.count = countOriginal;
    prisma.$transaction = transaccionOriginal;
  });
  prisma.emprendimiento.findMany = (args) => {
    listado = args;
    return Promise.resolve([{ id: 3, nombre: "Lana" }]);
  };
  prisma.emprendimiento.count = (args) => {
    conteo = args;
    return Promise.resolve(3);
  };
  prisma.$transaction = async (operaciones) => Promise.all(operaciones);

  const resultado = await obtenerEmprendimientos(consultarEmprendimientosSchema.parse({
    busqueda: "lana", conStand: "false", rubroId: "2",
    pagina: "2", limite: "2", ordenPor: "nombre", direccion: "desc",
  }));
  assert.deepEqual(listado.where, conteo.where);
  assert.equal(listado.where.standId, null);
  assert.equal(listado.where.rubroId, 2);
  assert.equal(listado.where.OR[0].nombre.contains, "lana");
  assert.equal(listado.where.OR[0].nombre.mode, "insensitive");
  assert.equal(listado.skip, 2);
  assert.equal(listado.take, 2);
  assert.deepEqual(listado.orderBy, [{ nombre: "desc" }, { id: "asc" }]);
  assert.deepEqual(resultado.paginacion, {
    pagina: 2, limite: 2, total: 3, totalPaginas: 2,
  });
});
