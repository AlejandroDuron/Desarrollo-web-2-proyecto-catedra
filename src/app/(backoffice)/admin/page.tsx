import { requireRole } from "@/lib/supabase/server";

const supervisionItems = [
  {
    empresa: "Cafe Aurora",
    actividad: "Canjes fuera de horario",
    nivel: "Media",
  },
  {
    empresa: "Libreria Central",
    actividad: "Pico de aprobaciones",
    nivel: "Baja",
  },
];

export default async function AdminPage() {
  await requireRole("admin_general");

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">Resumen general</h2>
        <p className="text-sm text-slate-600">
          Esta vista reemplaza la antigua pantalla de supervision.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <article className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm text-slate-500">Empresas activas</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">24</p>
        </article>
        <article className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm text-slate-500">Ofertas pendientes</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">7</p>
        </article>
        <article className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm text-slate-500">Alertas abiertas</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">3</p>
        </article>
      </div>

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
        <div className="border-b border-slate-200 px-4 py-4">
          <h3 className="text-lg font-semibold text-slate-900">Actividad a supervisar</h3>
          <p className="text-sm text-slate-600">
            Consolidado de eventos relevantes para revision administrativa.
          </p>
        </div>
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-slate-600">
            <tr>
              <th className="px-4 py-3 font-medium">Empresa</th>
              <th className="px-4 py-3 font-medium">Actividad</th>
              <th className="px-4 py-3 font-medium">Riesgo</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {supervisionItems.map((item) => (
              <tr key={`${item.empresa}-${item.actividad}`}>
                <td className="px-4 py-3 text-slate-900">{item.empresa}</td>
                <td className="px-4 py-3 text-slate-600">{item.actividad}</td>
                <td className="px-4 py-3 text-slate-600">{item.nivel}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
