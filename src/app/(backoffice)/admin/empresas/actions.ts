"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient, requireRole } from "@/lib/supabase/server";
import { empresaSchema } from "./schema";

export async function submitEmpresa(formData: FormData, id?: string) {
  try {
    await requireRole("admin_general");
    
    // Extracción limpia para checkboxes/radios no implementada, nos adaptamos a direct inputs
    const flatData = Object.fromEntries(formData.entries());
    const validated = empresaSchema.safeParse(flatData);

    if (!validated.success) {
      return { error: validated.error.issues[0].message };
    }

    const supabase = await createSupabaseServerClient();
    const data = validated.data;
    
    if (id) {
      const { error } = await supabase
        .from("empresas")
        .update(data)
        .eq("id", id);
        
      if (error) {
        if (error.code === '23505') {
            return { error: "Conflicto: Ya existe una empresa con ese código único o correo." };
        }
        return { error: error.message };
      }
    } else {
      const { error } = await supabase
        .from("empresas")
        .insert([data]);
        
      if (error) {
        if (error.code === '23505') {
            return { error: "Conflicto: Ya existe una empresa con ese código único o correo." };
        }
        return { error: error.message };
      }
    }

    revalidatePath("/admin/empresas");
    return { success: true };
  } catch (error: any) {
    return { error: "Error fatal procesando el formulario al servidor." };
  }
}

export async function deleteEmpresa(id: string) {
  try {
    await requireRole("admin_general");
    const supabase = await createSupabaseServerClient();
    
    const { error } = await supabase.from("empresas").delete().eq("id", id);
    if (error) return { error: "Acción bloqueada por relaciones en la BBDD (esta empresa tiene registros activos)." };
    
    revalidatePath("/admin/empresas");
    return { success: true };
  } catch (error: any) {
    return { error: "Ocurrió un error de red inesperado al eliminar." };
  }
}
