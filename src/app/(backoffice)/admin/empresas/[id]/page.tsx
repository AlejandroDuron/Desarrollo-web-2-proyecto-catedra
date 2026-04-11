import { createSupabaseServerClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import EmpresaForm from "../components/empresa-form";
import DeleteEmpresaButton from "../components/delete-button";
import Link from "next/link";

const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 });

export default async function EmpresaDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();

  const [empresaRes, rubrosRes] = await Promise.all([
    supabase.from("empresas").select("*, rubros(nombre_rubro)").eq("id", id).single(),
    supabase.from("rubros").select("*").order("nombre_rubro", { ascending: true })
  ]);

  if (empresaRes.error || !empresaRes.data) return notFound();

  const empresa = empresaRes.data;
  const rubrosDisponibles = rubrosRes.data || [];

  return (
    <div className="p-8 max-w-4xl mx-auto flex flex-col gap-6">
      <div>
        <Link href="/admin/empresas" className="text-xs font-bold text-[var(--muted)] hover:text-[var(--green)] transition-colors mb-4 inline-block">
          &larr; Volver al listado de Empresas
        </Link>
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-4xl font-black text-[var(--text)]" style={{ fontFamily: "var(--font-display)" }}>
            {empresa.nombre_empresa}
          </h1>
          <span className="bg-white border border-[var(--border)] px-2 py-1 rounded text-xs font-mono font-bold text-[#191C1D] shadow-sm">
            {empresa.codigo_empresa}
          </span>
        </div>
        <p className="text-[var(--muted)] text-sm uppercase font-bold">{(empresa.rubros as any)?.nombre_rubro || "S/ Rubro"}</p>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card bg-white border border-[var(--border)] rounded-[var(--radius-lg)] p-6">
          <h2 className="text-sm font-bold text-[var(--muted)] uppercase tracking-wider mb-4">Contacto</h2>
          <div className="space-y-3">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-[var(--muted)] font-bold">Persona de Contacto</p>
              <p className="font-bold text-[var(--text)]">{empresa.nombre_contacto}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-[var(--muted)] font-bold">Teléfono</p>
              <p className="font-mono text-sm text-[var(--text)]">{empresa.telefono}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-[var(--muted)] font-bold">Correo Electrónico</p>
              <p className="font-mono text-sm text-[var(--text)]">{empresa.correo}</p>
            </div>
          </div>
        </div>

        <div className="card bg-white border border-[var(--border)] rounded-[var(--radius-lg)] p-6">
          <h2 className="text-sm font-bold text-[var(--muted)] uppercase tracking-wider mb-4">Operaciones</h2>
          <div className="space-y-3">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-[var(--muted)] font-bold">Dirección Fiscal</p>
              <p className="text-sm text-[var(--text)]">{empresa.direccion}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-[var(--muted)] font-bold">Comisión (% Fee)</p>
              <p className="font-mono text-2xl font-black text-[var(--green2)]">{empresa.porcentaje_comision}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="card bg-white border border-[var(--border)] rounded-[var(--radius-lg)] p-6">
        <h2 className="text-sm font-bold text-[var(--muted)] uppercase tracking-wider mb-4">Acciones Administrativas</h2>
        <div className="flex gap-3">
          <EmpresaForm empresa={empresa} rubrosDisponibles={rubrosDisponibles} />
          <DeleteEmpresaButton id={empresa.id} />
        </div>
      </div>
    </div>
  );
}
