import { OfertaForm } from "./components/oferta-form";
import { OfertaTable } from "./components/oferta-table";

export default function EmpresaOfertasPage() {
  return (
    <section className="space-y-6">
      <div>
        <h3 className="text-2xl font-semibold text-slate-900">Ofertas</h3>
        <p className="text-sm text-slate-600">
          Administracion base de ofertas por empresa.
        </p>
      </div>
      <OfertaForm />
      <OfertaTable />
    </section>
  );
}
