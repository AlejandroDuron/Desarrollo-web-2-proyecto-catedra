import { createSupabaseServerClient } from "@/lib/supabase/server";
import RubroForm from "./components/rubro-form";
import DeleteRubroButton from "./components/delete-button";

export default async function RubrosPage() {
  const supabase = await createSupabaseServerClient();
  const { data: rubros, error } = await supabase.from("rubros").select("*").order("id", { ascending: true });

  if (error) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="p-6 bg-[#FFDAD6] text-[#ba1a1a] rounded-[var(--radius-lg)] font-mono text-sm">
          Error al cargar rubros: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto flex flex-col gap-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-4xl font-black mb-1" style={{ fontFamily: "var(--font-display)" }}>
            Rubros
          </h1>
          <p className="text-[var(--muted)] text-sm">Gestiona las categorías de empresas registradas.</p>
        </div>
        <RubroForm />
      </div>

      <div className="card bg-[var(--bg)] p-1">
        {(!rubros || rubros.length === 0) ? (
          <div className="p-8 text-center text-[var(--muted)]">
            <p>No hay rubros registrados actualmente.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--surface)] text-[var(--subtle)]">
                  <th className="py-4 px-6 text-xs uppercase tracking-wider font-bold">ID</th>
                  <th className="py-4 px-6 text-xs uppercase tracking-wider font-bold">Nombre del Rubro</th>
                  <th className="py-4 px-6 text-xs uppercase tracking-wider font-bold text-right">Opciones</th>
                </tr>
              </thead>
              <tbody>
                {rubros.map((rubro) => (
                  <tr key={rubro.id} className="border-b border-[var(--surface2)] hover:bg-[var(--surface3)] transition-colors group">
                    <td className="py-4 px-6 font-mono text-sm text-[var(--muted)]">#{rubro.id}</td>
                    <td className="py-4 px-6 font-medium text-[var(--text)] text-lg">{rubro.nombre_rubro}</td>
                    <td className="py-4 px-6 text-right flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <RubroForm rubro={rubro} />
                      <DeleteRubroButton id={rubro.id} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
