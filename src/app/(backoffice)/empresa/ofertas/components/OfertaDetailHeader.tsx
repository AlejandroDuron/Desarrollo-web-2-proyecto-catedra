"use client";

import Link from "next/link";
import { type CategoriaOferta } from "../schema"; 

const BADGE: Record<CategoriaOferta, { label: string; classes: string; dot: string; pulse: boolean }> = {
  activas:           { label: "Activa",               classes: "bg-[#D9FF50] text-[#171E00]",  dot: "bg-[#526600]",  pulse: false },
  en_espera:         { label: "Pendiente de Revisión", classes: "bg-[#E7E8E9] text-[#454935]",  dot: "bg-amber-500",  pulse: true  },
  aprobadas_futuras: { label: "Aprobada",              classes: "bg-[#D5E893] text-[#596923]",  dot: "bg-[#526600]",  pulse: false },
  pasadas:           { label: "Pasada",                classes: "bg-[#EDEEEF] text-[#454935]",  dot: "bg-[#9EA3A6]",  pulse: false },
  rechazadas:        { label: "Rechazada",             classes: "bg-[#FFDAD6] text-[#93000A]",  dot: "bg-[#ba1a1a]",  pulse: false },
  descartadas:       { label: "Descartada",            classes: "bg-[#E1E3E4] text-[#454935]",  dot: "bg-[#9EA3A6]",  pulse: false },
};

export default function OfertaDetailHeader({ categoria }: { categoria: CategoriaOferta }) {
  const badge = BADGE[categoria];

  return (
    <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
      <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase ${badge.classes}`}>
        <span className={`w-2 h-2 rounded-full ${badge.dot} ${badge.pulse ? "animate-pulse" : ""}`} />
        {badge.label}
      </span>

      <Link
        href="/empresa/ofertas"
        className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold text-[#454935] hover:bg-[#F3F4F5] transition-colors"
      >
        ← Volver a Ofertas
      </Link>
    </div>
  );
}