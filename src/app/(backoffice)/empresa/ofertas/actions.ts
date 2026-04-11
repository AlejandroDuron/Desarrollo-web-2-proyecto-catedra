"use server";

import { revalidatePath } from "next/cache";
import { ofertaSchema } from "./schema";

export async function crearOferta(formData: FormData) {
  const raw    = Object.fromEntries(formData.entries());
  const parsed = ofertaSchema.safeParse(raw);

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  // TODO: insertar en Supabase con estado 'en_espera'
  // const supabase = await createServerClient();
  // await supabase.from("ofertas").insert({ ...parsed.data, estado: "en_espera", empresa_id: ... });

  revalidatePath("/empresa/ofertas");
  return { success: true };
}

export async function descartarOferta(ofertaId: string) {
  // TODO: actualizar estado a 'descartada' en Supabase
  // const supabase = await createServerClient();
  // await supabase.from("ofertas").update({ estado: "descartada" }).eq("id", ofertaId);

  revalidatePath("/empresa/ofertas");
  return { success: true };
}