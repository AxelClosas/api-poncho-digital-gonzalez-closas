# Correcciones propuestas y coleccion de Postman

NO se implementaron estas correcciones. Solo se crearon los entregables.
La coleccion esta preparada para funcionar una vez aplicadas las correcciones 1 y 2.

## 1. Permitir mismo estado cuando se gestiona un stand

En src/services/inscripciones.service.js, funcion cambiarEstadoInscripcion, reemplazar:

```javascript
if (inscripcion.estadoId === estadoId) {
  throw crearError("El estado indicado es el mismo que el actual.", 409);
}
```

Por:

```javascript
if (inscripcion.estadoId === estadoId && standId === undefined) {
  throw crearError("El estado indicado es el mismo que el actual.", 409);
}
```

Permite aprobado + standId UUID para asignar/cambiar y aprobado + standId null para quitar. El resto del servicio ya libera el stand anterior y ocupa el nuevo en una transaccion. Mismo estado sin standId sigue devolviendo 409.

## 2. Exigir estadoId al evaluar

En src/validators/inscripciones.schemas.js, dentro de cambiarEstadoSchema, reemplazar:

```javascript
estadoId: uuidSchema.nullable().optional(),
```

Por:

```javascript
estadoId: uuidSchema,
```

Conservar standId: uuidSchema.nullable().optional(). El servicio necesita estadoId: omitirlo puede ocasionar una consulta sin filtro de ID. La coleccion siempre envia un estado valido.

## 3. Correccion adicional del CRUD de estados

No es necesaria para esta demo, que solo usa GET /estados. Las rutas individuales de estados validan enteros, pero el modelo Estado usa UUID.
En src/validators/estados.schemas.js, agregar el import y sustituir estadoIdParamSchema por:

```javascript
import uuidSchema from "./UUID.schema.js";

export const estadoIdParamSchema = z
  .object({ id: uuidSchema })
  .strict();
```

Mantener el import existente de z y los demas esquemas.

## Aclaraciones

- habilitado SI existe en Usuario. No reemplazar por activo; son campos distintos.
- El superadmin tiene rol ADMINISTRADOR. No existe SUPERADMIN como rol separado.
- Rechazar deshabilita si no hay otras aprobadas y libera el stand; no cambia activo a false.
- La postulacion crea usuario, emprendimiento e inscripcion, no productos.
- Cambiar asignacion usa PATCH /inscripciones/:id/estado. Editar el nombre usa PUT /stands/:id. La coleccion incluye ambos casos.
- Quitar asignacion envia standId: null. No usa DELETE porque eso borra el registro fisico del stand.
- Estas correcciones no cambian el modelo: no requieren migracion.
- La demo es secuencial; no valida asignaciones concurrentes.

## Configurar Postman

Importar Poncho-Digital-Admin.postman_collection.json mediante Import > Files.
Completar las variables de la coleccion. Evitar variables de entorno con los mismos nombres porque tienen prioridad.

| Variable | Valor |
| --- | --- |
| baseUrl | http://localhost:3000/api |
| superadminEmail / superadminPassword | Credenciales reales del administrador, desde tu .env |
| localidadId | ID numerico existente como texto |
| rubroId | UUID existente; consultar paso 00 |
| postulanteEmail / postulanteCuil | Datos nuevos para evitar duplicados |
| inscripcionRechazarId | UUID de una inscripcion pendiente precargada |
| inscripcionSinStandId | UUID de inscripcion aprobada del artesano sin stand |
| inscripcionConStandId | UUID de inscripcion aprobada del artesano con stand |
| standDisponibleId | UUID de un stand disponible |
| otroStandDisponibleId | UUID de otro stand disponible distinto |

Los IDs de inscripcion deben ser distintos y de usuarios distintos del administrador. Los dos artesanos deben tener emprendimiento y productos precargados. Los dos stands disponibles deben ser distintos entre si y del stand inicial del segundo artesano.
Los IDs de token, estados, nueva inscripcion, emprendimientos y stand anterior se capturan automaticamente. No rellenarlos manualmente.
GET /stands no devuelve IDs ni estado. Obtener IDs desde Prisma Studio o respuestas de creacion/detalle.
Para consultar localidades y stands: npx.cmd prisma studio --config ./prisma7.config.ts.
No se incluyeron contrasenas reales en los archivos.

## Ejecutar la demo

Ejecutar manualmente en orden. Paso 00 ayuda a elegir rubro antes de postularse. Paso 04 permite identificar las inscripciones precargadas y completar variables antes de seguir.
Paso 07 captura emprendimientos y stand anterior: ajustar pagina si no aparecen ambos artesanos entre los 50 resultados.
Detenerse ante un test fallido y corregir antes de continuar con mutaciones. Un test fallido no detiene automaticamente el Runner.
No repetir toda la coleccion sobre el mismo escenario: cambia estados y asignaciones. Para repetir, restaurar condiciones iniciales y usar email/CUIL nuevos.

Orden: postulacion > login > estados > consultar > aprobar nueva > rechazar precargada > revisar artesanos/productos > asignar stand al primero > cambiar stand del segundo > modificar nombre del stand > quitar asignacion del segundo > verificar > logout.
Resultado esperado: nueva aprobada, precargada rechazada, primer artesano con stand, segundo sin stand, stands liberados disponibles.

## Comandos para levantar si hace falta

```powershell
npm.cmd ci
npx.cmd prisma migrate deploy --config ./prisma7.config.ts
npx.cmd prisma generate --config ./prisma7.config.ts
npm.cmd run docs
npm.cmd run dev
```

Para los cambios propuestos basta regenerar docs y reiniciar; node --watch normalmente reinicia solo. No recrear administrador ni catalogos: ya existen.
API: http://localhost:3000
Swagger: http://localhost:3000/docs

## Pruebas pendientes despues de corregir

- Mismo estado sin standId: 409.
- estadoId omitido, null o invalido: 400.
- Aprobado + stand disponible: 200; relacion creada y stand OCUPADO.
- Cambio de stand: 200; anterior DISPONIBLE y nuevo OCUPADO.
- Aprobado + standId null: 200; sin relacion y stand DISPONIBLE.
- Stand ocupado por otro emprendimiento: 409.
- Evaluar postulacion propia: 403.

Se verificaron sintaxis JSON, cuerpos y scripts. No se ejecutaron estas peticiones contra una API corregida, porque las correcciones no estan implementadas.
