import { createSupabaseServerClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import RubroForm from "../components/rubro-form";
import DeleteRubroButton from "../components/delete-button";
import Link from "next/link";

export default async function RubroDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();

  const { data: rubro, error } = await supabase
    .from("rubros")
    .select("*")
    .eq("id", Number(id))
    .single();

  if (error || !rubro) return notFound();

  return (
    <div className="p-8 max-w-3xl mx-auto flex flex-col gap-6">
      <div>
        <Link href="/admin/rubros" className="text-xs font-bold text-[var(--muted)] hover:text-[var(--green)] transition-colors mb-4 inline-block">
          &larr; Volver al listado de Rubros
        </Link>
        <h1 className="text-4xl font-black text-[var(--text)]" style={{ fontFamily: "var(--font-display)" }}>
          {rubro.nombre_rubro}
        </h1>
        <p className="text-[var(--muted)] text-sm font-mono mt-1">Identificador Interno: #{rubro.id}</p>
      </div>

      <div className="card bg-white border border-[var(--border)] rounded-[var(--radius-lg)] p-6">
        <h2 className="text-lg font-bold mb-4" style={{ fontFamily: "var(--font-display)" }}>Información del Rubro</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs uppercase tracking-wider text-[var(--muted)] font-bold mb-1">ID</p>
            <p className="font-mono text-sm font-bold text-[var(--text)]">{rubro.id}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-[var(--muted)] font-bold mb-1">Nombre</p>
            <p className="font-bold text-[var(--text)]">{rubro.nombre_rubro}</p>
          </div>
        </div>
      </div>

      <div className="card bg-white border border-[var(--border)] rounded-[var(--radius-lg)] p-6">
        <h2 className="text-lg font-bold mb-4" style={{ fontFamily: "var(--font-display)" }}>Acciones</h2>
        <div className="flex gap-3">
          <RubroForm rubro={rubro} />
          <DeleteRubroButton id={rubro.id} />
        </div>
      </div>
    </div>
  );
}
