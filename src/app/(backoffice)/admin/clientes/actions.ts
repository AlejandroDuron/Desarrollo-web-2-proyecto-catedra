"use server";
import { createSupabaseServerClient, requireRole } from "@/lib/supabase/server";

export async function fetchHistorialCliente(id_cliente: string) {
    await requireRole("admin_general");
    const supabase = await createSupabaseServerClient();
    
    // Extracción segura en server de la tabla cupones + ofertas + empresa
    const { data, error } = await supabase
       .from("cupones")
       .select("*, ofertas(*, empresas(nombre_empresa))")
       .eq("id_cliente", id_cliente)
       .order("fecha_compra", { ascending: false });
       
    if (error) throw new Error(error.message);
    return data;
}
