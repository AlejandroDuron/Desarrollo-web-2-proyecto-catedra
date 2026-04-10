"use server";

import type { CanjeFormValues } from "./schema";

export async function registerCanje(values: CanjeFormValues) {
  return {
    success: true,
    message: "Canje pendiente de implementacion.",
    data: values,
  };
}
