import { EmpresaDialog } from "./components/empresa-dialog";
import { EmpresaTable } from "./components/empresa-table";

export default function EmpresasPage() {
  return (
    <section className="space-y-6">
      <div>
        <h3 className="text-2xl font-semibold text-slate-900">Empresas</h3>
        <p className="text-sm text-slate-600">
          Gestion base de empresas registradas.
        </p>
      </div>
      <EmpresaDialog />
      <EmpresaTable />
    </section>
  );
}
