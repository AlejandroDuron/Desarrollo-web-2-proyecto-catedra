"use client";

import Link from "next/link";
import { type OfertaConMetricas, type CategoriaOferta } from "../actions";

const fmt = (n: number) => n.toLocaleString("en-US");
const fmtMoney = (n: number) => `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const BADGE: Record<CategoriaOferta, { classes: string; label: string }> = {
  activas:           { classes: "bg-[#D9FF50] text-[#171E00]", label: "Activa"     },
  en_espera:         { classes: "bg-[#E1E3E4] text-[#454935]", label: "En Espera"  },
  aprobadas_futuras: { classes: "bg-[#D5E893] text-[#596923]", label: "Aprobada"   },
  pasadas:           { classes: "bg-[#EDEEEF] text-[#454935]", label: "Pasada"     },
  rechazadas:        { classes: "bg-[#FFDAD6] text-[#93000A]", label: "Rechazada"  },
  descartadas:       { classes: "bg-[#E1E3E4] text-[#454935]", label: "Descartada" },
};

function diasRestantes(fechaFin: string): number {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const fin = new Date(fechaFin);
  return Math.ceil((fin.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
}

export default function OfferCard({ oferta }: { oferta: OfertaConMetricas }) {
  const badge       = BADGE[oferta.categoria];
  const isLow       = oferta.cupones_disponibles <= 10 && oferta.cupones_disponibles > 0;
  const dias        = diasRestantes(oferta.fecha_fin);
  const showMetrics = true;

  return (
    <div className="bg-white rounded-xl overflow-hidden border border-[#EDEEEF] hover:shadow-xl transition-all duration-300 group">

      {/* Imagen */}
      <div className="relative h-48 overflow-hidden bg-[#F3F4F5]">
        {oferta.image_url ? (
          <img
            src={oferta.image_url}
            alt={oferta.titulo}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#E1E3E4] text-4xl">
            
          </div>
        )}
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${badge.classes}`}>
            {badge.label}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-lg font-bold leading-tight mb-1 text-[#191C1D]">{oferta.titulo}</h3>
          <p className="text-xs text-[#454935]">
            {oferta.categoria === "activas"           && dias >= 0 && `Vence en: ${dias} días`}
            {oferta.categoria === "activas"           && dias <  0 && "Vencida"}
            {oferta.categoria === "aprobadas_futuras" && `Inicia: ${oferta.fecha_inicio}`}
            {oferta.categoria === "en_espera"         && "Pendiente de revisión"}
            {oferta.categoria === "pasadas"           && `Finalizó: ${oferta.fecha_fin}`}
            {oferta.categoria === "rechazadas"        && "Ver justificación abajo"}
            {oferta.categoria === "descartadas"       && "Descartada"}
          </p>
        </div>

        {/* Métricas */}
        {showMetrics && (
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#EDEEEF] mb-4">
            <Stat label="Vendidos"   value={fmt(oferta.cupones_vendidos)} />
            <Stat
              label="Disponibles"
              value={fmt(oferta.cupones_disponibles)}
              valueClass={isLow ? "text-[#ba1a1a]" : "text-[#191C1D]"}
            />
            <Stat label="Ingresos"   value={fmtMoney(oferta.ingresos_totales)} />
            <Stat
              label={`Comisión (${oferta.porcentaje_comision}%)`}
              value={fmtMoney(oferta.cargo_servicio)}
              valueClass="text-[#526600]"
            />
          </div>
        )}

        {/* Botón Ver Oferta */}
        <Link
          href={`/empresa/ofertas/${oferta.id}`}
          className="w-full mt-6 py-3 flex items-center justify-center bg-[#D9FF50] text-[#171E00] text-xs font-bold uppercase tracking-widest rounded-lg hover:opacity-90 transition-opacity"
        >
          Ver Oferta
        </Link>
      </div>
    </div>
  );
}

function Stat({ label, value, valueClass = "text-[#191C1D]" }: {
  label:       string;
  value:       string;
  valueClass?: string;
}) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-wide text-[#454935] mb-1">{label}</p>
      <p className={`text-lg font-bold ${valueClass}`}>{value}</p>
    </div>
  );
}