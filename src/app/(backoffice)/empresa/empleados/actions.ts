"use server";

import type { EmpleadoFormValues } from "./schema";

export async function saveEmpleado(values: EmpleadoFormValues) {
  return {
    success: true,
    message: "Empleado pendiente de implementacion.",
    data: values,
  };
}
