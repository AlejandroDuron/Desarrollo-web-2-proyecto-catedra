"use client";

import { useState, useTransition, useEffect } from "react";
import { createPortal } from "react-dom";
import { submitRubro } from "../actions";

export default function RubroForm({ 
  rubro 
}: { 
  rubro?: { id: number, nombre_rubro: string } 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAction = async (formData: FormData) => {
    setError(null);
    startTransition(async () => {
      const result = await submitRubro(formData, rubro?.id);
      if (result.error) {
        setError(result.error);
      } else {
        setIsOpen(false);
      }
    });
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-[#191C1D] text-white rounded-[var(--radius-sm)] hover:opacity-90 font-bold transition-all text-sm"
        style={{ transition: "var(--transition)" }}
      >
        {rubro ? "Editar" : "Nuevo Rubro"}
      </button>

      {isOpen && mounted && createPortal(
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-[var(--bg)] rounded-[var(--radius-lg)] p-6 w-full max-w-sm card">
            <h2 className="text-xl font-bold mb-4" style={{ fontFamily: "var(--font-display)" }}>
              {rubro ? "Editar Rubro" : "Nuevo Rubro"}
            </h2>
            
            <form action={handleAction} className="flex flex-col gap-4">
              {error && <div className="p-3 bg-red-100 text-red-800 text-sm rounded-lg">{error}</div>}
              
              <div className="flex flex-col gap-1">
                <label htmlFor="nombre_rubro" className="text-sm font-bold text-[var(--subtle)]">Nombre del Rubro</label>
                <input 
                  type="text" 
                  id="nombre_rubro" 
                  name="nombre_rubro" 
                  defaultValue={rubro?.nombre_rubro || ""}
                  required
                  placeholder="Ej. Restaurantes"
                  className="border border-[var(--border)] rounded-[var(--radius)] px-3 py-2 text-sm focus:outline-none focus:border-[var(--green)]"
                />
              </div>

              <div className="flex justify-end gap-3 mt-2">
                <button 
                  type="button" 
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-sm font-bold text-[var(--muted)] hover:bg-[var(--surface)] rounded-[var(--radius-sm)]"
                  disabled={isPending}
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-[var(--green)] text-white text-sm font-bold rounded-[var(--radius-sm)] hover:bg-[var(--green2)]"
                  disabled={isPending}
                >
                  {isPending ? "Guardando..." : "Guardar"}
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
