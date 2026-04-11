import { z } from "zod";

export const rechazoSchema = z.object({
  justificacion_rechazo: z.string().min(15, "La justificación debe contener los motivos técnicos (mínimo 15 caracteres) para descartar el material."),
});
