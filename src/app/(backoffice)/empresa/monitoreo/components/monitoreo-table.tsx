const monitoreo = [
  { indicador: "Canjes de hoy", valor: "28", estado: "Normal" },
  { indicador: "Ofertas activas", valor: "6", estado: "Atencion" },
];

export function MonitoreoTable() {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50 text-left text-slate-600">
          <tr>
            <th className="px-4 py-3 font-medium">Indicador</th>
            <th className="px-4 py-3 font-medium">Valor</th>
            <th className="px-4 py-3 font-medium">Estado</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {monitoreo.map((item) => (
            <tr key={item.indicador}>
              <td className="px-4 py-3 text-slate-900">{item.indicador}</td>
              <td className="px-4 py-3 text-slate-600">{item.valor}</td>
              <td className="px-4 py-3 text-slate-600">{item.estado}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
