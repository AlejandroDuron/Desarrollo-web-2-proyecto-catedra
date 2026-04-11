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
            
            return (
              <tr key={oferta.id} className="border-b border-[var(--surface2)] hover:bg-[var(--surface3)] transition-colors group">
                <td className="py-4 px-6">
                  <p className="font-bold text-[var(--text)]">{oferta.empresas?.nombre_empresa}</p>
                </td>
                <td className="py-4 px-6 max-w-[280px]">
                  <p className="font-bold text-sm truncate" title={oferta.titulo}>{oferta.titulo}</p>
                  <p className="text-xs text-[var(--muted)] truncate mt-0.5" title={oferta.descripcion}>{oferta.descripcion}</p>
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
