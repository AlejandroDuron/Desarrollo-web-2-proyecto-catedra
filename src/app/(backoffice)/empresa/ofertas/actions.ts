"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/supabase/server";
import { ofertaSchema, CONTEO_VACIO, type CategoriaOferta, type OfertaConMetricas } from "./schema";
import {
  getEmpresa,
  getOfertasByEmpresa,
  getCuponesVendidosMap,
  buildOfertasConMetricas,
  insertOferta,
  updateOfertaDescartada,
} from "./queries";

export type { EstadoOferta, CategoriaOferta, OfertaConMetricas } from "./schema";

// ─── Obtener ofertas con métricas ─────────────────────────────────────────────

export async function getOfertasConMetricas(): Promise<{
  ofertas:        OfertaConMetricas[];
  nombre_empresa: string;
  conteos:        Record<CategoriaOferta, number>;
}> {
  const { empleado } = await requireRole("admin_empresa");
  const id_empresa   = empleado.id_empresa!;

  const [empresa, ofertas] = await Promise.all([
    getEmpresa(id_empresa),
    getOfertasByEmpresa(id_empresa),
  ]);

  if (ofertas.length === 0) {
    return {
      ofertas:        [],
      nombre_empresa: empresa.nombre_empresa,
      conteos:        { ...CONTEO_VACIO },
    };
  }

  const cuponesMap         = await getCuponesVendidosMap(ofertas.map((o) => o.id));
  const ofertasConMetricas = buildOfertasConMetricas(ofertas, cuponesMap, empresa.porcentaje_comision);

  const conteos = ofertasConMetricas.reduce(
    (acc, o) => { acc[o.categoria]++; return acc; },
    { ...CONTEO_VACIO }
  );

  return { ofertas: ofertasConMetricas, nombre_empresa: empresa.nombre_empresa, conteos };
}

// ─── Crear oferta ─────────────────────────────────────────────────────────────

export async function crearOferta(formData: FormData) {
  const raw    = Object.fromEntries(formData.entries());
  const parsed = ofertaSchema.safeParse(raw);

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const { empleado } = await requireRole("admin_empresa");

  try {
    await insertOferta({
      id_empresa:       empleado.id_empresa!,
      titulo:           parsed.data.titulo,
      descripcion:      parsed.data.descripcion,
      otros_detalles:   parsed.data.otros_detalles || null,
      precio_regular:   parsed.data.precio_regular,
      precio_oferta:    parsed.data.precio_oferta,
      stock:            parsed.data.total_cupones,
      fecha_inicio:     parsed.data.fecha_inicio,
      fecha_fin:        parsed.data.fecha_fin,
      fecha_limite_uso: parsed.data.fecha_limite_uso,
      image_url:        parsed.data.imagen_url || null,
    });
  } catch (e) {
    return { error: { server: [(e as Error).message] } };
  }

  revalidatePath("/empresa/ofertas");
  return { success: true };
}

// ─── Descartar oferta ─────────────────────────────────────────────────────────

export async function descartarOferta(ofertaId: string) {
  const { empleado } = await requireRole("admin_empresa");

  try {
    await updateOfertaDescartada(ofertaId, empleado.id_empresa!);
  } catch (e) {
    return { error: (e as Error).message };
  }

  revalidatePath("/empresa/ofertas");
  return { success: true };
}