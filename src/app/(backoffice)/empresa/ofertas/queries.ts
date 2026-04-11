import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  type EstadoOferta,
  type CategoriaOferta,
  type OfertaConMetricas,
} from "./schema";

// ─── Row type (espejo de la tabla ofertas) ────────────────────────────────────

export interface OfertaRow {
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
  stock:                 number | null;
  estado:                string;
  justificacion_rechazo: string | null;
}

// ─── Categorizar oferta ───────────────────────────────────────────────────────

export function categorizarOferta(oferta: {
  estado:       EstadoOferta;
  fecha_inicio: string;
  fecha_fin:    string;
}): CategoriaOferta {
  const hoy    = new Date();
  hoy.setHours(0, 0, 0, 0);
  const inicio = new Date(oferta.fecha_inicio);
  const fin    = new Date(oferta.fecha_fin);

  switch (oferta.estado) {
    case "En espera de aprobación": return "en_espera";
    case "Oferta rechazada":        return "rechazadas";
    case "Oferta descartada":       return "descartadas";
    case "Oferta aprobada":
      if (inicio > hoy)                 return "aprobadas_futuras";
      if (hoy >= inicio && hoy <= fin)  return "activas";
      return "pasadas";
    default:
      return "pasadas";
  }
}

// ─── Obtener empresa ──────────────────────────────────────────────────────────

export async function getEmpresa(id_empresa: string) {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("empresas")
    .select("nombre_empresa, porcentaje_comision")
    .eq("id", id_empresa)
    .single();

  if (error || !data) throw new Error("Empresa no encontrada.");

  const empresa = data as unknown as {
    nombre_empresa:      string;
    porcentaje_comision: number;
  };

  return {
    nombre_empresa:      empresa.nombre_empresa,
    porcentaje_comision: Number(empresa.porcentaje_comision),
  };
}

// ─── Obtener ofertas ──────────────────────────────────────────────────────────

export async function getOfertasByEmpresa(
  id_empresa: string
): Promise<OfertaRow[]> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("ofertas")
    .select(`
      id, titulo, descripcion, otros_detalles, image_url,
      precio_regular, precio_oferta,
      fecha_inicio, fecha_fin, fecha_limite_uso,
      cantidad_limite, stock, estado, justificacion_rechazo
    `)
    .eq("id_empresa", id_empresa)
    .order("fecha_inicio", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as OfertaRow[];
}

// ─── Obtener una oferta por ID (validando empresa) ───────────────────────────

export async function getOfertaById(
  id:         string,
  id_empresa: string
): Promise<OfertaRow> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("ofertas")
    .select(`
      id, titulo, descripcion, otros_detalles, image_url,
      precio_regular, precio_oferta,
      fecha_inicio, fecha_fin, fecha_limite_uso,
      cantidad_limite, stock, estado, justificacion_rechazo
    `)
    .eq("id", id)
    .eq("id_empresa", id_empresa)
    .single();

  if (error || !data) throw new Error("Oferta no encontrada.");
  return data as OfertaRow;
}

export async function getOfertaConMetricasById(
    id:         string,
    id_empresa: string
  ): Promise<OfertaConMetricas> {
    const [ofertaRaw, empresa] = await Promise.all([
      getOfertaById(id, id_empresa),
      getEmpresa(id_empresa),
    ]);
   
    const cuponesMap          = await getCuponesVendidosMap([id]);
    const cupones_vendidos     = cuponesMap[id] ?? 0;
    const cupones_disponibles  = Math.max(0, Number(ofertaRaw.stock ?? 0) - cupones_vendidos);
    const ingresos_totales     = cupones_vendidos * Number(ofertaRaw.precio_oferta);
    const cargo_servicio       = ingresos_totales * (empresa.porcentaje_comision / 100);
   
    return {
      id:                    ofertaRaw.id,
      titulo:                ofertaRaw.titulo,
      descripcion:           ofertaRaw.descripcion,
      otros_detalles:        ofertaRaw.otros_detalles,
      image_url:             ofertaRaw.image_url,
      precio_regular:        Number(ofertaRaw.precio_regular),
      precio_oferta:         Number(ofertaRaw.precio_oferta),
      fecha_inicio:          ofertaRaw.fecha_inicio,
      fecha_fin:             ofertaRaw.fecha_fin,
      fecha_limite_uso:      ofertaRaw.fecha_limite_uso,
      cantidad_limite:       ofertaRaw.cantidad_limite != null ? Number(ofertaRaw.cantidad_limite) : null,
      stock:                 Number(ofertaRaw.stock ?? 0),
      estado:                ofertaRaw.estado as EstadoOferta,
      justificacion_rechazo: ofertaRaw.justificacion_rechazo,
      cupones_vendidos,
      cupones_disponibles,
      ingresos_totales,
      cargo_servicio,
      porcentaje_comision:   empresa.porcentaje_comision,
      categoria:             categorizarOferta({
        estado:       ofertaRaw.estado as EstadoOferta,
        fecha_inicio: ofertaRaw.fecha_inicio,
        fecha_fin:    ofertaRaw.fecha_fin,
      }),
    };
  }

// ─── Contar cupones vendidos ──────────────────────────────────────────────────

export async function getCuponesVendidosMap(
  ofertaIds: string[]
): Promise<Record<string, number>> {
  if (ofertaIds.length === 0) return {};

  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("cupones")
    .select("id_oferta")
    .in("id_oferta", ofertaIds);

  if (error) throw new Error(error.message);

  const map: Record<string, number> = {};
  for (const c of (data ?? []) as { id_oferta: string }[]) {
    map[c.id_oferta] = (map[c.id_oferta] ?? 0) + 1;
  }
  return map;
}

// ─── Ensamblar ofertas con métricas ──────────────────────────────────────────

export function buildOfertasConMetricas(
  ofertas:    OfertaRow[],
  cuponesMap: Record<string, number>,
  porcentaje: number
): OfertaConMetricas[] {
  return ofertas.map((o) => {
    const cupones_vendidos    = cuponesMap[o.id] ?? 0;
    const cupones_disponibles = Math.max(0, Number(o.stock ?? 0) - cupones_vendidos);
    const ingresos_totales    = cupones_vendidos * Number(o.precio_oferta);
    const cargo_servicio      = ingresos_totales * (porcentaje / 100);

    return {
      id:                    o.id,
      titulo:                o.titulo,
      descripcion:           o.descripcion,
      otros_detalles:        o.otros_detalles,
      image_url:             o.image_url,
      precio_regular:        Number(o.precio_regular),
      precio_oferta:         Number(o.precio_oferta),
      fecha_inicio:          o.fecha_inicio,
      fecha_fin:             o.fecha_fin,
      fecha_limite_uso:      o.fecha_limite_uso,
      cantidad_limite:       o.cantidad_limite != null ? Number(o.cantidad_limite) : null,
      stock:                 Number(o.stock ?? 0),
      estado:                o.estado as EstadoOferta,
      justificacion_rechazo: o.justificacion_rechazo,
      cupones_vendidos,
      cupones_disponibles,
      ingresos_totales,
      cargo_servicio,
      porcentaje_comision:   porcentaje,
      categoria:             categorizarOferta({
        estado:       o.estado as EstadoOferta,
        fecha_inicio: o.fecha_inicio,
        fecha_fin:    o.fecha_fin,
      }),
    };
  });
}

// ─── Insertar oferta ──────────────────────────────────────────────────────────

export async function insertOferta(payload: {
  id_empresa:       string;
  titulo:           string;
  descripcion:      string;
  otros_detalles:   string | null;
  precio_regular:   number;
  precio_oferta:    number;
  stock:            number;
  fecha_inicio:     string;
  fecha_fin:        string;
  fecha_limite_uso: string;
  image_url:        string | null;
  cantidad_limite:  number | null;
}) {
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.from("ofertas").insert({
    ...payload,
    estado: "En espera de aprobación" as const,
  });

  if (error) throw new Error(error.message);
}

// ─── Descartar oferta ─────────────────────────────────────────────────────────

export async function updateOfertaDescartada(
  ofertaId:   string,
  id_empresa: string
) {
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase
    .from("ofertas")
    .update({ estado: "Oferta descartada" as const })
    .eq("id", ofertaId)
    .eq("id_empresa", id_empresa)
    .eq("estado", "En espera de aprobación");

  if (error) throw new Error(error.message);
}