// Server Component — los datos vendrían de Supabase en producción
import { getOfertasConMetricas, type CategoriaOferta, type OfertaConMetricas } from "./actions";
import OffersHeader from "./components/OffersHeader";
import MetricsPanel from "./components/MetricsPanel";
import OffersTabs from "./components/OffersTabs";
import OffersGrid from "./components/OffersGrid";

export default async function EmpresaOfertasPage() {
  const { ofertas, nombre_empresa, conteos } = await getOfertasConMetricas();

  // Métricas globales: solo sobre ofertas activas
  const activas = ofertas.filter((o) => o.categoria === "activas");
  const metrics = {
    cuponesVendidos:    activas.reduce((s, o) => s + o.cupones_vendidos,    0),
    cuponesDisponibles: activas.reduce((s, o) => s + o.cupones_disponibles, 0),
    ingresosTotales:    activas.reduce((s, o) => s + o.ingresos_totales,    0),
    cargoServicio:      activas.reduce((s, o) => s + o.cargo_servicio,      0),
    comisionPct:        ofertas[0]?.porcentaje_comision ?? 0,
  };

  // Serializar para pasar a Client Components
  const ofertasPorCategoria: Record<CategoriaOferta, OfertaConMetricas[]> = {
    en_espera:        ofertas.filter((o) => o.categoria === "en_espera"),
    aprobadas_futuras: ofertas.filter((o) => o.categoria === "aprobadas_futuras"),
    activas:          activas,
    pasadas:          ofertas.filter((o) => o.categoria === "pasadas"),
    rechazadas:       ofertas.filter((o) => o.categoria === "rechazadas"),
    descartadas:      ofertas.filter((o) => o.categoria === "descartadas"),
  };

  return (
    <div className="px-8 py-10 max-w-7xl mx-auto">
      <OffersHeader empresaNombre={nombre_empresa} />
      <MetricsPanel metrics={metrics} />
      <OffersTabs
        conteos={conteos}
        ofertasPorCategoria={ofertasPorCategoria}
      />
    </div>
  );
}