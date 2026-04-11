"use server"

import { createSupabaseServerClient, requireRole } from "@/lib/supabase/server";

export async function updatePasswordAction(formData: FormData) {
  try {
    await requireRole("admin_empresa");
    
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (!password || password.length < 6) {
      return { error: "La contraseña debe tener al menos 6 caracteres" };
    }

    if (password !== confirmPassword) {
      return { error: "Las contraseñas no coinciden" };
    }

    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      return { error: error.message };
    }

    return { success: true };
  } catch (error: any) {
    return { error: "Ocurrió un error inesperado al actualizar la contraseña" };
  }
}
