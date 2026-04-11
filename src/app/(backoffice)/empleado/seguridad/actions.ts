"use server";

import { createSupabaseServerClient } from "../../../../lib/supabase/server";

export async function updatePassword(prevState: any, formData: FormData) {

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    return { success: false, message: "Todos los campos son obligatorios." };
  }

  if (password !== confirmPassword) {
    return { success: false, message: "Las contraseñas no coinciden." };
  }

  if (password.length < 6) {
    return { success: false, message: "La contraseña debe tener al menos 6 caracteres." };
  }

  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.auth.updateUser({
    password: password
  });

  if (error) {
    return { success: false, message: "Hubo un error al actualizar la contraseña." };
  }

  return { success: true, message: "¡Contraseña actualizada exitosamente!" };
}