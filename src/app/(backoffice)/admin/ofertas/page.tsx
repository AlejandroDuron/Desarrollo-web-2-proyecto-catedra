import { createSupabaseServerClient } from "@/lib/supabase/server";
import OfertaTable from "./components/oferta-table";
import OfertasFiltros from "./components/ofertas-filtros";
import type { Database } from "@/types/database";

export default async function OfertasPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; status?: string }>;
}) {
  const resolvedParams = await searchParams;
  const query = resolvedParams?.query || "";
  const filter = resolvedParams?.status || "espera";
  const isReadOnly = filter !== "espera";
  const todayStr = "2026-04-11";

  const supabase = await createSupabaseServerClient();
  
  let dbQuery = supabase
    .from("ofertas")
    .select("*, empresas(nombre_empresa)")
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

  const { data: ofertas, error } = await dbQuery;

  if (error) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="p-6 bg-red-100 text-[#ba1a1a] rounded-[var(--radius-lg)] font-mono text-sm border border-red-200">
          Error al cargar bandeja de entrada: {error.message}
        </div>
      </div>
    );
  }

  // Búsqueda cruzada para titulo y nombre de empresa
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

      {(!ofertasFiltered || ofertasFiltered.length === 0) ? (
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
              : `No hay ofertas pendientes de valoración.`}
          </p>
        </div>
      ) : (
        <OfertaTable ofertas={ofertasFiltered} isReadOnly={isReadOnly} />
      )}
    </div>
  );
}
