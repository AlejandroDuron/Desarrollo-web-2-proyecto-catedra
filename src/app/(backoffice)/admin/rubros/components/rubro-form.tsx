import { rubroInitialValues } from "../schema";

export function RubroForm() {
  return (
    <form className="grid gap-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <input
        className="rounded-xl border border-slate-200 px-4 py-3"
        defaultValue={rubroInitialValues.nombre}
        placeholder="Nombre del rubro"
      />
      <textarea
        className="min-h-32 rounded-xl border border-slate-200 px-4 py-3"
        defaultValue={rubroInitialValues.descripcion}
        placeholder="Descripcion"
      />
      <button
        type="submit"
        className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white"
      >
        Guardar rubro
      </button>
    </form>
  );
}
