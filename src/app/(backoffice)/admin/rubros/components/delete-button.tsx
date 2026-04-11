"use client";

import { useState, useTransition, useEffect } from "react";
import { createPortal } from "react-dom";
import { deleteRubro } from "../actions";

export default function DeleteRubroButton({ id }: { id: number }) {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleConfirm = () => {
    setError(null);
    startTransition(async () => {
      const result = await deleteRubro(id);
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
        disabled={isPending}
        className={`px-4 py-2 bg-red-100 text-[#ba1a1a] text-sm font-bold rounded-[var(--radius-sm)] hover:bg-[#FFDAD6] transition-colors ${isPending ? 'opacity-50' : ''}`}
      >
        {isPending ? "Eliminando..." : "Eliminar"}
      </button>

      {isOpen && mounted && createPortal(
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-[var(--bg)] rounded-[var(--radius-lg)] p-6 w-full max-w-sm card shadow-2xl">
            <h2 className="text-xl font-bold mb-2 text-[#ba1a1a]" style={{ fontFamily: "var(--font-display)" }}>
              Confirmar Eliminación
            </h2>
            <p className="text-sm text-[var(--subtle)] mb-4">
              ¿Estás seguro de eliminar este rubro?
            </p>
            
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-[#ba1a1a] text-sm font-mono rounded-lg border border-red-200">
                {error}
              </div>
            )}

            <div className="flex justify-end gap-3 mt-4">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  setError(null);
                }}
                className="px-4 py-2 text-sm font-bold text-[var(--muted)] hover:bg-[var(--surface)] rounded-[var(--radius-sm)] transition-colors"
                disabled={isPending}
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 bg-[#ba1a1a] text-white text-sm font-bold rounded-[var(--radius-sm)] hover:bg-red-800 transition-colors"
                disabled={isPending}
              >
                {isPending ? "Borrando..." : "Sí, eliminar"}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
