import { createSupabaseServerClient } from "@/lib/supabase/server";
import ClientesFiltros from "./components/clientes-filtros";
import ClienteHistorial from "./components/cliente-historial";
import GlobalPagination from "../components/global-pagination";

const PER_PAGE = 10;

export default async function ClientesPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; page?: string }>;
}) {
  const resolvedParams = await searchParams;
  const query = resolvedParams?.query || "";
  const currentPage = Number(resolvedParams?.page) || 1;
  const from = (currentPage - 1) * PER_PAGE;
  const to = from + PER_PAGE - 1;

  const supabase = await createSupabaseServerClient();

  let dbQuery = supabase
    .from("clientes")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false });

  if (query) {
    dbQuery = dbQuery.or(`nombres.ilike.%${query}%,apellidos.ilike.%${query}%,dui.ilike.%${query}%`);
  }

  dbQuery = dbQuery.range(from, to);
  const { data: clientes, error, count: totalCount } = await dbQuery;

  if (error) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="p-6 bg-red-100 text-[#ba1a1a] rounded-[var(--radius-lg)] font-mono text-sm border border-red-200">
          Error al cargar base de clientes: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto flex flex-col gap-6 w-full">
      <div className="flex justify-between items-end mb-2">
        <div>
          <h1 className="text-4xl font-black mb-1" style={{ fontFamily: "var(--font-display)" }}>
            Control de Clientes
          </h1>
          <p className="text-[var(--muted)] text-sm">Base general de consumidores y auditoría interna de historiales de compra.</p>
        </div>
      </div>

      <ClientesFiltros />

      <div className="card bg-[var(--bg)] p-1">
        {(!clientes || clientes.length === 0) ? (
          <div className="p-12 text-center text-[var(--muted)]">
            <p className="font-bold text-lg mb-1" style={{ fontFamily: "var(--font-display)" }}>Sin coincidencias</p>
            <p className="text-[var(--subtle)] text-sm font-mono">{query ? "No hay ningún registro bajo ese nombre, apellido o DUI." : "No se encontró a nadie en la base de datos."}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--surface)] text-[var(--subtle)]">
                  <th className="py-4 px-6 text-xs uppercase tracking-wider font-bold">Consumidor</th>
                  <th className="py-4 px-6 text-xs uppercase tracking-wider font-bold">Contacto</th>
                  <th className="py-4 px-6 text-xs uppercase tracking-wider font-bold">Documento (DUI)</th>
                  <th className="py-4 px-6 text-xs uppercase tracking-wider font-bold text-right">Auditoría</th>
                </tr>
              </thead>
              <tbody>
                {clientes.map((cliente) => (
                  <tr key={cliente.id} className="border-b border-[var(--surface2)] hover:bg-[var(--surface3)] transition-colors">
                    <td className="py-4 px-6">
                      <p className="font-bold text-[var(--text)] capitalize" style={{ fontFamily: "var(--font-display)" }}>
                        {cliente.nombres} {cliente.apellidos || ""}
                      </p>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-sm font-mono text-[var(--muted)]">{cliente.telefono || "S/N de Teléfono"}</p>
                    </td>
                    <td className="py-4 px-6 font-mono font-bold text-sm text-[var(--text)]">
                      {cliente.dui || "S/DUI"}
                    </td>
                    <td className="py-4 px-6 text-right">
                       <ClienteHistorial cliente={cliente} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <GlobalPagination totalCount={totalCount || 0} perPage={PER_PAGE} />
    </div>
  );
}
