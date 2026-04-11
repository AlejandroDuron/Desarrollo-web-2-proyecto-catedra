import { createSupabaseServerClient, requireRole } from "@/lib/supabase/server";
import StatsGrid from "./components/stats-grid";
import CuponesChart from "./components/cupones-chart";
import QuickActions from "./components/quick-actions";

export default async function AdminDashboardPage() {
  await requireRole("admin_general");
  const supabase = await createSupabaseServerClient();

  // Data Fetching Asíncrono Paralelizado
  const [
    { count: countEmpresas },
    { count: countEspera, data: ofertasEspera },
    { data: metricasFinancieras },
    { data: cuponesEstados }
  ] = await Promise.all([
    supabase.from("empresas").select("*", { count: "exact", head: true }),
    supabase.from("ofertas").select("id, titulo, created_at, empresas(nombre_empresa)", { count: "exact" }).eq("estado", "En espera de aprobación").order("created_at", { ascending: false }).limit(3),
    supabase.from("empresas").select("porcentaje_comision, ofertas(precio_oferta, cupones(*))"),
    supabase.from("cupones").select("estado_cupon, ofertas(fecha_limite_uso)")
  ]);

  // Transformación Financiera Centralizada
  let ingresosComisiones = 0;
  let cuponesTotales = 0;

  if (metricasFinancieras) {
    metricasFinancieras.forEach((emp: any) => {
      let ingresosEmpresa = 0;
      if (emp.ofertas) {
        emp.ofertas.forEach((oferta: any) => {
          const countVendidos = oferta.cupones ? oferta.cupones.length : 0;
          cuponesTotales += countVendidos;
          ingresosEmpresa += countVendidos * (Number(oferta.precio_oferta) || 0);
        });
      }
      const feeCalculado = ingresosEmpresa * (Number(emp.porcentaje_comision || 0) / 100);
      ingresosComisiones += feeCalculado;
    });
  }

  // Empaquetado final de métricas
  const dashboardMetrics = {
    empresas: countEmpresas || 0,
    espera: countEspera || 0,
    cupones: cuponesTotales,
    comisiones: ingresosComisiones
  };

  return (
    <div className="p-8 max-w-7xl mx-auto flex flex-col gap-6 w-full animate-in fade-in duration-500">

      <div className="flex flex-col gap-1 mb-2">
        <h1 className="text-4xl font-black text-[var(--text)]" style={{ fontFamily: "var(--font-display)" }}>
          Bienvenido, Administrador General
        </h1>
        <p className="text-[var(--subtle)] text-sm font-mono bg-yellow-100/50 w-max px-3 py-1 rounded inline-block mt-1 border border-yellow-200 text-yellow-900 shadow-sm">
          Tienes <b className="font-bold">{dashboardMetrics.espera}</b> ofertas por revisar hoy.
        </p>
      </div>

      <StatsGrid metrics={dashboardMetrics} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-2">
        <div className="lg:col-span-2">
          <CuponesChart datos={cuponesEstados || []} />
        </div>
        <div className="">
          <QuickActions ofertas={ofertasEspera || []} />
        </div>
      </div>

    </div>
  );
}
