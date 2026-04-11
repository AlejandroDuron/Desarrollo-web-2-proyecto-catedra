import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface CuponRow {
  codigo_unico: string;
  estado_cupon: string;
  clientes: {
    nombres:   string;
    apellidos: string | null;
    dui:       string | null;
  } | null;
  ofertas: {
    titulo:        string;
    descripcion:   string | null;
    precio_oferta: number;
  } | null;
}

export async function getCuponByCodigo(codigo: string): Promise<CuponRow | null> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("cupones")
    .select(`
      codigo_unico,
      estado_cupon,
      clientes ( nombres, apellidos, dui ),
      ofertas ( titulo, descripcion, precio_oferta )
    `)
    .eq("codigo_unico", codigo)
    .single();

  if (error || !data) return null;
  return data as unknown as CuponRow;
}

export async function registrarCanje(codigo: string) {
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase
    .from("cupones")
    .update({
      estado_cupon: "Canjeado",
      fecha_canje:  new Date().toISOString(),
    })
    .eq("codigo_unico", codigo);

  if (error) throw new Error(error.message);
}