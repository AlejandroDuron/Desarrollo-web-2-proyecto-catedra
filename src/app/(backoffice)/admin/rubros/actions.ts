"use server";

import type { RubroFormValues } from "./schema";

export async function saveRubro(values: RubroFormValues) {
  return {
    success: true,
    message: "Accion pendiente de implementacion.",
    data: values,
  };
}
