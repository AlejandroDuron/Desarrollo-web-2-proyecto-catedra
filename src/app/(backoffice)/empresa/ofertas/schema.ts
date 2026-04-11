import { z } from "zod";

// ─── Enums ────────────────────────────────────────────────────────────────────

export type EstadoOferta =
  | "En espera de aprobación"
  | "Oferta aprobada"
  | "Oferta rechazada"
  | "Oferta descartada";

export type CategoriaOferta =
  | "en_espera"
  | "aprobadas_futuras"
  | "activas"
  | "pasadas"
  | "rechazadas"
  | "descartadas";

// ─── Interfaces ───────────────────────────────────────────────────────────────

export interface OfertaConMetricas {
  id:                    string;
  titulo:                string;
  descripcion:           string;
  otros_detalles:        string | null;
  image_url:             string | null;
  precio_regular:        number;
  precio_oferta:         number;
  fecha_inicio:          string;
  fecha_fin:             string;
  fecha_limite_uso:      string;
  cantidad_limite:       number | null;
  stock:                 number;
  estado:                EstadoOferta;
  justificacion_rechazo: string | null;
  // métricas
  cupones_vendidos:      number;
  cupones_disponibles:   number;
  ingresos_totales:      number;
  cargo_servicio:        number;
  porcentaje_comision:   number;
  categoria:             CategoriaOferta;
}

export const CONTEO_VACIO: Record<CategoriaOferta, number> = {
  en_espera:        0,
  aprobadas_futuras: 0,
  activas:          0,
  pasadas:          0,
  rechazadas:       0,
  descartadas:      0,
};

// ─── Zod schema para crear oferta ─────────────────────────────────────────────

export const ofertaSchema = z
  .object({
    titulo:           z.string().min(3,  "El título debe tener al menos 3 caracteres"),
    descripcion:      z.string().min(10, "La descripción debe tener al menos 10 caracteres"),
    otros_detalles:   z.string().optional().or(z.literal("")),
    precio_regular:   z.coerce.number().positive("El precio regular debe ser mayor a 0"),
    precio_oferta:    z.coerce.number().positive("El precio de oferta debe ser mayor a 0"),
    total_cupones:    z.coerce.number().int().positive("Debe haber al menos 1 cupón"),
    fecha_inicio:     z.string().min(1, "La fecha de inicio es requerida"),
    fecha_fin:        z.string().min(1, "La fecha de fin es requerida"),
    fecha_limite_uso: z.string().min(1, "La fecha límite de uso es requerida"),
    imagen_url:       z.string().url("La URL de imagen no es válida").optional().or(z.literal("")),
  })
  .refine((d) => d.precio_oferta < d.precio_regular, {
    message: "El precio de oferta debe ser menor al precio regular",
    path:    ["precio_oferta"],
  })
  .refine((d) => d.fecha_fin >= d.fecha_inicio, {
    message: "La fecha de fin debe ser mayor o igual a la fecha de inicio",
    path:    ["fecha_fin"],
  })
  .refine((d) => d.fecha_limite_uso >= d.fecha_fin, {
    message: "La fecha límite de uso debe ser mayor o igual a la fecha de fin",
    path:    ["fecha_limite_uso"],
  });

export type OfertaFormValues = z.infer<typeof ofertaSchema>;

export const ofertaInitialValues: OfertaFormValues = {
  titulo:           "",
  descripcion:      "",
  otros_detalles:   "",
  precio_regular:   0,
  precio_oferta:    0,
  total_cupones:    0,
  fecha_inicio:     "",
  fecha_fin:        "",
  fecha_limite_uso: "",
  imagen_url:       "",
};