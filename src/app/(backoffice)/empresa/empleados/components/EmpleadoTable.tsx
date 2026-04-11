"use client";

import { useState, useTransition } from "react";
import { toggleEmpleadoActivo, eliminarEmpleado } from "../actions";
import { type EmpleadoRow } from "../actions";
import EmpleadoForm from "./EmpleadoForm";

export default function EmpleadoTable({ empleados }: { empleados: EmpleadoRow[] }) {
  const [isPending, startTransition] = useTransition();
  const [loadingId, setLoadingId]    = useState<string | null>(null);
  const [error, setError]            = useState<string | null>(null);
  const [editingEmpleado, setEditingEmpleado] = useState<EmpleadoRow | null>(null);

  const handleToggle = (id: string, activo: boolean) => {
    setLoadingId(id);
    setError(null);
    startTransition(async () => {
      const result = await toggleEmpleadoActivo(id, !activo);
      if ("error" in result) setError(result.error ?? "Error al actualizar.");
      setLoadingId(null);
    });
  };

  const handleDelete = (id: string, nombre: string) => {
    if (!confirm(`¿Eliminar a ${nombre}? Esta acción no se puede revertir.`)) return;
    setLoadingId(id);
    setError(null);
    startTransition(async () => {
      const result = await eliminarEmpleado(id);
      if ("error" in result) setError(result.error ?? "Error al eliminar.");
      setLoadingId(null);
    });
  };

  if (empleados.length === 0) {
    return (
      <div className="p-12 text-center border border-dashed border-[#E1E3E4] rounded-xl text-[#9EA3A6]">
        No hay empleados registrados aún.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-[#EDEEEF] overflow-hidden">
      {error && (
        <div className="px-6 py-3 bg-[#FFDAD6] text-[#ba1a1a] text-sm font-bold border-b border-[#FFB4AB]">
          {error}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-[#EDEEEF] bg-[#F8F9FA]">
              <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-[#454935]">Empleado</th>
              <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-[#454935]">Correo</th>
              <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-[#454935]">Alta</th>
              <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-[#454935]">Estado</th>
              <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-[#454935] text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {empleados.map((e) => {
              const isLoading = loadingId === e.id && isPending;
              return (
                <tr key={e.id} className="border-b border-[#F3F4F5] hover:bg-[#F8F9FA] transition-colors">
                  <td className="py-4 px-6">
                    <p className="font-bold text-[#191C1D]">
                      {e.nombres} {e.apellidos}
                    </p>
                  </td>
                  <td className="py-4 px-6 text-sm text-[#454935] font-mono">
                    {e.email ?? "—"}
                  </td>
                  <td className="py-4 px-6 text-sm text-[#9EA3A6]">
                    {new Date(e.created_at).toLocaleDateString("es-SV")}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                      e.activo
                        ? "bg-[#D9FF50] text-[#171E00]"
                        : "bg-[#E1E3E4] text-[#454935]"
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${e.activo ? "bg-[#526600]" : "bg-[#9EA3A6]"}`} />
                      {e.activo ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setEditingEmpleado(e)}
                        disabled={isLoading}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold border border-[#E1E3E4] text-[#454935] hover:bg-[#F3F4F5] transition-colors disabled:opacity-50"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleToggle(e.id, e.activo)}
                        disabled={isLoading}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors disabled:opacity-50 ${
                          e.activo
                            ? "border border-[#E1E3E4] text-[#454935] hover:bg-[#F3F4F5]"
                            : "bg-[#D9FF50] text-[#171E00] hover:opacity-90"
                        }`}
                      >
                        {isLoading ? "..." : e.activo ? "Desactivar" : "Activar"}
                      </button>
                      <button
                        onClick={() => handleDelete(e.id, `${e.nombres} ${e.apellidos}`)}
                        disabled={isLoading}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold border border-[#ba1a1a]/30 text-[#ba1a1a] hover:bg-[#FFDAD6] transition-colors disabled:opacity-50"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
          </table>
    </div>

    {editingEmpleado && (
      <EmpleadoForm
        empleado={editingEmpleado}
        open={!!editingEmpleado}
        onClose={() => setEditingEmpleado(null)}
      />
    )}

  </div>
)};