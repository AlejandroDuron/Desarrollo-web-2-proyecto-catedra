import { ClienteHistorial } from "./components/cliente-historial";

export default function ClientesPage() {
  return (
    <section className="space-y-6">
      <div>
        <h3 className="text-2xl font-semibold text-slate-900">Clientes</h3>
        <p className="text-sm text-slate-600">
          Historial base de actividad de clientes en el sistema.
        </p>
      </div>
      <ClienteHistorial />
    </section>
  );
}
