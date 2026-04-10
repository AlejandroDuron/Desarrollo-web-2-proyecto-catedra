import { empleadoInitialValues } from "../schema";

export function EmpleadoForm() {
  return (
    <form className="grid gap-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 md:grid-cols-2">
      <input
        className="rounded-xl border border-slate-200 px-4 py-3"
        defaultValue={empleadoInitialValues.nombre}
        placeholder="Nombre del empleado"
      />
      <input
        className="rounded-xl border border-slate-200 px-4 py-3"
        defaultValue={empleadoInitialValues.correo}
        placeholder="Correo"
      />
      <input
        className="rounded-xl border border-slate-200 px-4 py-3 md:col-span-2"
        defaultValue={empleadoInitialValues.sucursal}
        placeholder="Sucursal"
      />
      <button
        type="submit"
        className="rounded-xl bg-emerald-700 px-4 py-3 text-sm font-medium text-white md:col-span-2"
      >
        Guardar empleado
      </button>
    </form>
  );
}
