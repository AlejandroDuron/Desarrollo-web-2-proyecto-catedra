import { createSupabaseServerClient } from "@/lib/supabase/server";
import Link from "next/link";
import EmpresaForm from "./components/empresa-form";
import PlaceholderCover from "../components/placeholder-cover";
import GlobalPagination from "../components/global-pagination";

const PER_PAGE = 10;

export default async function EmpresasPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const resolvedParams = await searchParams;
  const currentPage = Number(resolvedParams?.page) || 1;
  const from = (currentPage - 1) * PER_PAGE;
  const to = from + PER_PAGE - 1;

  const supabase = await createSupabaseServerClient();

  const [empresasRes, rubrosRes] = await Promise.all([
    supabase.from("empresas").select("*, rubros(nombre_rubro)", { count: "exact" }).order("created_at", { ascending: false }).range(from, to),
    supabase.from("rubros").select("*").order("nombre_rubro", { ascending: true })
  ]);

  const empresas = empresasRes.data;
  const totalCount = empresasRes.count || 0;
  const error = empresasRes.error || rubrosRes.error;
  const rubrosDisponibles = rubrosRes.data || [];

  if (error) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="p-6 bg-red-100 text-[#ba1a1a] rounded-[var(--radius-lg)] font-mono text-sm border border-red-200">
          Error al cargar datos del sistema: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto flex flex-col gap-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-4xl font-black mb-1" style={{ fontFamily: "var(--font-display)" }}>
            Empresas Globales
          </h1>
          <p className="text-[var(--muted)] text-sm">Gestiona el catálogo de organizaciones dentro de La Cuponera.</p>
        </div>
        <EmpresaForm rubrosDisponibles={rubrosDisponibles} />
      </div>

      {(!empresas || empresas.length === 0) ? (
        <div className="card text-center p-12 bg-white/50 border border-dashed border-[var(--border)]">
          <p className="text-xl font-bold text-[var(--muted)] mb-2" style={{ fontFamily: "var(--font-display)" }}>Sin Empresas</p>
          <p className="text-[var(--subtle)] text-sm font-mono">No hay organizaciones registradas actualmente.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {empresas.map((empresa) => (
              <Link href={`/admin/empresas/${empresa.id}`} key={empresa.id}>
                <div className="card bg-white border border-[var(--border)] rounded-[var(--radius-lg)] overflow-hidden hover:border-[var(--green)] hover:shadow-lg transition-all group cursor-pointer h-full flex flex-col">
                  <PlaceholderCover title={empresa.nombre_empresa} subtitle={empresa.codigo_empresa} />
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-white border border-[var(--border)] px-2 py-0.5 rounded text-[10px] font-mono font-bold text-[#191C1D] shadow-sm">
                        {empresa.codigo_empresa}
                      </span>
                      <span className="font-mono text-[10px] font-bold text-[var(--green2)] bg-[var(--green-bg)] px-2 py-0.5 rounded">
                        {empresa.porcentaje_comision}%
                      </span>
                    </div>
                    <p className="font-bold text-lg text-[var(--text)] group-hover:text-[var(--green2)] transition-colors mt-1" style={{ fontFamily: "var(--font-display)" }}>
                      {empresa.nombre_empresa}
                    </p>
                    <p className="text-xs text-[var(--muted)] font-bold uppercase mt-1">
                      {(empresa.rubros as any)?.nombre_rubro || "S/ Rubro"}
                    </p>
                    <div className="mt-auto pt-4 flex justify-end">
                      <span className="text-xs font-bold text-[var(--green)] border border-[var(--green)]/30 px-3 py-1.5 rounded-[var(--radius-sm)] group-hover:bg-[var(--green)] group-hover:text-white transition-all">
                        Ver Detalles &rarr;
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <GlobalPagination totalCount={totalCount} perPage={PER_PAGE} />
        </>
      )}
    </div>
  );
}
