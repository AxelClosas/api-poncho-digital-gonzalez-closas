# Proposal

## Why

La plataforma Poncho Digital requiere formalizar el ciclo de vida de las **postulaciones** (`Inscripcion`), el cual constituye la compuerta principal de acceso para que los artesanos puedan participar en la feria. Actualmente, el recurso de postulaciones opera sobre un arreglo volátil en memoria y carece de validaciones de reglas de negocio, control de roles, trazabilidad de estados y manejo de transiciones.

Implementar este flujo con persistencia en Prisma ORM y middlewares de dominio garantiza:
1. Que únicamente usuarios registrados con rol de `Visitante` puedan postularse para convertirse en artesanos expositores.
2. Que la información requerida de `trayectoria` sea completada obligatoriamente.
3. Que la evaluación por parte de administradores sea transparente, requiriendo justificaciones (`observaciones`) ante rechazos o solicitudes de modificación.
4. Que exista un nuevo estado `En_Reevaluacion` que permita a los administradores identificar cuándo un postulante ha respondido y corregido las observaciones requeridas.
5. Que al aprobarse una postulación, el usuario sea promovido automáticamente al rol de `Artesano`.

## What Changes

- **Middlewares de Dominio**: Creación de `src/middlewares/postulaciones.middlewares.js` con validaciones de sintaxis y reglas de negocio (`validarIdParam`, `validarCrearPostulacion`, `verificarPostulante`, `validarActualizarPostulacion`, `verificarEstadoModificable`, `verificarEvaluador`, `validarEvaluacion`, `verificarEstadoCancelable`).
- **Servicio de Postulaciones**: Refactorización de `src/services/postulaciones.service.js` para reemplazar el almacenamiento en memoria por consultas a `prisma.inscripcion` y `prisma.usuario`, incorporando transacciones atómicas para ascender de rol al usuario ante la aprobación y gestionando las transiciones de estado.
- **Controlador de Postulaciones**: Refactorización de `src/controllers/postulaciones.controller.js` con controladores asíncronos (`async/await`) y delegación de errores al middleware centralizado mediante `next(error)`. Incorporación de la acción administrativa `evaluar`.
- **Rutas de Postulaciones**: Actualización de `src/routes/postulaciones.routes.js` asociando cada verbo y endpoint con su cadena correspondiente de middlewares de dominio.
- **Catálogo de Estados**: Incorporación del estado `En_Reevaluacion` (id: 5) en la entidad `Estado`.

## Capabilities

### New Capabilities
- `postulaciones`: Flujo integral de solicitud, consulta, modificación, evaluación administrativa y cancelación de postulaciones con control estricto de roles, estados y unicidad.

### Modified Capabilities
<!-- No existing capabilities to modify -->

## Impact

- **Código Afectado**:
  - `src/services/postulaciones.service.js` (migración a Prisma y lógica transaccional)
  - `src/controllers/postulaciones.controller.js` (controladores asíncronos y endpoint de evaluación)
  - `src/routes/postulaciones.routes.js` (montaje de middlewares y nuevas rutas)
- **Nuevos Archivos**:
  - `src/middlewares/postulaciones.middlewares.js`
- **Base de Datos**:
  - Nuevo registro en tabla `Estado`: `{ id: 5, nombre: "En_Reevaluacion" }`.
- **APIs**:
  - `POST /api/postulaciones`: Creación de postulación (201 Created / 400 Bad Request / 409 Conflict).
  - `GET /api/postulaciones`: Consulta con filtros opcionales por estado y artesano (200 OK).
  - `GET /api/postulaciones/:id`: Detalle de una postulación con relaciones (200 OK / 400 Bad Request / 404 Not Found).
  - `PUT /api/postulaciones/:id`: Actualización de trayectoria por parte del postulante (200 OK / 400 Bad Request / 404 Not Found).
  - `PATCH /api/postulaciones/:id/evaluar`: Evaluación administrativa (200 OK / 400 Bad Request / 403 Forbidden / 404 Not Found).
  - `DELETE /api/postulaciones/:id`: Cancelación de postulación en estado pendiente (204 No Content / 400 Bad Request / 404 Not Found).
