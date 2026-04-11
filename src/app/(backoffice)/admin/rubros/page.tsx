import { createSupabaseServerClient } from "@/lib/supabase/server";
import Link from "next/link";
import RubroForm from "./components/rubro-form";
import PlaceholderCover from "../components/placeholder-cover";
import GlobalPagination from "../components/global-pagination";

const PER_PAGE = 10;

export default async function RubrosPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const resolvedParams = await searchParams;
  const currentPage = Number(resolvedParams?.page) || 1;
  const from = (currentPage - 1) * PER_PAGE;
  const to = from + PER_PAGE - 1;

  const supabase = await createSupabaseServerClient();
  const { data: rubros, error, count } = await supabase
    .from("rubros")
    .select("*", { count: "exact" })
    .order("id", { ascending: true })
    .range(from, to);

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
    <div className="p-8 max-w-7xl mx-auto flex flex-col gap-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-4xl font-black mb-1" style={{ fontFamily: "var(--font-display)" }}>
            Rubros
          </h1>
          <p className="text-[var(--muted)] text-sm">Gestiona las categorías de empresas registradas.</p>
        </div>
        <RubroForm />
      </div>

      {(!rubros || rubros.length === 0) ? (
        <div className="card text-center p-12 bg-white/50 border border-dashed border-[var(--border)]">
          <p className="text-xl font-bold text-[var(--muted)] mb-2" style={{ fontFamily: "var(--font-display)" }}>Sin Rubros</p>
          <p className="text-[var(--subtle)] text-sm font-mono">No hay categorías registradas actualmente.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {rubros.map((rubro) => (
              <Link href={`/admin/rubros/${rubro.id}`} key={rubro.id}>
                <div className="card bg-white border border-[var(--border)] rounded-[var(--radius-lg)] overflow-hidden hover:border-[var(--green)] hover:shadow-lg transition-all group cursor-pointer">
                  <PlaceholderCover title={rubro.nombre_rubro} subtitle={`ID #${rubro.id}`} />
                  <div className="p-5">
                    <p className="font-bold text-lg text-[var(--text)] group-hover:text-[var(--green2)] transition-colors" style={{ fontFamily: "var(--font-display)" }}>
                      {rubro.nombre_rubro}
                    </p>
                    <p className="text-xs text-[var(--muted)] font-mono mt-1">Categoría #{rubro.id}</p>
                    <div className="mt-4 flex justify-end">
                      <span className="text-xs font-bold text-[var(--green)] border border-[var(--green)]/30 px-3 py-1.5 rounded-[var(--radius-sm)] group-hover:bg-[var(--green)] group-hover:text-white transition-all">
                        Ver Detalles &rarr;
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <GlobalPagination totalCount={count || 0} perPage={PER_PAGE} />
        </>
      )}
    </div>
  );
}
