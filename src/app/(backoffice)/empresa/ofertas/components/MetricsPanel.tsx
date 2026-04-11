const fmtMoney = (n: number) =>
    n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  
  interface Metrics {
    cuponesVendidos:    number;
    cuponesDisponibles: number;
    ingresosTotales:    number;
    cargoServicio:      number;
    comisionPct:        number;
  }
  
  export default function MetricsPanel({ metrics }: { metrics: Metrics }) {
    const { cuponesVendidos, cuponesDisponibles, ingresosTotales, cargoServicio, comisionPct } = metrics;
    const total          = cuponesVendidos + cuponesDisponibles;
    const pctVendidos    = total > 0 ? (cuponesVendidos / total) * 100 : 0;
    const pctDisponibles = total > 0 ? (cuponesDisponibles / total) * 100 : 0;
  
    return (
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
  
        {/* Cupones vendidos */}
        <div className="bg-[#F3F4F5] p-6 rounded-xl">
          <p className="text-xs font-bold uppercase tracking-widest text-[#454935] mb-2">
            Cupones Vendidos
          </p>
          <span className="text-3xl font-bold text-[#191C1D]">
            {cuponesVendidos.toLocaleString("en-US")}
          </span>
          <div className="mt-4 h-1 w-full bg-[#E1E3E4] rounded-full overflow-hidden">
            <div className="h-full bg-[#526600] rounded-full" style={{ width: `${pctVendidos}%` }} />
          </div>
        </div>
  
        {/* Cupones disponibles */}
        <div className="bg-[#F3F4F5] p-6 rounded-xl">
          <p className="text-xs font-bold uppercase tracking-widest text-[#454935] mb-2">
            Cupones Disponibles
          </p>
          <span className="text-3xl font-bold text-[#191C1D]">
            {cuponesDisponibles.toLocaleString("en-US")}
          </span>
          <div className="mt-4 h-1 w-full bg-[#E1E3E4] rounded-full overflow-hidden">
            <div className="h-full bg-[#526600] rounded-full" style={{ width: `${pctDisponibles}%` }} />
          </div>
        </div>
  
        {/* Ingresos totales */}
        <div className="bg-[#F3F4F5] p-6 rounded-xl">
          <p className="text-xs font-bold uppercase tracking-widest text-[#454935] mb-2">
            Ingresos Totales
          </p>
          <span className="text-3xl font-bold text-[#191C1D]">
            ${fmtMoney(ingresosTotales)}
          </span>
          <p className="text-[10px] text-[#454935] mt-2">
            Basado en precio de oferta actual
          </p>
        </div>
  
        {/* Cargo por servicio */}
        <div className="bg-[#191C1D] p-6 rounded-xl">
          <p className="text-xs font-bold uppercase tracking-widest text-[#F8F9FA]/60 mb-2">
            Cargo por Servicio
          </p>
          <span className="text-3xl font-bold text-[#D9FF50]">
            ${fmtMoney(cargoServicio)}
          </span>
          <p className="text-[10px] text-[#F8F9FA]/60 mt-2">
            {comisionPct}% Comisión aplicada
          </p>
        </div>
  
      </section>
    );
  }