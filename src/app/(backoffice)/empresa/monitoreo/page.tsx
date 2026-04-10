import { MonitoreoTable } from "./components/monitoreo-table";

export default function MonitoreoPage() {
  return (
    <section className="space-y-6">
      <div>
        <h3 className="text-2xl font-semibold text-slate-900">Monitoreo</h3>
        <p className="text-sm text-slate-600">
          Vista inicial de metricas y alertas para empresas.
        </p>
      </div>
      <MonitoreoTable />
    </section>
  );
}
