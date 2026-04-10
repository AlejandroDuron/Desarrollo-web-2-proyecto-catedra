export type OfertaEstado = "pendiente" | "aprobada" | "rechazada";

export interface OfertaRevisionValues {
  titulo: string;
  empresa: string;
  estado: OfertaEstado;
  comentario: string;
}

export const ofertaRevisionInitialValues: OfertaRevisionValues = {
  titulo: "",
  empresa: "",
  estado: "pendiente",
  comentario: "",
};
