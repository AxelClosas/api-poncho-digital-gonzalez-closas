# Design

## Context

El proyecto utiliza Node.js con Express 5 y Prisma 7 como ORM sobre PostgreSQL. La arquitectura adoptada es MVC (Modelo-Vista-Controlador) con una capa intermedia de Servicios. Actualmente, el proyecto cuenta con un middleware centralizado de errores en `src/middlewares/manejadorErrores.js` y una función utilitaria básica en `src/utils/errores.js`.

Para la motivación general del cambio, ver `proposal.md`. Para los requerimientos de comportamiento, ver `specs/usuarios/spec.md`.

## Goals / Non-Goals

**Goals:**
- Implementar los 5 endpoints REST del CRUD de la tabla `Usuario` (`GET /`, `GET /:id`, `POST /`, `PUT /:id`, `DELETE /:id`).
- Aplicar separación estricta de responsabilidades: los controladores manejan `req`, `res` y `next`; los servicios interactúan con `prisma.usuario` y ejecutan la lógica de negocio.
- Incluir la relación con `Rol` (`include: { rol: true }`) en las lecturas para brindar contexto del rol asignado.
- Interceptar errores de base de datos de Prisma (`P2002` para unicidad de CUIL/email y `P2025` para registros no encontrados) y transformarlos en respuestas HTTP estándar (409 Conflict y 404 Not Found).
- Extender `crearError` para aceptar un tercer parámetro opcional `detalles` y actualizar `manejadorErrores` para responder con `{ error, detalles }`.

**Non-Goals:**
- Hasheo de contraseñas (postergado explícitamente para futuras clases de la materia).
- Implementación de actualización parcial `PATCH` (solo se implementa `PUT` para actualización de usuarios).
- Autenticación o emisión de tokens JWT (corresponde a una capacidad futura separada).

## Decisions

### 1. Desacoplamiento de Servicios y Controladores
- **Decisión**: La capa de servicio (`usuarios.service.js`) recibe argumentos primitivos u objetos puros (no objetos `req` ni `res`) y retorna promesas con los datos o lanza errores. El controlador (`usuarios.controller.js`) se encarga de extraer parámetros, invocar al servicio, retornar los códigos HTTP correspondientes (200, 201, 204) y atrapar excepciones con `try/catch` delegando a `next(err)`.
- **Alternativa considerada**: Manejar lógica de acceso a datos directamente en el controlador. Se descartó para respetar el patrón MVC con capa de servicios establecido en el proyecto.

### 2. Detección y Mapeo de Errores de Prisma
- **Decisión**: La capa de servicio captura excepciones provenientes del cliente Prisma:
  - Código `P2002` (violación de restricción única): se lanza `crearError("El email o CUIL ya se encuentra registrado", 409, { campos: err.meta?.target })`.
  - Código `P2025` o ausencia de registro en búsquedas: se lanza `crearError("Usuario no encontrado", 404)`.
- **Alternativa considerada**: Dejar que los errores de Prisma lleguen como 500 al manejador general. Se descartó porque provocaría errores internos no explicativos al cliente.

### 3. Extensión compatible de `crearError` y `manejadorErrores`
- **Decisión**:
  - `crearError(mensaje, status, detalles = null)` adjunta `error.detalles = detalles` si fue provisto, manteniendo retrocompatibilidad con llamadas existentes.
  - `manejadorErrores` evalúa si `err.detalles` está definido: de ser así, responde `{ error: err.message, detalles: err.detalles }`; de lo contrario, responde `{ error: err.message }`.
- **Alternativa considerada**: Crear una nueva función de error solo para detalles. Se descartó en favor de unificar la utilidad existente según lo solicitado.

### 4. Validación de Identificadores Numéricos
- **Decisión**: Los identificadores de ruta (`req.params.id`) se convierten a enteros (`parseInt(id, 10)` o `Number(id)`). Si el valor no es un número entero válido positivo, se retorna inmediatamente un error HTTP 400 mediante `crearError("El ID de usuario debe ser un número entero válido", 400)`.

## Risks / Trade-offs

- **[Riesgo] Contraseñas almacenadas en texto plano**: Requisito explícito de la fase académica del proyecto.
  - *Mitigación*: Documentado como no-goal y deuda técnica que se resolverá cuando la cátedra introduzca conceptos de cifrado y JWT.
- **[Riesgo] Violación de clave foránea al asignar un `id_rol` inexistente**: Si un cliente envía un `id_rol` que no existe en la tabla `Rol`.
  - *Mitigación*: Capturar el código `P2003` de Prisma en el servicio para retornar un error 400 Bad Request indicando que el rol asignado no existe.
