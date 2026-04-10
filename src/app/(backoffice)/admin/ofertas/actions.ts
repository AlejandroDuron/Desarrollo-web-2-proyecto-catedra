"use server";

import type { OfertaRevisionValues } from "./schema";

export async function reviewOferta(values: OfertaRevisionValues) {
  return {
    success: true,
    message: "Revision pendiente de implementacion.",
    data: values,
  };
}
