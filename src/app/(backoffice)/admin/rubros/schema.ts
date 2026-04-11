import { z } from "zod";

export const rubroSchema = z.object({
  nombre_rubro: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
});

export type RubroFormData = z.infer<typeof rubroSchema>;
