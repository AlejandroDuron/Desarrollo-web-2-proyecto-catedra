import { AprobacionDialog } from "./components/aprobacion-dialog";
import { OfertaTable } from "./components/oferta-table";

export default function AdminOfertasPage() {
  return (
    <section className="space-y-6">
      <div>
        <h3 className="text-2xl font-semibold text-slate-900">Ofertas</h3>
        <p className="text-sm text-slate-600">
          Revision administrativa de ofertas publicadas por empresas.
        </p>
      </div>
      <AprobacionDialog />
      <OfertaTable />
    </section>
  );
}
