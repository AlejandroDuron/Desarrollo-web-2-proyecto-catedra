// Server Component — los datos vendrían de Supabase en producción
import OffersHeader from "./ofertas/components/OffersHeader";
import MetricsPanel  from "./ofertas/components/MetricsPanel";
import OffersTabs    from "./ofertas/components/OffersTabs";
import OffersGrid    from "./ofertas/components/OffersGrid";

const EMPRESA_NOMBRE = "Technova Solutions";

const METRICS = {
  cuponesVendidos:    1248,
  cuponesDisponibles: 352,
  ingresosTotales:    18720,
  cargoServicio:      1872,
  comisionPct:        10,
};

const OFERTAS = [
  {
    id:             "1",
    titulo:         "Pack de Smart Home: Control Total",
    dias_restantes: 12,
    ventas:         842,
    disponibles:    158,
    ingresos:       12630,
    comision:       1263,
    comision_pct:   10,
    imagen_url:     "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
    estado:         "activa" as const,
  },
  {
    id:             "2",
    titulo:         "Reloj Inteligente V2 Titanium",
    dias_restantes: 5,
    ventas:         406,
    disponibles:    94,
    ingresos:       6090,
    comision:       609,
    comision_pct:   10,
    imagen_url:     "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800",
    estado:         "activa" as const,
  },
  {
    id:             "3",
    titulo:         "Audífonos Studio Wireless Gen 4",
    dias_restantes: 2,
    ventas:         1120,
    disponibles:    5,
    ingresos:       33600,
    comision:       3360,
    comision_pct:   10,
    imagen_url:     "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
    estado:         "agotandose" as const,
  },
];

export default function EmpresaOfertasPage() {
  return (
    <div className="px-8 py-10 max-w-7xl mx-auto">
      <OffersHeader empresaNombre={EMPRESA_NOMBRE} />
      <MetricsPanel metrics={METRICS} />
      <OffersTabs />
      <OffersGrid ofertas={OFERTAS} />
    </div>
  );
}