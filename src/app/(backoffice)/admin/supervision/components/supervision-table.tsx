"use client";

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2
});

export default function SupervisionTable({ datos }: { datos: any[] }) {
  const totalesIngresos = datos.reduce((acc, curr) => acc + curr.ingresosTotales, 0);
  const totalesCargo = datos.reduce((acc, curr) => acc + curr.cargoServicio, 0);

  return (
    <div className="overflow-x-auto card bg-[var(--bg)] p-1">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-[var(--border)] bg-[var(--surface)] text-[var(--subtle)]">
            <th className="py-4 px-6 text-xs uppercase tracking-wider font-bold">Organización</th>
            <th className="py-4 px-6 text-xs uppercase tracking-wider font-bold text-center">Volumen</th>
            <th className="py-4 px-6 text-xs uppercase tracking-wider font-bold text-right">Facturación Bruta</th>
            <th className="py-4 px-6 text-xs uppercase tracking-wider font-bold text-right">Margen (%)</th>
            <th className="py-4 px-6 text-xs uppercase tracking-wider font-bold text-right">Fee Plataforma</th>
          </tr>
        </thead>
        <tbody>
          {datos.map((d) => (
            <tr key={d.id} className="border-b border-[var(--surface2)] hover:bg-[var(--surface3)] transition-colors">
              <td className="py-4 px-6">
                <p className="font-bold text-[var(--text)] uppercase" style={{ fontFamily: "var(--font-display)" }}>{d.nombre_empresa}</p>
                <p className="text-xs text-[var(--muted)] font-mono">{d.codigo_empresa}</p>
              </td>
              <td className="py-4 px-6 text-center">
                <span className="bg-[#EDEEEF] px-2 py-1 rounded text-xs font-bold shadow-sm font-mono text-[var(--text)]">{d.cuponesVendidos} und.</span>
              </td>
              <td className="py-4 px-6 text-right font-mono font-bold text-sm text-[var(--subtle)]">
                {formatter.format(d.ingresosTotales)}
              </td>
              <td className="py-4 px-6 text-right font-mono font-bold text-[var(--subtle)] text-xs">
                {d.porcentaje_comision}%
              </td>
              <td className="py-4 px-6 text-right font-mono">
                <span className="bg-[var(--green-bg)] text-[var(--green2)] font-bold px-3 py-1.5 rounded-[var(--radius-sm)] border border-[#84cc16]/20 shadow-sm">
                  {formatter.format(d.cargoServicio)}
                </span>
              </td>
            </tr>
          ))}
          {datos.length > 0 && (
            <tr className="bg-[var(--surface)] border-t-2 border-[var(--border)]">
              <td className="py-4 px-6 font-black uppercase text-sm" colSpan={2} style={{ fontFamily: "var(--font-display)" }}>Totales Generales</td>
              <td className="py-4 px-6 text-right font-bold text-sm font-mono">
                {formatter.format(totalesIngresos)}
              </td>
              <td className="py-4 px-6 text-right"></td>
              <td className="py-4 px-6 text-right font-black text-[var(--green2)] text-lg font-mono tracking-tight">
                {formatter.format(totalesCargo)}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
