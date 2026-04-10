const clientes = [
  { nombre: "Maria Gomez", canjes: 12, ultimaActividad: "2026-04-08" },
  { nombre: "Carlos Perez", canjes: 4, ultimaActividad: "2026-04-09" },
];

export function ClienteHistorial() {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50 text-left text-slate-600">
          <tr>
            <th className="px-4 py-3 font-medium">Cliente</th>
            <th className="px-4 py-3 font-medium">Canjes</th>
            <th className="px-4 py-3 font-medium">Ultima actividad</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {clientes.map((cliente) => (
            <tr key={cliente.nombre}>
              <td className="px-4 py-3 text-slate-900">{cliente.nombre}</td>
              <td className="px-4 py-3 text-slate-600">{cliente.canjes}</td>
              <td className="px-4 py-3 text-slate-600">{cliente.ultimaActividad}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
