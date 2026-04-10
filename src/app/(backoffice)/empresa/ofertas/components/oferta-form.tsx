import { empresaOfertaInitialValues } from "../schema";

export function OfertaForm() {
  return (
    <form className="grid gap-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <input
        className="rounded-xl border border-slate-200 px-4 py-3"
        defaultValue={empresaOfertaInitialValues.titulo}
        placeholder="Titulo de la oferta"
      />
      <textarea
        className="min-h-32 rounded-xl border border-slate-200 px-4 py-3"
        defaultValue={empresaOfertaInitialValues.descripcion}
        placeholder="Descripcion"
      />
      <div className="grid gap-4 md:grid-cols-2">
        <input
          className="rounded-xl border border-slate-200 px-4 py-3"
          defaultValue={empresaOfertaInitialValues.descuento}
          placeholder="Descuento"
        />
        <input
          className="rounded-xl border border-slate-200 px-4 py-3"
          defaultValue={empresaOfertaInitialValues.vigencia}
          placeholder="Vigencia"
        />
      </div>
      <button
        type="submit"
        className="rounded-xl bg-emerald-700 px-4 py-3 text-sm font-medium text-white"
      >
        Publicar oferta
      </button>
    </form>
  );
}
