import { z } from "zod";

export const empresaSchema = z.object({
  codigo_empresa: z.string().regex(/^[A-Z]{3}[0-9]{3}$/, "El código debe tener 3 mayúsculas y 3 números (Ej: ABC123)"),
  nombre_empresa: z.string().min(2, "Requerido"),
  direccion: z.string().min(5, "Dirección muy corta"),
  nombre_contacto: z.string().min(2, "Requerido"),
  telefono: z.string().min(8, "Teléfono inválido"),
  correo: z.string().email("Correo inválido"),
  porcentaje_comision: z.coerce.number()
    .min(0, "Mínimo 0")
    .max(100, "Máximo 100")
    .refine((val) => /^\d+(\.\d{1,2})?$/.test(val.toString()), "Máx 2 decimales"),
  id_rubro: z.coerce.number().int().positive("Obligatorio"),
});

export type EmpresaFormData = z.infer<typeof empresaSchema>;
