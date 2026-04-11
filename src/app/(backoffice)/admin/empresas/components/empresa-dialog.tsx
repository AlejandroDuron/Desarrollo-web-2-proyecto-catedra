import EmpresaForm from "./empresa-form";

export function EmpresaDialog() {
  return (
    <section className="space-y-4 rounded-2xl border border-dashed border-slate-300 p-4">
      <div>
        <h3 className="text-lg font-semibold text-slate-900">Nueva empresa</h3>
        <p className="text-sm text-slate-600">
          Placeholder para dialogo o drawer de creacion.
        </p>
      </div>
      <EmpresaForm rubrosDisponibles={[]} />
    </section>
  );
}
