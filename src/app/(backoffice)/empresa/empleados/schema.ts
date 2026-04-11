import { z } from "zod";

export const empleadoSchema = z.object({
  nombres:   z.string().min(2,  "El nombre debe tener al menos 2 caracteres"),
  apellidos: z.string().min(2,  "Los apellidos deben tener al menos 2 caracteres"),
  correo:    z.string().email("El correo no es válido"),
  password:  z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
});

export const empleadoUpdateSchema = z.object({
  nombres:   z.string().min(2,  "El nombre debe tener al menos 2 caracteres"),
  apellidos: z.string().min(2,  "Los apellidos deben tener al menos 2 caracteres"),
  correo:    z.string().email("El correo no es válido"),
  password:  z.string().min(8, "La contraseña debe tener al menos 8 caracteres").optional().or(z.literal("")),
});

export type EmpleadoFormValues   = z.infer<typeof empleadoSchema>;
export type EmpleadoUpdateValues = z.infer<typeof empleadoUpdateSchema>;

export const empleadoInitialValues: EmpleadoFormValues = {
  nombres:   "",
  apellidos: "",
  correo:    "",
  password:  "",
};