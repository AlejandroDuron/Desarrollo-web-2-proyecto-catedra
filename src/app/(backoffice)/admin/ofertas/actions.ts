"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient, requireRole } from "@/lib/supabase/server";
import { rechazoSchema } from "./schema";

export async function aprobarOferta(id: string) {
  try {
    await requireRole("admin_general");
    const supabase = await createSupabaseServerClient();

    const { error } = await supabase
      .from("ofertas")
      .update({ estado: "Oferta aprobada", justificacion_rechazo: null })
      .eq("id", id);

    if (error) return { error: error.message };

    revalidatePath("/admin/ofertas", "page");
    return { success: true };
  } catch (error: any) {
    return { error: "Ocurrió un error letal al intentar grabar la aprobación." };
  }
}

export async function rechazarOferta(formData: FormData, id: string) {
  try {
    await requireRole("admin_general");
    
    const validated = rechazoSchema.safeParse({
      justificacion_rechazo: formData.get("justificacion_rechazo"),
    });

    if (!validated.success) {
      return { error: validated.error.issues[0].message };
    }

    const supabase = await createSupabaseServerClient();
    const { error } = await supabase
      .from("ofertas")
      .update({ 
        estado: "Oferta rechazada", 
        justificacion_rechazo: validated.data.justificacion_rechazo 
      })
      .eq("id", id);

    if (error) return { error: error.message };

    revalidatePath("/admin/ofertas", "page");
    return { success: true };
  } catch (error: any) {
    return { error: "Ocurrió un error inesperado al procesar la desestimación técnica." };
  }
}
