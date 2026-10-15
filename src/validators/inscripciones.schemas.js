import { z } from "zod";

// Schema para la postulación pública completa
export const postularseSchema = z
  .object({
    nombre: z.string({ required_error: "El nombre es obligatorio." }).trim().min(2),
    // NUEVOS CAMPOS OBLIGATORIOS SEGÚN PRISMA:
    apellido: z.string({ required_error: "El apellido es obligatorio." }).trim().min(2),
    cuil: z.string().trim().regex(/^\d{11}$/, "El CUIL debe tener 11 dígitos numéricos sin guiones."),
    fechaNacimiento: z.string().datetime({ message: "Formato de fecha inválido (debe ser ISO 8601)" }).transform(val => new Date(val)),
    sexo: z.string().trim().min(1, "El sexo es obligatorio."),
    
    email: z.string().trim().toLowerCase().email("El formato de email no es válido."),
    password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres."),
    localidadId: z.number().int().positive(),

    emprendimiento: z.object({
      nombre: z.string().trim().min(2),
      descripcion: z.string().trim().optional().nullable(),
      rubroId: z.number().int().positive(),
    }).strict(),

    nroEdicion: z.number().int().positive(),
  })
  .strict();

// Schema para consultar y filtrar inscripciones (Admin)
export const consultarInscripcionesSchema = z.object({
  nroEdicion: z.coerce.number().int().positive().optional(),
  estadoId: z.coerce.number().int().positive().optional(),
  busqueda: z.string().trim().optional(), // Buscar por nombre de usuario o emprendimiento
  ordenPor: z.enum(["createdAt", "nroTramite"]).default("createdAt"),
  direccion: z.enum(["asc", "desc"]).default("desc"),
  pagina: z.coerce.number().int().positive().default(1),
  limite: z.coerce.number().int().min(1).max(50).default(10),
});

// Schema para cambiar el estado de la inscripción (Admin)
export const cambiarEstadoSchema = z
  .object({
    estadoId: z
      .number({ required_error: "El estadoId es obligatorio." })
      .int()
      .positive("El ID del estado debe ser un entero positivo."),
    standId: z.number().int().positive().optional(), // Opcional si se aprueba y se asigna stand
  })
  .strict();

export const inscripcionIdParamSchema = z
  .object({
    id: z.string().uuid("El ID de inscripción debe ser un UUID válido."),
  })
  .strict();