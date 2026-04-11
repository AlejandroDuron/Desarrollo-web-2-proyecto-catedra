import { createSupabaseServerClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import AprobarBoton from "./components/aprobar-boton";
import AprobacionDialog from "../components/aprobacion-dialog";

export default async function OfertaDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();

  const { data: oferta, error } = await supabase
    .from("ofertas")
    .select("*, empresas(nombre_empresa)")
    .eq("id", id)
    .single();

  if (error || !oferta) return notFound();

  const porcentaje = Math.round((1 - oferta.precio_oferta / oferta.precio_regular) * 100);
  const isEnEspera = oferta.estado === "En espera de aprobación";

  const currentDate = new Date("2026-04-11T00:00:00").getTime();
  const inicio = new Date(oferta.fecha_inicio).getTime();
  const fin = new Date(oferta.fecha_fin).getTime();

  let badgeLabel = "INDEFINIDA";
  let badgeColor = "bg-slate-100 text-slate-500 border-slate-200";

  if (fin < currentDate) { badgeLabel = "PASADA"; badgeColor = "bg-slate-100 text-slate-500 border-slate-200"; }
  else if (oferta.estado === "Oferta rechazada") { badgeLabel = "RECHAZADA"; badgeColor = "bg-red-100 text-[#ba1a1a] border-red-200"; }
  else if (oferta.estado === "Oferta descartada") { badgeLabel = "DESCARTADA"; badgeColor = "bg-red-50 text-[#ba1a1a] border-red-200"; }
  else if (isEnEspera) { badgeLabel = "EN ESPERA"; badgeColor = "bg-orange-100 text-orange-700 border-orange-200"; }
  else if (oferta.estado === "Oferta aprobada") {
    if (inicio > currentDate) { badgeLabel = "FUTURA"; badgeColor = "bg-blue-100 text-blue-700 border-blue-200"; }
    else { badgeLabel = "ACTIVA"; badgeColor = "bg-[var(--green-bg)] text-[var(--green2)] border-[var(--green)]/20"; }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto flex flex-col gap-6">
      <div>
        <Link href="/admin/ofertas" className="text-xs font-bold text-[var(--muted)] hover:text-[var(--green)] transition-colors mb-4 inline-block">
          &larr; Volver al listado de Ofertas
        </Link>
        <div className="flex items-center gap-3 flex-wrap mb-1">
          <h1 className="text-3xl font-black text-[var(--text)]" style={{ fontFamily: "var(--font-display)" }}>
            {oferta.titulo}
          </h1>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${badgeColor}`}>{badgeLabel}</span>
        </div>
        <p className="text-[var(--muted)] text-sm uppercase font-bold">{(oferta.empresas as any)?.nombre_empresa}</p>
      </div>

      {/* Cover Image */}
      {oferta.image_url ? (
        <div className="rounded-[var(--radius-lg)] overflow-hidden border border-[var(--border)]">
          <img src={oferta.image_url} alt={oferta.titulo} className="w-full aspect-video object-cover" />
        </div>
      ) : (
        <div className="aspect-video bg-gradient-to-br from-[#191C1D] via-[#3f4749] to-[var(--green)] rounded-[var(--radius-lg)] flex items-center justify-center">
          <span className="text-white/60 text-sm font-bold uppercase tracking-widest">Sin material gráfico</span>
        </div>
      )}

      {/* Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card bg-white border border-[var(--border)] rounded-[var(--radius-lg)] p-5 text-center">
          <p className="text-[10px] uppercase tracking-wider text-[var(--muted)] font-bold mb-1">Precio Oferta</p>
          <p className="text-2xl font-black text-[var(--green2)] font-mono">${Number(oferta.precio_oferta).toFixed(2)}</p>
        </div>
        <div className="card bg-white border border-[var(--border)] rounded-[var(--radius-lg)] p-5 text-center">
          <p className="text-[10px] uppercase tracking-wider text-[var(--muted)] font-bold mb-1">Precio Regular</p>
          <p className="text-2xl font-black text-[var(--text)] font-mono line-through decoration-1">${Number(oferta.precio_regular).toFixed(2)}</p>
        </div>
        <div className="card bg-[#191C1D] border border-[var(--border)] rounded-[var(--radius-lg)] p-5 text-center">
          <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">Descuento</p>
          <p className="text-2xl font-black text-white font-mono">-{porcentaje}%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card bg-white border border-[var(--border)] rounded-[var(--radius-lg)] p-6">
          <h2 className="text-sm font-bold text-[var(--muted)] uppercase tracking-wider mb-4">Descripción</h2>
          <p className="text-sm text-[var(--text)] leading-relaxed">{oferta.descripcion}</p>
          {oferta.otros_detalles && (
            <p className="text-xs text-[var(--muted)] mt-3 pt-3 border-t border-[var(--surface2)]">{oferta.otros_detalles}</p>
          )}
        </div>
        <div className="card bg-white border border-[var(--border)] rounded-[var(--radius-lg)] p-6">
          <h2 className="text-sm font-bold text-[var(--muted)] uppercase tracking-wider mb-4">Vigencia</h2>
          <div className="space-y-3">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-[var(--muted)] font-bold">Fecha de Inicio</p>
              <p className="font-mono text-sm text-[var(--text)]">{new Date(oferta.fecha_inicio).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-[var(--muted)] font-bold">Fecha de Fin</p>
              <p className="font-mono text-sm text-[var(--text)]">{new Date(oferta.fecha_fin).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-[var(--muted)] font-bold">Límite de Uso</p>
              <p className="font-mono text-sm text-[var(--text)]">{new Date(oferta.fecha_limite_uso).toLocaleDateString()}</p>
            </div>
            {oferta.cantidad_limite && (
              <div>
                <p className="text-[10px] uppercase tracking-wider text-[var(--muted)] font-bold">Stock Límite</p>
                <p className="font-mono text-sm text-[var(--text)]">{oferta.cantidad_limite} unidades</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Justificación de Rechazo */}
      {oferta.estado === "Oferta rechazada" && oferta.justificacion_rechazo && (
        <div className="card bg-red-50 border border-red-200 rounded-[var(--radius-lg)] p-6">
          <h2 className="text-sm font-bold text-[#ba1a1a] uppercase tracking-wider mb-2">Motivo de Rechazo</h2>
          <p className="text-sm text-[#ba1a1a] font-mono">{oferta.justificacion_rechazo}</p>
        </div>
      )}

      {/* Actions - only for "En espera" */}
      {isEnEspera && (
        <div className="card bg-white border border-[var(--border)] rounded-[var(--radius-lg)] p-6">
          <h2 className="text-sm font-bold text-[var(--muted)] uppercase tracking-wider mb-4">Decisión de Calidad</h2>
          <div className="flex gap-3">
            <AprobarBoton id={oferta.id} />
            <AprobacionDialog id={oferta.id} />
          </div>
        </div>
      )}
    </div>
  );
}
