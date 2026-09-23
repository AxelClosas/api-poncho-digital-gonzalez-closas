# Spec Delta

## Purpose

Define formalmente las reglas de negocio, ciclo de vida, transiciones de estados y endpoints HTTP para la gestión de las postulaciones (`Inscripcion`) de artesanos en la plataforma Poncho Digital.

## ADDED Requirements

### Requirement: Solicitud de creación de postulación
El sistema SHALL proveer un endpoint `POST /api/postulaciones` que permite a un usuario solicitar una postulación para la feria. La solicitud requiere obligatoriamente `id_artesano` (numérico entero positivo) y `trayectoria` (texto no vacío). El sistema SHALL verificar que el usuario exista, que su rol sea de Visitante (`id_rol = 3`), y que no posea una postulación activa en estado Pendiente (3), Mod_Solicitada (4) o En_Reevaluacion (5). Toda nueva postulación SHALL ser creada en estado Pendiente (`id_estado = 3`) y responder con código HTTP 201 Created.

#### Scenario: Creación exitosa de postulación
- **WHEN** un usuario con rol Visitante realiza una petición `POST` a `/api/postulaciones` con un `id_artesano` válido y un texto en `trayectoria`
- **THEN** el sistema persiste la inscripción con `id_estado = 3`, registra la fecha de solicitud actual y responde con código HTTP 201 y los datos de la postulación creada.

#### Scenario: Rechazo por campos faltantes o inválidos
- **WHEN** un cliente realiza una petición `POST` a `/api/postulaciones` sin `id_artesano` o con una `trayectoria` vacía o no textual
- **THEN** el sistema responde con código HTTP 400 Bad Request y un mensaje descriptivo del error.

#### Scenario: Rechazo por usuario no postulable (rol no visitante o inexistente)
- **WHEN** un cliente realiza una petición `POST` a `/api/postulaciones` con un `id_artesano` que no existe o cuyo rol no es Visitante (`id_rol != 3`)
- **THEN** el sistema responde con código HTTP 400 Bad Request indicando que solo los usuarios visitantes pueden solicitar una postulación.

#### Scenario: Conflicto por postulación activa preexistente
- **WHEN** un cliente realiza una petición `POST` a `/api/postulaciones` para un usuario que ya cuenta con una postulación en estado Pendiente (3), Mod_Solicitada (4) o En_Reevaluacion (5)
- **THEN** el sistema responde con código HTTP 409 Conflict indicando que el usuario ya posee una postulación activa en curso.

---

### Requirement: Consulta de postulaciones con filtros
El sistema SHALL proveer un endpoint `GET /api/postulaciones` que retorna la lista de postulaciones persistidas, permitiendo filtrar opcionalmente por parámetros de búsqueda (`id_estado` y/o `id_artesano`). La respuesta SHALL incluir las relaciones con el usuario artesano, el estado actual y el usuario administrador evaluador (si existiese), respondiendo con código HTTP 200 OK.

#### Scenario: Consulta general exitosa
- **WHEN** un cliente realiza una petición `GET` a `/api/postulaciones` sin parámetros
- **THEN** el sistema responde con código HTTP 200 y el listado de todas las postulaciones con sus entidades relacionadas (`artesano`, `estado`, `administrador`).

#### Scenario: Consulta con filtro de estado o artesano
- **WHEN** un cliente realiza una petición `GET` a `/api/postulaciones?id_estado=3` o `?id_artesano=5`
- **THEN** el sistema responde con código HTTP 200 y únicamente las postulaciones que coinciden con los criterios provistos.

---

### Requirement: Consulta de postulación por ID
El sistema SHALL proveer un endpoint `GET /api/postulaciones/:id` que busca y retorna la postulación correspondiente al ID especificado, incluyendo sus relaciones asociadas. Si el ID no es numérico entero positivo, el sistema SHALL retornar HTTP 400. Si la postulación no existe, el sistema SHALL retornar HTTP 404 Not Found.

#### Scenario: Postulación encontrada por ID
- **WHEN** un cliente realiza una petición `GET` a `/api/postulaciones/:id` con un ID existente
- **THEN** el sistema responde con código HTTP 200 y el objeto completo de la postulación.

#### Scenario: Postulación no encontrada
- **WHEN** un cliente realiza una petición `GET` a `/api/postulaciones/:id` con un ID que no existe en el sistema
- **THEN** el sistema responde con código HTTP 404 Not Found.

---

### Requirement: Modificación de postulación por el postulante
El sistema SHALL proveer un endpoint `PUT /api/postulaciones/:id` que permite al postulante actualizar el campo `trayectoria` de su postulación. El sistema SHALL verificar que la postulación exista y que su estado actual sea Pendiente (`id_estado = 3`) o Mod_Solicitada (`id_estado = 4`). Si la postulación se encuentra en Mod_Solicitada, el sistema SHALL transicionar automáticamente su estado a En_Reevaluacion (`id_estado = 5`). Si la postulación se encuentra en cualquier otro estado (Aprobado, Rechazado o En_Reevaluacion), el sistema SHALL rechazar la petición con código HTTP 400.

#### Scenario: Modificación exitosa desde estado Mod_Solicitada
- **WHEN** el postulante realiza un `PUT` a `/api/postulaciones/:id` con una nueva `trayectoria` sobre una postulación en estado Mod_Solicitada (4)
- **THEN** el sistema actualiza la trayectoria, cambia automáticamente el `id_estado` a 5 (En_Reevaluacion) y responde con código HTTP 200.

#### Scenario: Modificación exitosa desde estado Pendiente
- **WHEN** el postulante realiza un `PUT` a `/api/postulaciones/:id` con una nueva `trayectoria` sobre una postulación en estado Pendiente (3)
- **THEN** el sistema actualiza la trayectoria conservando el estado Pendiente (3) y responde con código HTTP 200.

#### Scenario: Rechazo de edición por estado bloqueado
- **WHEN** el postulante intenta realizar un `PUT` a `/api/postulaciones/:id` sobre una postulación que ya se encuentra en Aprobado (1), Rechazado (2) o En_Reevaluacion (5)
- **THEN** el sistema rechaza la operación con código HTTP 400 Bad Request indicando que la postulación no se encuentra en un estado modificable.

---

### Requirement: Evaluación administrativa de postulación
El sistema SHALL proveer un endpoint `PATCH /api/postulaciones/:id/evaluar` exclusivo para administradores, que permite evaluar una postulación cambiando su estado a Aprobado (`id_estado = 1`), Rechazado (`id_estado = 2`) o Mod_Solicitada (`id_estado = 4`). La petición requiere obligatoriamente `id_administrador`, `id_estado` y, en caso de asignar Rechazado o Mod_Solicitada, el campo `observaciones` no vacío. El sistema SHALL verificar que el usuario evaluador exista y posea rol de Admin (`id_rol = 1`). Si el nuevo estado es Aprobado, el sistema SHALL actualizar en la misma transacción el rol del usuario postulante a Artesano (`id_rol = 2`).

#### Scenario: Aprobación exitosa con ascenso a rol Artesano
- **WHEN** un administrador realiza un `PATCH` a `/api/postulaciones/:id/evaluar` enviando `id_administrador` válido e `id_estado: 1`
- **THEN** el sistema actualiza la postulación a Aprobado (1), registra la `fecha_evaluacion`, asocia al `administrador`, promueve al usuario postulante a rol Artesano (`id_rol = 2`) y responde con código HTTP 200.

#### Scenario: Rechazo o solicitud de modificación con observaciones obligatorias
- **WHEN** un administrador realiza un `PATCH` a `/api/postulaciones/:id/evaluar` enviando `id_estado: 2` (Rechazado) o `id_estado: 4` (Mod_Solicitada) junto con el texto explicativo en `observaciones`
- **THEN** el sistema actualiza el estado y las observaciones de la postulación, registrando la fecha de evaluación y el administrador evaluador, y responde con código HTTP 200.

#### Scenario: Rechazo de evaluación por omisión de observaciones obligatorias
- **WHEN** un administrador realiza un `PATCH` a `/api/postulaciones/:id/evaluar` indicando `id_estado: 2` o `id_estado: 4` omitiendo o dejando vacío el campo `observaciones`
- **THEN** el sistema responde con código HTTP 400 Bad Request indicando que las observaciones son obligatorias para rechazos o solicitudes de modificación.

#### Scenario: Rechazo de evaluación por evaluador no autorizado o inexistente
- **WHEN** se envía una petición `PATCH` a `/api/postulaciones/:id/evaluar` con un `id_administrador` inexistente o cuyo rol no sea Admin (`id_rol != 1`)
- **THEN** el sistema responde con código HTTP 400 Bad Request o 403 Forbidden indicando que solo administradores pueden evaluar postulaciones.

---

### Requirement: Cancelación de postulación
El sistema SHALL proveer un endpoint `DELETE /api/postulaciones/:id` para cancelar y eliminar una postulación. El sistema SHALL permitir la eliminación únicamente si la postulación existe y se encuentra en estado Pendiente (`id_estado = 3`). Si la postulación ya fue evaluada (estados 1, 2, 4 o 5), el sistema SHALL rechazar la eliminación con código HTTP 400 Bad Request.

#### Scenario: Cancelación exitosa de postulación pendiente
- **WHEN** se realiza un `DELETE` a `/api/postulaciones/:id` sobre una postulación en estado Pendiente (3)
- **THEN** el sistema elimina el registro de la base de datos y responde con código HTTP 204 No Content.

#### Scenario: Rechazo de cancelación sobre postulación ya evaluada
- **WHEN** se realiza un `DELETE` a `/api/postulaciones/:id` sobre una postulación en estado distinto de Pendiente
- **THEN** el sistema rechaza la eliminación con código HTTP 400 Bad Request.
