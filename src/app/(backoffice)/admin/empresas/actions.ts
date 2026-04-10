"use server";

import type { EmpresaFormValues } from "./schema";

export async function saveEmpresa(values: EmpresaFormValues) {
  return {
    success: true,
    message: "Accion pendiente de implementacion.",
    data: values,
  };
}
