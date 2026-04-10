import { canjeInitialValues } from "../schema";

export function CanjeForm() {
  return (
    <form className="grid gap-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <input
        className="rounded-xl border border-slate-200 px-4 py-3"
        defaultValue={canjeInitialValues.codigo}
        placeholder="Codigo de cupon"
      />
      <input
        className="rounded-xl border border-slate-200 px-4 py-3"
        defaultValue={canjeInitialValues.cliente}
        placeholder="Cliente"
      />
      <input
        className="rounded-xl border border-slate-200 px-4 py-3"
        defaultValue={canjeInitialValues.oferta}
        placeholder="Oferta"
      />
      <button
        type="submit"
        className="rounded-xl bg-amber-700 px-4 py-3 text-sm font-medium text-white"
      >
        Registrar canje
      </button>
    </form>
  );
}
