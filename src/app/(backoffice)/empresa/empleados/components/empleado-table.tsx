const empleados = [
  { nombre: "Ana Lopez", correo: "ana@cafeaurora.com", sucursal: "Centro" },
  { nombre: "Luis Mena", correo: "luis@cafeaurora.com", sucursal: "Escalon" },
];

export function EmpleadoTable() {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50 text-left text-slate-600">
          <tr>
            <th className="px-4 py-3 font-medium">Empleado</th>
            <th className="px-4 py-3 font-medium">Correo</th>
            <th className="px-4 py-3 font-medium">Sucursal</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {empleados.map((empleado) => (
            <tr key={empleado.correo}>
              <td className="px-4 py-3 text-slate-900">{empleado.nombre}</td>
              <td className="px-4 py-3 text-slate-600">{empleado.correo}</td>
              <td className="px-4 py-3 text-slate-600">{empleado.sucursal}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
