import { EmpleadoForm } from "./components/empleado-form";
import { EmpleadoTable } from "./components/empleado-table";

export default function EmpleadosPage() {
  return (
    <section className="space-y-6">
      <div>
        <h3 className="text-2xl font-semibold text-slate-900">Empleados</h3>
        <p className="text-sm text-slate-600">
          Administracion base de empleados de la empresa.
        </p>
      </div>
      <EmpleadoForm />
      <EmpleadoTable />
    </section>
  );
}
