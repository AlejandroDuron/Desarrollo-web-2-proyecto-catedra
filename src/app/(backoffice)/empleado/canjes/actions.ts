"use server";

import { createSupabaseServerClient } from "../../../../lib/supabase/server";

export async function verificarCupon(codigo: string) {

  const supabase = await createSupabaseServerClient();

  const { data: cupon, error } = await supabase
    .from("cupones")
    .select(`
      codigo_unico,
      estado_cupon,
      clientes ( nombres, apellidos, dui ),
      ofertas ( titulo, descripcion, precio_oferta )
    `)
    .eq("codigo_unico", codigo)
    .single();

  if (error || !cupon) return { success: false, message: "El cupón no existe en el sistema." };

  if (cupon.estado_cupon !== "Disponible") {
    return { success: false, message: `Este cupón ya ha sido canjeado: ${cupon.estado_cupon}.` };
  }

  return { success: true, data: cupon };
}

export async function registrarCanjeFinal(codigo: string) {

  const supabase = await createSupabaseServerClient();

  const { error } = await supabase
    .from("cupones")
    .update({ 
      estado_cupon: "Canjeado",
      fecha_canje: new Date().toISOString() 
    })
    .eq("codigo_unico", codigo);

  if (error) return { success: false, message: "Error al registrar el canje." };
  return { success: true, message: "¡Cupón canjeado exitosamente!" };
}