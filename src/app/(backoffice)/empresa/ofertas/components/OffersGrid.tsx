import { type OfertaConMetricas, type CategoriaOferta } from "../actions";
import OfferCard from "./OfferCard";

interface OffersGridProps {
  ofertas:   OfertaConMetricas[];
  categoria: CategoriaOferta;
}

const EMPTY_MESSAGES: Record<CategoriaOferta, string> = {
  activas:            "No hay ofertas activas en este momento.",
  en_espera:          "No hay ofertas pendientes de aprobación.",
  aprobadas_futuras:  "No hay ofertas aprobadas programadas.",
  pasadas:            "No hay ofertas pasadas.",
  rechazadas:         "No hay ofertas rechazadas.",
  descartadas:        "No hay ofertas descartadas.",
};

export default function OffersGrid({ ofertas, categoria }: OffersGridProps) {
  if (ofertas.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <p className="text-[#454935] text-sm">{EMPTY_MESSAGES[categoria]}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {ofertas.map((oferta) => (
        <OfferCard key={oferta.id} oferta={oferta} />
      ))}
    </div>
  );
}