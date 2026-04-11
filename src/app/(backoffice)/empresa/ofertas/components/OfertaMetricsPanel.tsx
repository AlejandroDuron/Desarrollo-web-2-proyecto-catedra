const fmt      = (n: number) => n.toLocaleString("en-US");
const fmtMoney = (n: number) =>
  `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

interface OfertaMetricsPanelProps {
  cupones_vendidos:    number;
  cupones_disponibles: number;
  ingresos_totales:    number;
  cargo_servicio:      number;
  porcentaje_comision: number;
  stock:               number;
}

export default function OfertaMetricsPanel({
  cupones_vendidos,
  cupones_disponibles,
  ingresos_totales,
  cargo_servicio,
  porcentaje_comision,
  stock,
}: OfertaMetricsPanelProps) {
  const pctVendidos    = stock > 0 ? (cupones_vendidos / stock) * 100    : 0;
  const pctDisponibles = stock > 0 ? (cupones_disponibles / stock) * 100 : 0;

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">

      <div className="bg-[#F3F4F5] p-6 rounded-xl">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#454935] mb-2">Cupones Vendidos</p>
        <span className="text-3xl font-bold text-[#191C1D]">{fmt(cupones_vendidos)}</span>
        <div className="mt-4 h-1.5 w-full bg-[#E1E3E4] rounded-full overflow-hidden">
          <div className="h-full bg-[#526600] rounded-full" style={{ width: `${pctVendidos}%` }} />
        </div>
      </div>

      <div className="bg-[#F3F4F5] p-6 rounded-xl">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#454935] mb-2">Cupones Disponibles</p>
        <span className="text-3xl font-bold text-[#191C1D]">{fmt(cupones_disponibles)}</span>
        <div className="mt-4 h-1.5 w-full bg-[#E1E3E4] rounded-full overflow-hidden">
          <div className="h-full bg-[#526600] rounded-full" style={{ width: `${pctDisponibles}%` }} />
        </div>
      </div>

      <div className="bg-[#F3F4F5] p-6 rounded-xl">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#454935] mb-2">Ingresos Totales</p>
        <span className="text-3xl font-bold text-[#191C1D]">{fmtMoney(ingresos_totales)}</span>
        <p className="text-[10px] text-[#454935] mt-2">Basado en precio de oferta</p>
      </div>

      <div className="bg-[#191C1D] p-6 rounded-xl">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#F8F9FA]/60 mb-2">Cargo por Servicio</p>
        <span className="text-3xl font-bold text-[#D9FF50]">{fmtMoney(cargo_servicio)}</span>
        <p className="text-[10px] text-[#F8F9FA]/60 mt-2">{porcentaje_comision}% Comisión aplicada</p>
      </div>

    </section>
  );
}