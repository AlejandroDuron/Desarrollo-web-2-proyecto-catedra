"use server";

import type { EmpresaOfertaValues } from "./schema";

export async function saveOferta(values: EmpresaOfertaValues) {
  return {
    success: true,
    message: "Oferta pendiente de implementacion.",
    data: values,
  };
}
