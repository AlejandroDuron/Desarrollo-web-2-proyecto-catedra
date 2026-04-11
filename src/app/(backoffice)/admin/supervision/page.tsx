import { createSupabaseServerClient } from "@/lib/supabase/server";
import SupervisionTable from "./components/supervision-table";

export default async function SupervisionPage() {
  const supabase = await createSupabaseServerClient();

  const { data: rawEmpresas, error } = await supabase
    .from("empresas")
    .select("*, ofertas(*, cupones(*))")
    .order("nombre_empresa", { ascending: true });

  if (error) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="p-6 bg-red-100 text-[#ba1a1a] rounded-[var(--radius-lg)] font-mono text-sm border border-red-200">
          Error extrayendo datos financieros: {error.message}
        </div>
      </div>
    );
  }

  // Lógica de Renderizado Financiero en el V8
  const datosFinancieros = (rawEmpresas || []).map((emp: any) => {
    let cuponesVendidos = 0;
    let ingresosTotales = 0;

    if (emp.ofertas) {
      emp.ofertas.forEach((oferta: any) => {
        console.log("=== DEBUG Oferta Estructura ===", { titulo: oferta.titulo, precio_oferta: oferta.precio_oferta, cuponesTotales: oferta.cupones?.length });

        const sold = oferta.cupones ? oferta.cupones.length : 0;
        cuponesVendidos += sold;
        
        const precio = Number(oferta.precio_oferta) || 0;
        ingresosTotales += (sold * precio);
      });
    }

    const comision = Number(emp.porcentaje_comision) || 0;
    const cargoServicio = ingresosTotales * (comision / 100);

    return {
      id: emp.id,
      nombre_empresa: emp.nombre_empresa,
      codigo_empresa: emp.codigo_empresa,
      porcentaje_comision: emp.porcentaje_comision,
      cuponesVendidos,
      ingresosTotales,
      cargoServicio,
    };
  });

  return (
    <div className="p-8 max-w-7xl mx-auto flex flex-col gap-6 w-full">
      <div className="flex justify-between items-end mb-2">
        <div>
          <h1 className="text-4xl font-black mb-1" style={{ fontFamily: "var(--font-display)" }}>
            Supervisión Financiera
          </h1>
          <p className="text-[var(--muted)] text-sm">Resumen de ventas brutas e inteligencia de recaudación por comisiones activas (Cargo Plataforma).</p>
        </div>
      </div>

      {!datosFinancieros.length ? (
        <div className="card text-center p-12 bg-white/50 border border-[var(--border)] border-dashed">
          <p className="text-[var(--muted)]">No hay empresas modeladas en la contabilidad.</p>
        </div>
      ) : (
        <SupervisionTable datos={datosFinancieros} />
      )}
    </div>
  );
}
