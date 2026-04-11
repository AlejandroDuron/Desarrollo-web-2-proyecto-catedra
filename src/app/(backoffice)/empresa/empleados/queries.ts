import { createSupabaseServerClient, createSupabaseAdminClient } from "@/lib/supabase/server";

export interface EmpleadoRow {
  id:         string;
  nombres:    string;
  apellidos:  string;
  activo:     boolean;
  created_at: string;
  // email viene de auth.users, lo obtenemos por separado
  email?:     string;
}

// ─── Obtener empleados de la empresa ─────────────────────────────────────────

export async function getEmpleadosByEmpresa(id_empresa: string): Promise<EmpleadoRow[]> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("empleados")
    .select("id, nombres, apellidos, activo, created_at")
    .eq("id_empresa", id_empresa)
    .eq("rol", "empleado")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  const empleados = (data ?? []) as EmpleadoRow[];

  // Enriquecer con email desde auth.users via admin client
  const adminClient = createSupabaseAdminClient();
  const emailMap: Record<string, string> = {};

  await Promise.all(
    empleados.map(async (e) => {
      const { data: userData } = await adminClient.auth.admin.getUserById(e.id);
      if (userData?.user?.email) emailMap[e.id] = userData.user.email;
    })
  );

  return empleados.map((e) => ({ ...e, email: emailMap[e.id] ?? "" }));
}

// ─── Activar / desactivar empleado ───────────────────────────────────────────

export async function setEmpleadoActivo(
  id:         string,
  id_empresa: string,
  activo:     boolean
) {
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase
    .from("empleados")
    .update({ activo })
    .eq("id", id)
    .eq("id_empresa", id_empresa)
    .eq("rol", "empleado"); // nunca toca admin_empresa ni admin_general

  if (error) throw new Error(error.message);
}

// ─── Eliminar empleado (elimina de Auth, cascade borra de empleados) ─────────

export async function deleteEmpleado(id: string, id_empresa: string) {
  const supabase    = await createSupabaseServerClient();
  const adminClient = createSupabaseAdminClient();

  // Verificar que pertenece a la empresa antes de eliminar
  const { data, error: checkError } = await supabase
    .from("empleados")
    .select("id")
    .eq("id", id)
    .eq("id_empresa", id_empresa)
    .eq("rol", "empleado")
    .single();

  if (checkError || !data) throw new Error("Empleado no encontrado.");

  const { error } = await adminClient.auth.admin.deleteUser(id);
  if (error) throw new Error(error.message);
}

// ─── Actualizar empleado ──────────────────────────────────────────────────────

export async function updateEmpleado(
  id:         string,
  id_empresa: string,
  payload: {
    nombres:   string;
    apellidos: string;
    correo?:   string;
    password?: string;
  }
) {
  const supabase    = await createSupabaseServerClient();
  const adminClient = createSupabaseAdminClient();

  // Verificar que pertenece a la empresa
  const { data, error: checkError } = await supabase
    .from("empleados")
    .select("id")
    .eq("id", id)
    .eq("id_empresa", id_empresa)
    .eq("rol", "empleado")
    .single();

  if (checkError || !data) throw new Error("Empleado no encontrado.");

  // Actualizar nombres y apellidos en tabla empleados
  const { error: updateError } = await supabase
    .from("empleados")
    .update({ nombres: payload.nombres, apellidos: payload.apellidos })
    .eq("id", id);

  if (updateError) throw new Error(updateError.message);

  // Actualizar email y/o password en Auth si se proporcionaron
  const authUpdate: { email?: string; password?: string } = {};
  if (payload.correo)   authUpdate.email    = payload.correo;
  if (payload.password) authUpdate.password = payload.password;

  if (Object.keys(authUpdate).length > 0) {
    const { error: authError } = await adminClient.auth.admin.updateUserById(id, authUpdate);
    if (authError) throw new Error(authError.message);
  }
}