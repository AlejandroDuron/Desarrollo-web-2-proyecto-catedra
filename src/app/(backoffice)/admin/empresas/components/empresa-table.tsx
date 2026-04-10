const empresas = [
  { nombre: "Cafe Aurora", rubro: "Restaurante", estado: "Activa" },
  { nombre: "Libreria Central", rubro: "Retail", estado: "Pendiente" },
];

export function EmpresaTable() {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50 text-left text-slate-600">
          <tr>
            <th className="px-4 py-3 font-medium">Empresa</th>
            <th className="px-4 py-3 font-medium">Rubro</th>
            <th className="px-4 py-3 font-medium">Estado</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {empresas.map((empresa) => (
            <tr key={empresa.nombre}>
              <td className="px-4 py-3 text-slate-900">{empresa.nombre}</td>
              <td className="px-4 py-3 text-slate-600">{empresa.rubro}</td>
              <td className="px-4 py-3 text-slate-600">{empresa.estado}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
