const registros = [
  { empresa: "Cafe Aurora", actividad: "Canjes fuera de horario", nivel: "Media" },
  { empresa: "Libreria Central", actividad: "Pico de aprobaciones", nivel: "Baja" },
];

export function SupervisionTable() {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50 text-left text-slate-600">
          <tr>
            <th className="px-4 py-3 font-medium">Empresa</th>
            <th className="px-4 py-3 font-medium">Actividad</th>
            <th className="px-4 py-3 font-medium">Riesgo</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {registros.map((registro) => (
            <tr key={registro.empresa}>
              <td className="px-4 py-3 text-slate-900">{registro.empresa}</td>
              <td className="px-4 py-3 text-slate-600">{registro.actividad}</td>
              <td className="px-4 py-3 text-slate-600">{registro.nivel}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
