"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { descartarOferta } from "../actions";

interface OfertaRechazadaActionsProps {
  ofertaId: string;
}

export default function OfertaRechazadaActions({ ofertaId }: OfertaRechazadaActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  const handleDescartar = async () => {
    if (!confirm("¿Estás seguro de descartar esta oferta? Esta acción no se puede revertir.")) return;
    setLoading(true);
    setError(null);
    try {
      const result = await descartarOferta(ofertaId);
      if ("error" in result) {
        setError(typeof result.error === "string" ? result.error : "Error al descartar.");
      } else {
        router.push("/empresa/ofertas");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-8 border-t border-[#EDEEEF] flex flex-col sm:flex-row gap-4">
      {error && (
        <p className="w-full text-sm text-[#ba1a1a] text-center">{error}</p>
      )}
      {/* Por ahora navega de vuelta — editar es futura funcionalidad */}
      <button
        onClick={() => router.push("/empresa/ofertas")}
        disabled={loading}
        className="flex-1 flex items-center justify-center gap-2 py-4 px-8 bg-[#526600] text-white font-bold text-sm uppercase tracking-widest rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        ✏️ Editar y Enviar Nuevamente
      </button>
      <button
        onClick={handleDescartar}
        disabled={loading}
        className="flex-1 flex items-center justify-center gap-2 py-4 px-8 border border-[#ba1a1a]/50 text-[#ba1a1a] font-bold text-sm uppercase tracking-widest rounded-xl hover:bg-[#FFDAD6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Descartando..." : "🗑️ Descartar Oferta"}
      </button>
    </div>
  );
}