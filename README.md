# api-poncho-digital-gonzalez-closas
API REST Poncho Digital. Laboratorio Desarrollo Backend.

## Roles del sistema

El sistema utiliza únicamente los roles `ADMINISTRADOR` y `ARTESANO`.
La evaluación de inscripciones corresponde al administrador.

## Consulta de emprendimientos

`GET /api/emprendimientos` es público y devuelve `{ emprendimientos, paginacion }`.
`paginacion` contiene `pagina`, `limite`, `total` y `totalPaginas`.
Un resultado vacío devuelve `emprendimientos: []` y `totalPaginas: 0`.

| Parámetro | Valores |
| --- | --- |
| `busqueda` | Texto de 1 a 100 caracteres; busca en nombre y descripción sin distinguir mayúsculas |
| `rubroId` | Entero positivo |
| `usuarioId` | UUID del propietario |
| `standId` | Entero positivo |
| `conStand` | `true` o `false` |
| `ordenPor` | `id` (predeterminado) o `nombre` |
| `direccion` | `asc` (predeterminado) o `desc` |
| `pagina` | Entero de 1 a 21474836; predeterminado: 1 |
| `limite` | Entero de 1 a 100; predeterminado: 10 |

Los filtros se combinan. `standId` y `conStand=false` son incompatibles.
Parámetros desconocidos o inválidos devuelven 400. El orden por nombre usa
el ID ascendente para desempatar. El listado y el total se consultan en una
transacción con aislamiento `RepeatableRead`.

Ejemplo: `/api/emprendimientos?busqueda=lana&rubroId=2&conStand=false&ordenPor=nombre&direccion=asc&pagina=1&limite=10`.

Estas consultas no filtran por estado: el estado pertenece a la inscripción.
La asociación por edición y la conservación de versiones históricas se abordarán
en un cambio posterior del modelo.

Pruebas de consultas: `node --test tests/emprendimientos.consultas.test.js`.
