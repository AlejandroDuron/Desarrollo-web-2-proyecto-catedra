import { notFound } from "next/navigation";
import { requireRole } from "@/lib/supabase/server";
import { getOfertaConMetricasById } from "../queries";
import OfertaDetailHeader from "../components/OfertaDetailHeader";
import OfertaMetricsPanel from "../components/OfertaMetricsPanel";
import OfertaDetailCard from "../components/OfertaDetailCard";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function OfertaDetailPage({ params }: Props) {
  const { id }       = await params;
  const { empleado } = await requireRole("admin_empresa");

  let oferta;
  try {
    oferta = await getOfertaConMetricasById(id, empleado.id_empresa!);
  } catch {
    notFound();
  }

  const showMetrics =
    oferta.categoria !== "en_espera" && oferta.categoria !== "descartadas";

  return (
    <div className="px-4 md:px-8 py-10 max-w-7xl mx-auto">
      <OfertaDetailHeader categoria={oferta.categoria} />

      {showMetrics && (
        <OfertaMetricsPanel
          cupones_vendidos={oferta.cupones_vendidos}
          cupones_disponibles={oferta.cupones_disponibles}
          ingresos_totales={oferta.ingresos_totales}
          cargo_servicio={oferta.cargo_servicio}
          porcentaje_comision={oferta.porcentaje_comision}
          stock={oferta.stock}
        />
      )}

      <OfertaDetailCard oferta={oferta} />
    </div>
  );
}