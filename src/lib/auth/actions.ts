"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  createSupabaseServerClient,
  getAppUrl,
  getEmpleadoByUserId,
  signOutServerSession,
} from "@/lib/supabase/server";
import { getDefaultPathByRole } from "@/types/roles";

export interface AuthActionState {
  success?: string;
  error?: string;
}

function getStringField(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function loginAction(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = getStringField(formData, "email");
  const password = getStringField(formData, "password");

  if (!email || !password) {
    return { error: "Debes ingresar tu correo y contrasena." };
  }

  const supabase = await createSupabaseServerClient();
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (signInError) {
    return { error: "Credenciales invalidas o acceso no disponible." };
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    await supabase.auth.signOut();
    return { error: "No se pudo validar la sesion del usuario." };
  }

  const empleado = await getEmpleadoByUserId(user.id);

  if (!empleado) {
    await supabase.auth.signOut();
    return { error: "Tu cuenta no tiene acceso al backoffice." };
  }

  if (!empleado.activo) {
    await supabase.auth.signOut();
    return {
      error: "Tu usuario interno esta inactivo. Contacta al administrador.",
    };
  }

  revalidatePath("/", "layout");
  redirect(getDefaultPathByRole(empleado.rol));
}

export async function recoveryAction(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = getStringField(formData, "email");

  if (!email) {
    return { error: "Debes ingresar un correo electronico." };
  }

  const appUrl = await getAppUrl();
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${appUrl}/recovery`,
  });

  if (error) {
    console.error("resetPasswordForEmail error:", {
      message: error.message,
      code: error.code,
      status: error.status,
      redirectTo: `${appUrl}/recovery`,
    });
    return {
      error: `No se pudo procesar la recuperacion: ${error.message}`,
    };
  }

  return {
    success: "Si el correo existe, recibiras un enlace para recuperar tu acceso.",
  };
}

export async function logoutAction() {
  await signOutServerSession();
  revalidatePath("/", "layout");
  redirect("/login");
}
