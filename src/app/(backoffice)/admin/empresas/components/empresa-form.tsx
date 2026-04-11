"use client";

import { useState, useTransition, useEffect } from "react";
import { createPortal } from "react-dom";
import { submitEmpresa } from "../actions";
import type { Database } from "@/types/database";

type EmpresaRow = Database["public"]["Tables"]["empresas"]["Row"];
type RubroRow = Database["public"]["Tables"]["rubros"]["Row"];

export default function EmpresaForm({ 
  empresa,
  rubrosDisponibles 
}: { 
  empresa?: EmpresaRow,
  rubrosDisponibles: RubroRow[] 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const handleAction = async (formData: FormData) => {
    setError(null);
    startTransition(async () => {
      const result = await submitEmpresa(formData, empresa?.id);
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
        style={{ transition: "var(--transition)" }}
        className="px-4 py-2 bg-[#191C1D] text-white rounded-[var(--radius-sm)] hover:opacity-90 font-bold transition-all text-sm"
      >
        {empresa ? "Editar" : "Añadir Empresa"}
      </button>

      {isOpen && mounted && createPortal(
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-[var(--bg)] rounded-[var(--radius-lg)] p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto card shadow-2xl">
            <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "var(--font-display)" }}>
              {empresa ? "Editar Empresa" : "Nueva Empresa"}
            </h2>
            
            <form action={handleAction} className="flex flex-col gap-4">
              {error && <div className="p-3 bg-red-100 text-[#ba1a1a] text-sm font-bold rounded-lg border border-red-200">{error}</div>}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-bold text-[var(--subtle)]">Código Empresa</label>
                  <input type="text" name="codigo_empresa" defaultValue={empresa?.codigo_empresa} required placeholder="ABC123"
                    className="border border-[var(--border)] rounded-[var(--radius)] px-3 py-2 text-sm font-mono focus:border-[var(--green)] focus:outline-none transition-colors" />
                </div>
                
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-bold text-[var(--subtle)]">Tipo de Rubro</label>
                  <select name="id_rubro" defaultValue={empresa?.id_rubro || ""} required
                    className="border border-[var(--border)] rounded-[var(--radius)] px-3 py-2 text-sm focus:border-[var(--green)] focus:outline-none bg-[var(--bg)] transition-colors">
                    <option value="" disabled>Seleccione un rubro</option>
                    {rubrosDisponibles.map(r => (
                      <option key={r.id} value={r.id}>{r.nombre_rubro}</option>
                    ))}
                  </select>
                </div>
                
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-bold text-[var(--subtle)]">Nombre de Empresa</label>
                  <input type="text" name="nombre_empresa" defaultValue={empresa?.nombre_empresa} required
                    className="border border-[var(--border)] rounded-[var(--radius)] px-3 py-2 text-sm focus:border-[var(--green)] focus:outline-none transition-colors" />
                </div>
                
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-bold text-[var(--subtle)]">Comisión en (%)</label>
                  <input type="number" step="0.01" max="100" min="0" name="porcentaje_comision" defaultValue={empresa?.porcentaje_comision} required placeholder="10.50"
                    className="border border-[var(--border)] rounded-[var(--radius)] px-3 py-2 text-sm font-mono focus:border-[var(--green)] focus:outline-none transition-colors" />
                </div>
                
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-bold text-[var(--subtle)]">Persona Contacto</label>
                  <input type="text" name="nombre_contacto" defaultValue={empresa?.nombre_contacto} required
                    className="border border-[var(--border)] rounded-[var(--radius)] px-3 py-2 text-sm focus:border-[var(--green)] focus:outline-none transition-colors" />
                </div>
                
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-bold text-[var(--subtle)]">Teléfono Fijo o Celular</label>
                  <input type="tel" name="telefono" defaultValue={empresa?.telefono} required placeholder="00000000"
                    className="border border-[var(--border)] rounded-[var(--radius)] px-3 py-2 text-sm focus:border-[var(--green)] focus:outline-none transition-colors" />
                </div>
                
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-bold text-[var(--subtle)]">Correo Electrónico</label>
                  <input type="email" name="correo" defaultValue={empresa?.correo} required placeholder="contacto@ejemplo.com"
                    className="border border-[var(--border)] rounded-[var(--radius)] px-3 py-2 text-sm focus:border-[var(--green)] focus:outline-none transition-colors" />
                </div>
                
                <div className="flex flex-col gap-1 md:col-span-2">
                  <label className="text-sm font-bold text-[var(--subtle)]">Dirección Física</label>
                  <input type="text" name="direccion" defaultValue={empresa?.direccion} required placeholder="San Salvador..."
                    className="border border-[var(--border)] rounded-[var(--radius)] px-3 py-2 text-sm focus:border-[var(--green)] focus:outline-none transition-colors" />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-[var(--surface3)]">
                <button type="button" onClick={() => setIsOpen(false)} disabled={isPending}
                  className="px-4 py-2 text-sm font-bold text-[var(--muted)] hover:bg-[var(--surface)] rounded-[var(--radius-sm)] transition-colors">
                  Cancelar
                </button>
                <button type="submit" disabled={isPending}
                  className="px-6 py-2 bg-[var(--green)] text-white text-sm font-bold rounded-[var(--radius-sm)] hover:bg-[var(--green2)] transition-colors">
                  {isPending ? "Guardando..." : "Guardar Registro"}
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
