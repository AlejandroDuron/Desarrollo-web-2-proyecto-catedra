import { Building2, Clock, TicketPercent, CircleDollarSign } from "lucide-react";

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2
});

interface StatsProps {
  metrics: {
    empresas: number;
    espera: number;
    cupones: number;
    comisiones: number;
  }
}

export default function StatsGrid({ metrics }: StatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Comisión Total */}
      <div className="card p-6 flex flex-col justify-between bg-white border border-[var(--green)]/30 relative overflow-hidden group">
        <div className="absolute -right-4 -top-4 w-24 h-24 bg-[var(--green-bg)] rounded-full opacity-50 group-hover:scale-110 transition-transform"></div>
        <div className="flex justify-between items-start mb-4 relative">
          <p className="text-sm font-bold text-[var(--muted)]">Comisiones Generales</p>
          <div className="p-2 bg-[var(--green-bg)] text-[var(--green)] rounded-lg">
            <CircleDollarSign size={20} strokeWidth={2.5} />
          </div>
        </div>
        <div className="relative">
          <h3 className="text-3xl font-black text-[var(--green2)] font-mono tracking-tighter">
            {formatter.format(metrics.comisiones)}
          </h3>
        </div>
      </div>

      {/* Empresas Activas */}
      <div className="card p-6 flex flex-col justify-between border border-[var(--border)]">
        <div className="flex justify-between items-start mb-4">
          <p className="text-sm font-bold text-[var(--muted)]">Empresas Aliadas</p>
          <div className="p-2 bg-[#EDEEEF] rounded-lg text-slate-500">
            <Building2 size={20} />
          </div>
        </div>
        <div>
          <h3 className="text-3xl font-bold text-[var(--text)] font-mono tracking-tighter">
            {metrics.empresas}
          </h3>
        </div>
      </div>

      {/* Ofertas en Espera */}
      <div className="card p-6 flex flex-col justify-between border border-[var(--border)]">
        <div className="flex justify-between items-start mb-4">
          <p className="text-sm font-bold text-[var(--muted)]">Ofertas en Espera</p>
          <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
            <Clock size={20} />
          </div>
        </div>
        <div>
          <h3 className="text-3xl font-bold text-[var(--text)] font-mono tracking-tighter">
            {metrics.espera}
          </h3>
        </div>
      </div>

      {/* Volumen de Ventas Bruto */}
      <div className="card p-6 flex flex-col justify-between border border-[var(--border)] bg-[#191C1D] text-white">
        <div className="flex justify-between items-start mb-4">
          <p className="text-sm font-bold text-slate-400">Cupones Transaccionados</p>
          <div className="p-2 bg-slate-800 text-slate-300 rounded-lg">
            <TicketPercent size={20} />
          </div>
        </div>
        <div>
          <h3 className="text-3xl font-bold text-white font-mono tracking-tighter">
            {metrics.cupones}
          </h3>
        </div>
      </div>
    </div>
  );
}
