"use server";

import { revalidatePath } from "next/cache";
import { requireRole, createInternalUser } from "@/lib/supabase/server";
import { empleadoSchema, empleadoUpdateSchema } from "./schema";
import {
  getEmpleadosByEmpresa,
  setEmpleadoActivo,
  deleteEmpleado,
  updateEmpleado,
} from "./queries";

export type { EmpleadoRow } from "./queries";

// ─── Listar empleados ─────────────────────────────────────────────────────────

export async function getEmpleados() {
  const { empleado } = await requireRole("admin_empresa");
  return getEmpleadosByEmpresa(empleado.id_empresa!);
}

// ─── Crear empleado ───────────────────────────────────────────────────────────

export async function crearEmpleado(formData: FormData) {
  const raw    = Object.fromEntries(formData.entries());
  const parsed = empleadoSchema.safeParse(raw);

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const { empleado } = await requireRole("admin_empresa");

  try {
    await createInternalUser({
      email:    parsed.data.correo,
      password: parsed.data.password,
      empleado: {
        nombres:    parsed.data.nombres,
        apellidos:  parsed.data.apellidos,
        id_empresa: empleado.id_empresa!,
        rol:        "empleado",
        activo:     true,
      },
    });
  } catch (e) {
    return { error: { server: [(e as Error).message] } };
  }

  revalidatePath("/empresa/empleados");
  return { success: true };
}

// ─── Activar / desactivar ─────────────────────────────────────────────────────

export async function toggleEmpleadoActivo(id: string, activo: boolean) {
  const { empleado } = await requireRole("admin_empresa");

  try {
    await setEmpleadoActivo(id, empleado.id_empresa!, activo);
  } catch (e) {
    return { error: (e as Error).message };
  }

  revalidatePath("/empresa/empleados");
  return { success: true };
}

// ─── Eliminar empleado ────────────────────────────────────────────────────────

export async function eliminarEmpleado(id: string) {
  const { empleado } = await requireRole("admin_empresa");

  try {
    await deleteEmpleado(id, empleado.id_empresa!);
  } catch (e) {
    return { error: (e as Error).message };
  }

  revalidatePath("/empresa/empleados");
  return { success: true };
}

// ─── Actualizar empleado ──────────────────────────────────────────────────────

export async function actualizarEmpleado(id: string, formData: FormData) {
  const raw    = Object.fromEntries(formData.entries());
  const parsed = empleadoUpdateSchema.safeParse(raw);

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const { empleado } = await requireRole("admin_empresa");

  try {
    await updateEmpleado(id, empleado.id_empresa!, {
      nombres:   parsed.data.nombres,
      apellidos: parsed.data.apellidos,
      correo:    parsed.data.correo || undefined,
      password:  parsed.data.password || undefined,
    });
  } catch (e) {
    return { error: { server: [(e as Error).message] } };
  }

  revalidatePath("/empresa/empleados");
  return { success: true };
}