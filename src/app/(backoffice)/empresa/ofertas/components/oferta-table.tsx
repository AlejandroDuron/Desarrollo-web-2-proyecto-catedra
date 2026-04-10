const ofertas = [
  { titulo: "Combo ejecutivo", estado: "Activa", vigencia: "Abril 2026" },
  { titulo: "Descuento estudiantil", estado: "Borrador", vigencia: "Mayo 2026" },
];

export function OfertaTable() {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50 text-left text-slate-600">
          <tr>
            <th className="px-4 py-3 font-medium">Oferta</th>
            <th className="px-4 py-3 font-medium">Estado</th>
            <th className="px-4 py-3 font-medium">Vigencia</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {ofertas.map((oferta) => (
            <tr key={oferta.titulo}>
              <td className="px-4 py-3 text-slate-900">{oferta.titulo}</td>
              <td className="px-4 py-3 text-slate-600">{oferta.estado}</td>
              <td className="px-4 py-3 text-slate-600">{oferta.vigencia}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
