import { createSupabaseServerClient } from "@/lib/supabase/server";
import Link from "next/link";
import OfertasFiltros from "./components/ofertas-filtros";
import GlobalPagination from "../components/global-pagination";

const PER_PAGE = 10;

function getBadgeInfo(oferta: any) {
  const currentDate = new Date("2026-04-11T00:00:00").getTime();
  const inicio = new Date(oferta.fecha_inicio).getTime();
  const fin = new Date(oferta.fecha_fin).getTime();

  if (fin < currentDate) return { label: "PASADA", color: "bg-slate-100 text-slate-500 border-slate-200" };
  if (oferta.estado === "Oferta rechazada") return { label: "RECHAZADA", color: "bg-red-100 text-[#ba1a1a] border-red-200" };
  if (oferta.estado === "Oferta descartada") return { label: "DESCARTADA", color: "bg-red-50 text-[#ba1a1a] border-red-200" };
  if (oferta.estado === "En espera de aprobación") return { label: "EN ESPERA", color: "bg-orange-100 text-orange-700 border-orange-200" };
  if (oferta.estado === "Oferta aprobada") {
    if (inicio > currentDate) return { label: "FUTURA", color: "bg-blue-100 text-blue-700 border-blue-200" };
    return { label: "ACTIVA", color: "bg-[var(--green-bg)] text-[var(--green2)] border-[var(--green)]/20" };
  }
  return { label: "INDEFINIDA", color: "bg-slate-100 text-slate-500 border-slate-200" };
}

export default async function OfertasPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; status?: string; page?: string }>;
}) {
  const resolvedParams = await searchParams;
  const query = resolvedParams?.query || "";
  const filter = resolvedParams?.status || "espera";
  const currentPage = Number(resolvedParams?.page) || 1;
  const from = (currentPage - 1) * PER_PAGE;
  const to = from + PER_PAGE - 1;
  const todayStr = "2026-04-11";

  const supabase = await createSupabaseServerClient();

  let dbQuery = supabase
    .from("ofertas")
    .select("*, empresas(nombre_empresa)", { count: "exact" })
    .order("created_at", { ascending: false });

  switch (filter) {
    case "espera":
      dbQuery = dbQuery.eq("estado", "En espera de aprobación").gte("fecha_fin", todayStr);
      break;
    case "futuras":
      dbQuery = dbQuery.eq("estado", "Oferta aprobada").gt("fecha_inicio", todayStr);
      break;
    case "activas":
      dbQuery = dbQuery.eq("estado", "Oferta aprobada").lte("fecha_inicio", todayStr).gte("fecha_fin", todayStr);
      break;
    case "pasadas":
      dbQuery = dbQuery.lt("fecha_fin", todayStr);
      break;
    case "rechazadas":
      dbQuery = dbQuery.eq("estado", "Oferta rechazada").gte("fecha_fin", todayStr);
      break;
    case "descartadas":
      dbQuery = dbQuery.eq("estado", "Oferta descartada").gte("fecha_fin", todayStr);
      break;
  }

  dbQuery = dbQuery.range(from, to);
  const { data: ofertas, error, count: totalCount } = await dbQuery;

  if (error) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="p-6 bg-red-100 text-[#ba1a1a] rounded-[var(--radius-lg)] font-mono text-sm border border-red-200">
          Error al cargar bandeja de entrada: {error.message}
        </div>
      </div>
    );
  }

  let ofertasFiltered = ofertas || [];
  if (query) {
    const q = query.toLowerCase();
    ofertasFiltered = ofertasFiltered.filter((o: any) =>
      o.titulo.toLowerCase().includes(q) ||
      o.empresas?.nombre_empresa.toLowerCase().includes(q)
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto flex flex-col gap-6 w-full">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h1 className="text-4xl font-black mb-1" style={{ fontFamily: "var(--font-display)" }}>
            Promociones y Ofertas
          </h1>
          <p className="text-[var(--muted)] text-sm">Validación técnica e historial de ofertas vinculadas al backoffice.</p>
        </div>
      </div>

      <OfertasFiltros />

      {ofertasFiltered.length === 0 ? (
        <div className="card text-center p-12 bg-white/50 border border-dashed border-[var(--border)]">
          <p className="text-xl font-bold text-[var(--muted)] mb-2" style={{ fontFamily: "var(--font-display)" }}>
            {query ? "Sin Resultados" : "Bandeja Vacía"}
          </p>
          <p className="text-[var(--subtle)] text-sm font-mono">
            {query
              ? `No se encontraron ofertas coincidiendo con "${query}".`
              : filter === "futuras" ? "No hay ofertas programadas para el futuro."
              : filter === "activas" ? "No hay promociones en circulación actualmente."
              : filter === "pasadas" ? "No hay ofertas caducadas en el archivo."
              : filter === "rechazadas" ? "No hay historial de rechazos."
              : filter === "descartadas" ? "No hay ofertas descartadas."
              : "No hay ofertas pendientes de valoración."}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {ofertasFiltered.map((oferta: any) => {
              const porcentaje = Math.round((1 - oferta.precio_oferta / oferta.precio_regular) * 100);
              const badge = getBadgeInfo(oferta);

              return (
                <Link href={`/admin/ofertas/${oferta.id}`} key={oferta.id}>
                  <div className="card bg-white border border-[var(--border)] rounded-[var(--radius-lg)] overflow-hidden hover:border-[var(--green)] hover:shadow-lg transition-all group cursor-pointer h-full flex flex-col">
                    {/* Cover */}
                    {oferta.image_url ? (
                      <div className="aspect-video relative overflow-hidden">
                        <img src={oferta.image_url} alt={oferta.titulo} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute top-2 left-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${badge.color}`}>{badge.label}</span>
                        </div>
                        <div className="absolute top-2 right-2">
                          <span className="text-xs bg-[var(--green-bg)] text-[var(--green2)] px-2 py-0.5 rounded font-bold font-mono border border-[#84cc16]/20">
                            -{porcentaje}%
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="aspect-video bg-gradient-to-br from-[#191C1D] via-[#3f4749] to-[var(--green)] flex items-center justify-center relative">
                        <span className="text-white/80 text-xs font-bold uppercase tracking-widest">Sin Imagen</span>
                        <div className="absolute top-2 left-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${badge.color}`}>{badge.label}</span>
                        </div>
                        <div className="absolute top-2 right-2">
                          <span className="text-xs bg-[var(--green-bg)] text-[var(--green2)] px-2 py-0.5 rounded font-bold font-mono border border-[#84cc16]/20">
                            -{porcentaje}%
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="p-5 flex flex-col flex-1">
                      <p className="text-xs text-[var(--muted)] font-bold uppercase mb-1">{oferta.empresas?.nombre_empresa}</p>
                      <p className="font-bold text-sm text-[var(--text)] group-hover:text-[var(--green2)] transition-colors line-clamp-2" style={{ fontFamily: "var(--font-display)" }}>
                        {oferta.titulo}
                      </p>
                      <div className="flex items-baseline gap-2 mt-2">
                        <span className="font-mono text-sm font-bold text-[var(--text)]">${Number(oferta.precio_oferta).toFixed(2)}</span>
                        <span className="font-mono text-xs text-[var(--muted)] line-through">${Number(oferta.precio_regular).toFixed(2)}</span>
                      </div>
                      <p className="text-[10px] text-[var(--subtle)] font-mono mt-2">
                        {new Date(oferta.fecha_inicio).toLocaleDateString()} — {new Date(oferta.fecha_fin).toLocaleDateString()}
                      </p>
                      <div className="mt-auto pt-4 flex justify-end">
                        <span className="text-xs font-bold text-[var(--green)] border border-[var(--green)]/30 px-3 py-1.5 rounded-[var(--radius-sm)] group-hover:bg-[var(--green)] group-hover:text-white transition-all">
                          Ver Detalles &rarr;
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
          <GlobalPagination totalCount={totalCount || 0} perPage={PER_PAGE} />
        </>
      )}
    </div>
  );
}
