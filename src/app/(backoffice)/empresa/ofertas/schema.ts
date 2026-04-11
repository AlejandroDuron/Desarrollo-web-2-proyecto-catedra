import { z } from "zod";

export const ofertaSchema = z.object({
  titulo:        z.string().min(3,  "El título debe tener al menos 3 caracteres"),
  descripcion:   z.string().min(10, "La descripción debe tener al menos 10 caracteres"),
  precio:        z.coerce.number().positive("El precio debe ser mayor a 0"),
  total_cupones: z.coerce.number().int().positive("Debe haber al menos 1 cupón"),
  fecha_inicio:  z.string().min(1, "La fecha de inicio es requerida"),
  fecha_fin:     z.string().min(1, "La fecha de fin es requerida"),
  imagen_url:    z.string().url("La URL de imagen no es válida").optional().or(z.literal("")),
});

export type OfertaFormValues = z.infer<typeof ofertaSchema>;

export const ofertaInitialValues: OfertaFormValues = {
  titulo:        "",
  descripcion:   "",
  precio:        0,
  total_cupones: 0,
  fecha_inicio:  "",
  fecha_fin:     "",
  imagen_url:    "",
};