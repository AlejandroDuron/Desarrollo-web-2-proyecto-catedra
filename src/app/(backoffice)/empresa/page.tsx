// Server Component — los datos vendrían de Supabase en producción
import { getOfertasConMetricas, type CategoriaOferta, type OfertaConMetricas } from "../empresa/ofertas/actions";
import OffersHeader from "./ofertas/components/OffersHeader";
import MetricsPanel  from "./ofertas/components/MetricsPanel";
import OffersTabs    from "./ofertas/components/OffersTabs";
import OffersGrid    from "./ofertas/components/OffersGrid";

export default async function EmpresaOfertasPage() {
  const { ofertas, nombre_empresa, conteos } = await getOfertasConMetricas();

  // Métricas globales: solo sobre ofertas activas
  const activas = ofertas.filter((o: OfertaConMetricas) => o.categoria === "activas");

  const metrics = {
    cuponesVendidos:    activas.reduce((s: number, o: OfertaConMetricas) => s + o.cupones_vendidos,    0),
    cuponesDisponibles: activas.reduce((s: number, o: OfertaConMetricas) => s + o.cupones_disponibles, 0),
    ingresosTotales:    activas.reduce((s: number, o: OfertaConMetricas) => s + o.ingresos_totales,    0),
    cargoServicio:      activas.reduce((s: number, o: OfertaConMetricas) => s + o.cargo_servicio,      0),
    comisionPct:        ofertas[0]?.porcentaje_comision ?? 0,
  };
  
  const ofertasPorCategoria: Record<CategoriaOferta, OfertaConMetricas[]> = {
    en_espera:         ofertas.filter((o: OfertaConMetricas) => o.categoria === "en_espera"),
    aprobadas_futuras: ofertas.filter((o: OfertaConMetricas) => o.categoria === "aprobadas_futuras"),
    activas,
    pasadas:           ofertas.filter((o: OfertaConMetricas) => o.categoria === "pasadas"),
    rechazadas:        ofertas.filter((o: OfertaConMetricas) => o.categoria === "rechazadas"),
    descartadas:       ofertas.filter((o: OfertaConMetricas) => o.categoria === "descartadas"),
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