"use client";

import { useTransition } from "react";
import AprobacionDialog from "./aprobacion-dialog";
import { aprobarOferta } from "../actions";

export default function OfertaTable({ ofertas, isReadOnly }: { ofertas: any[], isReadOnly?: boolean }) {
  return (
    <div className="overflow-x-auto card bg-[var(--bg)] p-1">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-[var(--border)] bg-[var(--surface)] text-[var(--subtle)]">
            <th className="py-4 px-6 text-xs uppercase tracking-wider font-bold">Empresa Emisora</th>
            <th className="py-4 px-6 text-xs uppercase tracking-wider font-bold">Detalle de Oferta</th>
            <th className="py-4 px-6 text-xs uppercase tracking-wider font-bold text-center">Descuento (%)</th>
            {!isReadOnly && <th className="py-4 px-6 text-xs uppercase tracking-wider font-bold text-right">Decisión Calidad</th>}
          </tr>
        </thead>
        <tbody>
          {ofertas.map((oferta) => {
            const porcentaje = Math.round((1 - (oferta.precio_oferta / oferta.precio_regular)) * 100);
            const badge = getBadgeInfo(oferta);
            
            return (
              <tr key={oferta.id} className="border-b border-[var(--surface2)] hover:bg-[var(--surface3)] transition-colors group">
                <td className="py-4 px-6">
                  <p className="font-bold text-[var(--text)]">{oferta.empresas?.nombre_empresa}</p>
                </td>
                <td className="py-4 px-6 max-w-[280px]">
                  <div className="flex items-center gap-2 mb-1">
                     <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${badge.color}`}>
                        {badge.label}
                     </span>
                  </div>
                  <p className="font-bold text-sm truncate" title={oferta.titulo}>{oferta.titulo}</p>
                  <p className="text-xs text-[var(--muted)] line-clamp-2 mt-0.5" title={oferta.descripcion}>{oferta.descripcion}</p>
                  
                  {oferta.estado === 'Oferta rechazada' && oferta.justificacion_rechazo && (
                     <p className="text-xs text-[#ba1a1a] mt-1 bg-red-50 p-1 rounded font-mono">Rechazo: {oferta.justificacion_rechazo}</p>
                  )}

                  <p className="text-xs text-[var(--subtle)] mt-1.5 font-mono">
                    [{new Date(oferta.fecha_inicio).toLocaleDateString()} a {new Date(oferta.fecha_fin).toLocaleDateString()}]
                  </p>
                </td>
                <td className="py-4 px-6 text-center">
                  <div className="flex flex-col items-center">
                    <span className="text-xs text-[var(--text)] font-mono">${oferta.precio_oferta.toFixed(2)} USD</span>
                    <span className="text-[10px] text-[var(--muted)] line-through font-mono mt-0.5">${oferta.precio_regular.toFixed(2)} base</span>
                    <span className="text-xs bg-[var(--green-bg)] text-[var(--green2)] px-2 py-0.5 rounded font-bold font-mono mt-1.5 border border-[#84cc16]/20">
                      -{porcentaje}% OFF
                    </span>
                  </div>
                </td>
                {!isReadOnly && (
                  <td className="py-4 px-6 text-right w-[240px]">
                    <div className="flex justify-end gap-2 items-center h-full">
                      <AprobarBoton id={oferta.id} />
                      <AprobacionDialog id={oferta.id} />
                    </div>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function AprobarBoton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      onClick={() => {
        startTransition(async () => {
          await aprobarOferta(id);
        });
      }}
      disabled={isPending}
      className={`px-4 py-2 bg-[var(--green)] text-white text-sm font-bold rounded-[var(--radius-sm)] hover:bg-[var(--green2)] transition-colors ${isPending ? 'opacity-50' : ''}`}
    >
      {isPending ? "Ejecutando..." : "Aprobar"}
    </button>
  );
}

function getBadgeInfo(oferta: any) {
  const currentDate = new Date("2026-04-11T00:00:00").getTime();
  const inicio = new Date(oferta.fecha_inicio).getTime();
  const fin = new Date(oferta.fecha_fin).getTime();

  if (fin < currentDate) return { label: 'PASADA', color: 'bg-slate-100 text-slate-500 border-slate-200' };
  
  if (oferta.estado === 'Oferta rechazada') return { label: 'RECHAZADA', color: 'bg-red-100 text-[#ba1a1a] border-red-200' };
  if (oferta.estado === 'Oferta descartada') return { label: 'DESCARTADA', color: 'bg-red-50 text-[#ba1a1a] border-red-200' };
  if (oferta.estado === 'En espera de aprobación') return { label: 'EN ESPERA', color: 'bg-orange-100 text-orange-700 border-orange-200' };
  
  if (oferta.estado === 'Oferta aprobada') {
     if (inicio > currentDate) return { label: 'FUTURA', color: 'bg-blue-100 text-blue-700 border-blue-200' };
     return { label: 'ACTIVA', color: 'bg-[var(--green-bg)] text-[var(--green2)] border-[var(--green)]/20' };
  }
  
  return { label: 'INDEFINIDA', color: 'bg-slate-100 text-slate-500 border-slate-200' };
}
