import { SupervisionTable } from "./components/supervision-table";

export default function SupervisionPage() {
  return (
    <section className="space-y-6">
      <div>
        <h3 className="text-2xl font-semibold text-slate-900">Supervision</h3>
        <p className="text-sm text-slate-600">
          Vista base para monitoreo administrativo y alertas.
        </p>
      </div>
      <SupervisionTable />
    </section>
  );
}
