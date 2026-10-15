import { z } from "zod";

export const usuarioIdParamSchema = z
  .object({
    id: z.string().uuid("El ID de usuario debe ser un UUID válido."),
  })
  .strict();

export const rolParamSchema = z
  .object({
    id: z.string().uuid("El ID de usuario debe ser un UUID válido."),
    rol: z
      .string()
      .trim()
      .min(3)
      .transform((val) => val.toUpperCase()),
  })
  .strict();

// DTO para la creación administrativa de un nuevo Administrador
export const crearAdministradorSchema = z
  .object({
    nombre: z
      .string({ required_error: "El nombre es obligatorio." })
      .trim()
      .min(2, "El nombre debe tener al menos 2 caracteres."),
    email: z
      .string({ required_error: "El email es obligatorio." })
      .trim()
      .toLowerCase()
      .email("El formato de email no es válido."),
    password: z
      .string({ required_error: "La contraseña es obligatoria." })
      .min(8, "La contraseña debe tener al menos 8 caracteres."),
    localidadId: z
      .number({ required_error: "La localidad es obligatoria." })
      .int()
      .positive("El ID de localidad debe ser un entero positivo."),
    apellido: z
      .string({ required_error: "El apellido es obligatorio." })
      .trim()
      .min(2, "El apellido debe tener al menos 2 caracteres."),
    sexo: z
      .enum(["M", "F"], {
        required_error: "El sexo es obligatorio.",  
      }),
    cuil: z
      .string({ required_error: "El CUIL es obligatorio." })
      .trim()
      .regex(/^\d{2}-\d{8}-\d$/, "El CUIL debe tener el formato XX-XXXXXXXX-X."),
    fecaDeNacimiento: z
      .string({ required_error: "La fecha de nacimiento es obligatoria." })
      .trim(),
    
  })
  .strict();

// DTO para el inicio de sesión
export const iniciarSesionSchema = z
  .object({
    email: z
      .string({ required_error: "El email es obligatorio." })
      .trim()
      .toLowerCase()
      .email("El formato de email no es válido."),
    password: z
      .string({ required_error: "La contraseña es obligatoria." })
      .min(1, "La contraseña es obligatoria."),
  })
  .strict();

// DTO para filtros y paginación de usuarios
export const consultarUsuariosSchema = z.object({
  busqueda: z.string().trim().optional(), // Búsqueda por nombre o email
  activo: z
    .enum(["true", "false"])
    .transform((val) => val === "true")
    .optional(),
  rol: z.string().trim().optional(),
  localidadId: z.coerce.number().int().positive().optional(),
  ordenPor: z.enum(["nombre", "email", "createdAt"]).default("createdAt"),
  direccion: z.enum(["asc", "desc"]).default("desc"),
  pagina: z.coerce.number().int().positive().default(1),
  limite: z.coerce.number().int().min(1).max(50).default(10),
});

// DTO para habilitar/deshabilitar estado activo
export const cambiarActivoSchema = z
  .object({
    activo: z.boolean({ required_error: "El campo activo es obligatorio." }),
  })
  .strict();

// DTO para asignar rol
export const asignarRolSchema = z
  .object({
    rol: z
      .string({ required_error: "El nombre del rol es obligatorio." })
      .trim()
      .min(3)
      .transform((val) => val.toUpperCase()),
  })
  .strict();