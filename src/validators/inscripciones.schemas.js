import { z } from "zod";

// Schema para la postulación pública completa
export const postularseSchema = z
  .object({
    nombre: z
      .string({ required_error: "El nombre es obligatorio." })
      .trim()
      .min(2, "El nombre debe tener al menos 2 caracteres."),
    apellido: z
      .string({ required_error: "El apellido es obligatorio." })
      .trim()
      .min(2, "El apellido debe tener al menos 2 caracteres."),
    cuil: z
      .string({ required_error: "El CUIL es obligatorio." })
      .trim()
      .transform((val) => val.replace(/-/g, ""))
      .refine((val) => /^\d{11}$/.test(val), "El CUIL debe contener 11 dígitos numéricos."),
    fechaNacimiento: z.coerce.date({
      required_error: "La fecha de nacimiento es obligatoria.",
      invalid_type_error: "Formato de fecha inválido.",
    }),
    sexo: z
      .string({ required_error: "El sexo es obligatorio." })
      .trim()
      .min(1, "El sexo es obligatorio."),
    email: z
      .string({ required_error: "El email es obligatorio." })
      .trim()
      .toLowerCase()
      .email("El formato de email no es válido."),
    password: z
      .string({ required_error: "La contraseña es obligatoria." })
      .min(8, "La contraseña debe tener al menos 8 caracteres."),
    localidadId: z.coerce
      .string({ required_error: "La localidad es obligatoria." })
      .regex(/^\d+$/, "El ID de localidad debe ser numérico.")
      .transform((val) => BigInt(val)),

    emprendimiento: z
      .object({
        nombre: z
          .string({ required_error: "El nombre del emprendimiento es obligatorio." })
          .trim()
          .min(2, "El nombre del emprendimiento debe tener al menos 2 caracteres."),
        descripcion: z.string().trim().max(1000).optional().nullable(),
        rubroId: z
          .number({ required_error: "El rubro es obligatorio." })
          .int()
          .positive("El ID de rubro debe ser un entero positivo."),
      })
      .strict(),
      // Cambio en la lógica de negocio. La edición será determinada por el backend, no por el usuario. Por lo tanto, se elimina la validación de nroEdicion en el schema de postulación.
    // nroEdicion: z
    //   .number({
    //     required_error: "El año de edición es obligatorio.",
    //     invalid_type_error: "El año de edición debe ser un número.",
    //   })
    //   .int("El año de edición debe ser un número entero.")
    //   .min(new Date().getFullYear(), "El año de edición no puede ser mayor al año actual.")
    //   .positive("El año de edición debe ser un número positivo."),
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
    standId: z.number().int().positive().nullable().optional(), // Opcional si se aprueba y se asigna stand
  })
  .strict();

export const inscripcionIdParamSchema = z
  .object({
    id: z.string().uuid("El ID de inscripción debe ser un UUID válido."),
  })
  .strict();