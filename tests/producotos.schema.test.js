import assert from "node:assert/strict";
import { test } from "node:test";
import { crearProductoSchema } from "../src/validators/productos.schemas.js";

const productoValido = {
    nombre: "Poncho artesanal",
    descripcion: "Tejido a mano",
    precio: 15000,
};

const casos = [
    {
    nombre: "acepta un producto completo",
    datos: productoValido,
    valido: true,
    },
    {
    nombre: "acepta descripción omitida",
    datos: { nombre: "Poncho", precio: 15000 },
    valido: true,
    },
    {
    nombre: "acepta descripción nula",
    datos: { ...productoValido, descripcion: null },
    valido: true,
    },
    {
    nombre: "rechaza nombre demasiado corto",
    datos: { ...productoValido, nombre: "A" },
    valido: false,
    },
    {
    nombre: "rechaza nombre compuesto por espacios",
    datos: { ...productoValido, nombre: "   " },
    valido: false,
    },
    {
    nombre: "rechaza precio cero",
    datos: { ...productoValido, precio: 0 },
    valido: false,
    },
    {
    nombre: "rechaza precio negativo",
    datos: { ...productoValido, precio: -10 },
    valido: false,
    },
    {
    nombre: "rechaza precio como texto",
    datos: { ...productoValido, precio: "15000" },
    valido: false,
    },
    {
    nombre: "rechaza precio fuera del límite",
    datos: { ...productoValido, precio: 100000000 },
    valido: false,
    },
    {
    nombre: "rechaza artesanoId enviado por el cliente",
    datos: {
        ...productoValido,
        artesanoId: "a8d7f427-a3df-46b4-b527-406b63f29bb4",
    },
    valido: false,
    },
];

for (const caso of casos) {
    test(caso.nombre, () => {
    const resultado = crearProductoSchema.safeParse(caso.datos);

    assert.equal(resultado.success, caso.valido);

    if (!caso.valido) {
        assert.ok(resultado.error.issues.length > 0);
    }
    });
}

test("normaliza el nombre y redondea el precio", () => {
    const resultado = crearProductoSchema.parse({
    nombre: "  Poncho artesanal  ",
    precio: 15000.126,
    });

    assert.equal(resultado.nombre, "Poncho artesanal");
    assert.equal(resultado.precio, 15000.13);
});

test("identifica artesanoId como un campo desconocido", () => {
    const resultado = crearProductoSchema.safeParse({
    ...productoValido,
    artesanoId: "a8d7f427-a3df-46b4-b527-406b63f29bb4",
    });

    assert.equal(resultado.success, false);
    assert.ok(
    resultado.error.issues.some(
        (issue) =>
        issue.code === "unrecognized_keys" &&
        issue.keys.includes("artesanoId")
    )
    );
});