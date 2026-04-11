import OfferCard from "./OfferCard";

interface Oferta {
  id:             string;
  titulo:         string;
  dias_restantes: number;
  ventas:         number;
  disponibles:    number;
  ingresos:       number;
  comision:       number;
  comision_pct:   number;
  imagen_url:     string;
  estado:         "activa" | "agotandose" | "en_espera" | "rechazada" | "pasada";
}

export default function OffersGrid({ ofertas }: { ofertas: Oferta[] }) {
  if (ofertas.length === 0) {
    return (
      <div className="text-center py-20 text-[#454935]">
        No hay ofertas en esta categoría.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {ofertas.map((oferta) => (
        <OfferCard
          key={oferta.id}
          titulo={oferta.titulo}
          diasRestantes={oferta.dias_restantes}
          ventas={oferta.ventas}
          disponibles={oferta.disponibles}
          ingresos={oferta.ingresos}
          comision={oferta.comision}
          comisionPct={oferta.comision_pct}
          imagenUrl={oferta.imagen_url}
          estado={oferta.estado}
        />
      ))}
    </div>

    
  );
}