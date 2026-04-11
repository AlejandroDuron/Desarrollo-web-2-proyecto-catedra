const monitoreoItems = [
  { indicador: "Canjes de hoy", valor: "28", estado: "Normal" },
  { indicador: "Ofertas activas", valor: "6", estado: "Atencion" },
  { indicador: "Empleados conectados", valor: "9", estado: "Normal" },
];

export default function EmpresaPage() {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">Resumen de empresa</h2>
        <p className="text-sm text-slate-600">
          Esta vista reemplaza la antigua pantalla de monitoreo.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <article className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm text-slate-500">Ofertas activas</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">6</p>
        </article>
        <article className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm text-slate-500">Canjes registrados hoy</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">28</p>
        </article>
        <article className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm text-slate-500">Empleados activos</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">9</p>
        </article>
      </div>

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
        <div className="border-b border-slate-200 px-4 py-4">
          <h3 className="text-lg font-semibold text-slate-900">Monitoreo operativo</h3>
          <p className="text-sm text-slate-600">
            Indicadores principales del negocio visibles desde la raiz de empresa.
          </p>
        </div>
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-slate-600">
            <tr>
              <th className="px-4 py-3 font-medium">Indicador</th>
              <th className="px-4 py-3 font-medium">Valor</th>
              <th className="px-4 py-3 font-medium">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {monitoreoItems.map((item) => (
              <tr key={item.indicador}>
                <td className="px-4 py-3 text-slate-900">{item.indicador}</td>
                <td className="px-4 py-3 text-slate-600">{item.valor}</td>
                <td className="px-4 py-3 text-slate-600">{item.estado}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
