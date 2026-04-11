"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient, requireRole } from "@/lib/supabase/server";
import { rubroSchema } from "./schema";

export async function submitRubro(formData: FormData, id?: number) {
  try {
    await requireRole("admin_general");
    
    const validated = rubroSchema.safeParse({
      nombre_rubro: formData.get("nombre_rubro"),
    });

    if (!validated.success) {
      return { error: validated.error.issues[0].message };
    }

    const supabase = await createSupabaseServerClient();
    
    if (id) {
      const { error } = await supabase
        .from("rubros")
        .update({ nombre_rubro: validated.data.nombre_rubro })
        .eq("id", id);
        
      if (error) return { error: error.message };
    } else {
      const { error } = await supabase
        .from("rubros")
        .insert({ nombre_rubro: validated.data.nombre_rubro });
        
      if (error) return { error: error.message };
    }

    revalidatePath("/admin/rubros");
    return { success: true };
  } catch (error: any) {
    return { error: error?.message || "Ocurrió un error inesperado al procesar la acción" };
  }
}

export async function deleteRubro(id: number) {
  try {
    await requireRole("admin_general");
    const supabase = await createSupabaseServerClient();
    
    const { error } = await supabase.from("rubros").delete().eq("id", id);
    if (error) return { error: error.message };
    
    revalidatePath("/admin/rubros");
    return { success: true };
  } catch (error: any) {
    return { error: error?.message || "Ocurrió un error inesperado al eliminar" };
  }
}
