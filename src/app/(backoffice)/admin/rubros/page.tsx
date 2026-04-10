import { RubroForm } from "./components/rubro-form";

export default function RubrosPage() {
  return (
    <section className="space-y-6">
      <div>
        <h3 className="text-2xl font-semibold text-slate-900">Rubros</h3>
        <p className="text-sm text-slate-600">Catalogo base de rubros para empresas.</p>
      </div>
      <RubroForm />
    </section>
  );
}
