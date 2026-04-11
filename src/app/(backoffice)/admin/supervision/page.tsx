import { createSupabaseServerClient } from "@/lib/supabase/server";
import SupervisionTable from "./components/supervision-table";
import GlobalPagination from "../components/global-pagination";

const PER_PAGE = 10;
const formatter = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 });

export default async function SupervisionPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const resolvedParams = await searchParams;
  const currentPage = Number(resolvedParams?.page) || 1;
  const from = (currentPage - 1) * PER_PAGE;
  const to = from + PER_PAGE - 1;

  const supabase = await createSupabaseServerClient();

  // Fetch all for totals, and paginated slice for table
  const { data: allEmpresas, error: allErr } = await supabase
    .from("empresas")
    .select("*, ofertas(*, cupones(*))");

  const { data: pagedEmpresas, error: pageErr, count: totalCount } = await supabase
    .from("empresas")
    .select("*, ofertas(*, cupones(*))", { count: "exact" })
    .order("nombre_empresa", { ascending: true })
    .range(from, to);

  const error = allErr || pageErr;
  if (error) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="p-6 bg-red-100 text-[#ba1a1a] rounded-[var(--radius-lg)] font-mono text-sm border border-red-200">
          Error extrayendo datos financieros: {error.message}
        </div>
      </div>
    );
  }

  // Global totals from all data
  let globalCupones = 0;
  let globalIngresos = 0;
  let globalComisiones = 0;
  (allEmpresas || []).forEach((emp: any) => {
    if (emp.ofertas) {
      emp.ofertas.forEach((oferta: any) => {
        const sold = oferta.cupones ? oferta.cupones.length : 0;
        globalCupones += sold;
        const precio = Number(oferta.precio_oferta) || 0;
        const ingreso = sold * precio;
        globalIngresos += ingreso;
        globalComisiones += ingreso * (Number(emp.porcentaje_comision || 0) / 100);
      });
    }
  });

  // Per-empresa data for table (paginated)
  const datosFinancieros = (pagedEmpresas || []).map((emp: any) => {
    let cuponesVendidos = 0;
    let ingresosTotales = 0;

    if (emp.ofertas) {
      emp.ofertas.forEach((oferta: any) => {
        const sold = oferta.cupones ? oferta.cupones.length : 0;
        cuponesVendidos += sold;
        ingresosTotales += sold * (Number(oferta.precio_oferta) || 0);
      });
    }

    return {
      id: emp.id,
      nombre_empresa: emp.nombre_empresa,
      codigo_empresa: emp.codigo_empresa,
      porcentaje_comision: emp.porcentaje_comision,
      cuponesVendidos,
      ingresosTotales,
      cargoServicio: ingresosTotales * (Number(emp.porcentaje_comision || 0) / 100),
    };
  });

  return (
    <div className="p-8 max-w-7xl mx-auto flex flex-col gap-6 w-full">
      <div>
        <h1 className="text-4xl font-black mb-1" style={{ fontFamily: "var(--font-display)" }}>
          Supervisión Financiera
        </h1>
        <p className="text-[var(--muted)] text-sm">Resumen de ventas brutas e inteligencia de recaudación por comisiones activas.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card bg-white border border-[var(--green)]/30 p-6 rounded-[var(--radius-lg)] relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-[var(--green-bg)] rounded-full opacity-50 group-hover:scale-110 transition-transform"></div>
          <p className="text-sm font-bold text-[var(--muted)] mb-2 relative">Comisiones Totales</p>
          <p className="text-3xl font-black text-[var(--green2)] font-mono tracking-tighter relative">{formatter.format(globalComisiones)}</p>
        </div>
        <div className="card bg-white border border-[var(--border)] p-6 rounded-[var(--radius-lg)]">
          <p className="text-sm font-bold text-[var(--muted)] mb-2">Ingresos Brutos</p>
          <p className="text-3xl font-black text-[var(--text)] font-mono tracking-tighter">{formatter.format(globalIngresos)}</p>
        </div>
        <div className="card bg-[#191C1D] border border-[var(--border)] p-6 rounded-[var(--radius-lg)] text-white">
          <p className="text-sm font-bold text-slate-400 mb-2">Volumen de Ventas</p>
          <p className="text-3xl font-black text-white font-mono tracking-tighter">{globalCupones} cupones</p>
        </div>
      </div>

      {/* Detailed Table */}
      {!datosFinancieros.length ? (
        <div className="card text-center p-12 bg-white/50 border border-[var(--border)] border-dashed">
          <p className="text-[var(--muted)]">No hay empresas modeladas en la contabilidad.</p>
        </div>
      ) : (
        <>
          <SupervisionTable datos={datosFinancieros} />
          <GlobalPagination totalCount={totalCount || 0} perPage={PER_PAGE} />
        </>
      )}
    </div>
  );
}
