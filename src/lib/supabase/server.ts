import "server-only";

import { cache } from "react";

import { createServerClient } from "@supabase/ssr";
import { createClient, type User } from "@supabase/supabase-js";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

import type { Database } from "@/types/database";
import { getDefaultPathByRole, isRole, type Role } from "@/types/roles";

type EmpleadoRow = Database["public"]["Tables"]["empleados"]["Row"];
type EmpleadoInsert = Database["public"]["Tables"]["empleados"]["Insert"];

export interface SupabaseServerConfig {
  url: string;
  publishableKey: string;
}

export interface AuthenticatedEmployeeContext {
  user: User;
  empleado: EmpleadoRow;
}

export interface CreateInternalUserInput {
  email: string;
  password: string;
  empleado: Omit<EmpleadoInsert, "id">;
  emailConfirm?: boolean;
}

function getSupabaseServerConfig(): SupabaseServerConfig {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !publishableKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.",
    );
  }

  return { url, publishableKey };
}

function getServiceRoleKey(): string {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceRoleKey) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY.");
  }

  return serviceRoleKey;
}

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();
  const { url, publishableKey } = getSupabaseServerConfig();

  return createServerClient<Database>(url, publishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // In some server render contexts cookies are read-only.
        }
      },
    },
  });
}

export function createSupabaseAdminClient() {
  const { url } = getSupabaseServerConfig();

  return createClient<Database>(url, getServiceRoleKey(), {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export async function getEmpleadoByUserId(userId: string) {
  const adminClient = createSupabaseAdminClient();
  const { data, error } = await adminClient
    .from("empleados")
    .select("id, rol, id_empresa, activo")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to load employee profile: ${error.message}`);
  }

  return data;
}

export const getAuthenticatedEmployee = cache(
  async (): Promise<AuthenticatedEmployeeContext | null> => {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return null;
    }

    const empleado = await getEmpleadoByUserId(user.id);

    if (!empleado || !empleado.activo || !isRole(empleado.rol)) {
      return null;
    }

    return {
      user,
      empleado,
    };
  },
);

export async function requireAuthenticatedEmployee() {
  const context = await getAuthenticatedEmployee();

  if (!context) {
    redirect("/login");
  }

  return context;
}

export async function requireRole(expectedRole: Role) {
  const context = await requireAuthenticatedEmployee();

  if (context.empleado.rol !== expectedRole) {
    redirect(getDefaultPathByRole(context.empleado.rol));
  }

  return context;
}

export async function signOutServerSession() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
}

export async function getAppUrl() {
  const configuredUrl =
    process.env.NEXT_PUBLIC_APP_URL ?? process.env.NEXT_PUBLIC_SITE_URL;

  if (configuredUrl) {
    return configuredUrl;
  }

  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
  const protocol = requestHeaders.get("x-forwarded-proto") ?? "http";

  if (!host) {
    return "http://localhost:3000";
  }

  return `${protocol}://${host}`;
}

export async function createInternalUser(input: CreateInternalUserInput) {
  const adminClient = createSupabaseAdminClient();
  const { data: authData, error: authError } =
    await adminClient.auth.admin.createUser({
      email: input.email,
      password: input.password,
      email_confirm: input.emailConfirm ?? true,
    });

  if (authError || !authData.user) {
    throw new Error(authError?.message ?? "Failed to create auth user.");
  }

  const empleadoPayload: EmpleadoInsert = {
    id: authData.user.id,
    ...input.empleado,
  };

  const { data: empleado, error: empleadoError } = await adminClient
    .from("empleados")
    .insert(empleadoPayload)
    .select("id, rol, id_empresa, activo")
    .single();

  if (empleadoError) {
    await adminClient.auth.admin.deleteUser(authData.user.id);
    throw new Error(
      `Failed to create employee profile: ${empleadoError.message}`,
    );
  }

  if (!isRole(empleado.rol)) {
    throw new Error("The created employee has an invalid role.");
  }

  return {
    user: authData.user,
    empleado,
  };
}
