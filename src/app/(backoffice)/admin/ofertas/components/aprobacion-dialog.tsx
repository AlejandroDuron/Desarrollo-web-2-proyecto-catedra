"use client";

import { useState, useTransition, useEffect } from "react";
import { createPortal } from "react-dom";
import { rechazarOferta } from "../actions";

export default function AprobacionDialog({ id }: { id: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [mounted, setMounted] = useState(false);
  
  const [text, setText] = useState("");

  useEffect(() => setMounted(true), []);

  const handleAction = async (formData: FormData) => {
    setError(null);
    startTransition(async () => {
      const result = await rechazarOferta(formData, id);
      if (result.error) {
        setError(result.error);
      } else {
        setIsOpen(false);
        setText("");
      }
    });
  };

  const isInvalid = text.trim().length < 15;

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        disabled={isPending}
        className="px-4 py-2 bg-red-100 text-[#ba1a1a] text-sm font-bold rounded-[var(--radius-sm)] hover:bg-[#FFDAD6] transition-colors"
      >
        Rechazar
      </button>

      {isOpen && mounted && createPortal(
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-[var(--bg)] rounded-[var(--radius-lg)] p-6 w-full max-w-md card shadow-2xl">
            <h2 className="text-xl font-bold mb-2 text-[#ba1a1a]" style={{ fontFamily: "var(--font-display)" }}>
              Inadmitir Oferta
            </h2>
            <p className="text-sm text-[var(--subtle)] mb-4">
              Por favor documente el error o el incumplimiento técnico que ha generado que se levante esta bandera.
            </p>
            
            <form action={handleAction} className="flex flex-col gap-4">
              {error && <div className="p-3 bg-red-100 text-[#ba1a1a] text-sm font-bold rounded-lg border border-red-200">{error}</div>}
              
              <div className="flex flex-col gap-1">
                <label className="text-sm font-bold text-[var(--subtle)]">Justificación</label>
                <textarea 
                  name="justificacion_rechazo" 
                  rows={4}
                  required
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Ej: Material publicitario no cumple con la línea del rubro..."
                  className="border border-[var(--border)] rounded-[var(--radius)] px-3 py-2 text-sm focus:outline-none focus:border-[#ba1a1a] transition-colors resize-none"
                />
                <span className={`text-xs text-right mt-1 font-mono font-bold ${isInvalid ? 'text-[#ba1a1a]' : 'text-[var(--green)]'}`}>
                  {text.trim().length} / 15 chrs
                </span>
              </div>

              <div className="flex justify-end gap-3 mt-2">
                <button 
                  type="button" 
                  onClick={() => setIsOpen(false)}
                  disabled={isPending}
                  className="px-4 py-2 text-sm font-bold text-[var(--muted)] hover:bg-[var(--surface)] rounded-[var(--radius-sm)] transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  disabled={isPending || isInvalid}
                  className="px-4 py-2 bg-[#ba1a1a] text-white text-sm font-bold rounded-[var(--radius-sm)] hover:bg-red-800 disabled:opacity-50 transition-colors"
                >
                  {isPending ? "Validando..." : "Confirmar Rechazo"}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
