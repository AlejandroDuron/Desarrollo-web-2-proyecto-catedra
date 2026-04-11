import { createSupabaseServerClient } from "@/lib/supabase/server";
import EmpresaForm from "./components/empresa-form";
import DeleteEmpresaButton from "./components/delete-button";

export default async function EmpresasPage() {
  const supabase = await createSupabaseServerClient();
  
  const [empresasRes, rubrosRes] = await Promise.all([
    supabase.from("empresas").select("*, rubros(nombre_rubro)").order("created_at", { ascending: false }),
    supabase.from("rubros").select("*").order("nombre_rubro", { ascending: true })
  ]);

  const empresas = empresasRes.data;
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

      <div className="card bg-[var(--bg)] p-1">
        {(!empresas || empresas.length === 0) ? (
          <div className="p-8 text-center text-[var(--muted)]">
            <p>No hay empresas registradas actualmente.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--surface)] text-[var(--subtle)]">
                  <th className="py-4 px-6 text-xs uppercase tracking-wider font-bold">Código ISO</th>
                  <th className="py-4 px-6 text-xs uppercase tracking-wider font-bold">Identidad</th>
                  <th className="py-4 px-6 text-xs uppercase tracking-wider font-bold">Dirección Web & Cont.</th>
                  <th className="py-4 px-6 text-xs uppercase tracking-wider font-bold text-center">Comisión Base</th>
                  <th className="py-4 px-6 text-xs uppercase tracking-wider font-bold text-right">Ajustes</th>
                </tr>
              </thead>
              <tbody>
                {empresas.map((empresa) => (
                  <tr key={empresa.id} className="border-b border-[var(--surface2)] hover:bg-[var(--surface3)] transition-colors group">
                    <td className="py-4 px-6 font-mono text-sm">
                      <span className="bg-white border border-[var(--border)] px-2 py-1 rounded text-[#191C1D] shadow-sm font-bold">
                        {empresa.codigo_empresa}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <p className="font-bold text-[var(--text)]">{empresa.nombre_empresa}</p>
                      <p className="text-xs text-[var(--muted)] font-bold uppercase mt-1 px-2 py-0.5 bg-[var(--surface)] w-max rounded">
                        {(empresa.rubros as any)?.nombre_rubro || "S/ Rubro"}
                      </p>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-sm font-medium">{empresa.correo}</p>
                      <p className="text-xs text-[var(--muted)] uppercase mt-0.5">Contactar a: {empresa.nombre_contacto} ({empresa.telefono})</p>
                    </td>
                    <td className="py-4 px-6 text-center">
                       <span className="font-mono font-bold text-[var(--green2)] bg-[var(--green-bg)] px-2 py-1 rounded">
                         {empresa.porcentaje_comision}%
                       </span>
                    </td>
                    <td className="py-4 px-6 text-right flex justify-end gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                      <EmpresaForm empresa={empresa} rubrosDisponibles={rubrosDisponibles} />
                      <DeleteEmpresaButton id={empresa.id} />
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
