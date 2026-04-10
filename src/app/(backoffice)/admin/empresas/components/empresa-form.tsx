import { empresaInitialValues } from "../schema";

export function EmpresaForm() {
  return (
    <form className="grid gap-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 md:grid-cols-2">
      <input
        className="rounded-xl border border-slate-200 px-4 py-3"
        defaultValue={empresaInitialValues.nombre}
        placeholder="Nombre de empresa"
      />
      <input
        className="rounded-xl border border-slate-200 px-4 py-3"
        defaultValue={empresaInitialValues.rubro}
        placeholder="Rubro"
      />
      <input
        className="rounded-xl border border-slate-200 px-4 py-3"
        defaultValue={empresaInitialValues.correo}
        placeholder="Correo"
      />
      <input
        className="rounded-xl border border-slate-200 px-4 py-3"
        defaultValue={empresaInitialValues.telefono}
        placeholder="Telefono"
      />
      <button
        type="submit"
        className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white md:col-span-2"
      >
        Guardar empresa
      </button>
    </form>
  );
}
