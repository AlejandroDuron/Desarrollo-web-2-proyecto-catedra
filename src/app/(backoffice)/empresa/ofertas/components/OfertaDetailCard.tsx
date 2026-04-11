"use client";

import { type OfertaConMetricas } from "../actions";
import OfertaRechazadaActions from "./OfertaRechazadaActions";

const fmtMoney = (n: number) =>
  `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function OfertaDetailCard({ oferta }: { oferta: OfertaConMetricas }) {
  const descuento = oferta.precio_regular > 0
    ? Math.round((1 - oferta.precio_oferta / oferta.precio_regular) * 100)
    : null;

  const isRechazada      = oferta.categoria === "rechazadas";
  const isDescartada     = oferta.categoria === "descartadas";
  const showJustificacion = (isRechazada || isDescartada) && oferta.justificacion_rechazo;

  return (
    <div className="bg-white overflow-hidden rounded-xl shadow-sm border border-[#EDEEEF]">

      {/* Imagen */}
      <div className={`relative aspect-[16/6] w-full overflow-hidden bg-[#f3f4f5] ${isRechazada || isDescartada ? "grayscale-[0.4]" : ""}`}>
        {oferta.image_url ? (
          <>
            <img
              src={oferta.image_url}
              alt={oferta.titulo}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#e1e3e4] text-5xl">
            🏷️
          </div>
        )}

        {(isRechazada || isDescartada) && (
          <div className="absolute top-3 right-3">
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-bold text-xs shadow-md text-white
              ${isRechazada ? "bg-[#ba1a1a]" : "bg-[#454935]"}`}>
              ✕ {isRechazada ? "RECHAZADA" : "DESCARTADA"}
            </div>
          </div>
        )}
      </div>

      {/* Contenido */}
      <div className="p-4 md:p-6 space-y-6">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">

          {/* Texto */}
          <div className="space-y-1.5 max-w-xl">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-[#191c1d]">
              {oferta.titulo}
            </h2>
            {oferta.descripcion && (
              <p className="text-sm text-[#454935] leading-relaxed">
                {oferta.descripcion}
              </p>
            )}
          </div>

          {/* Precio */}
          <div className="shrink-0 md:text-right">
            {oferta.precio_regular > 0 && (
              <p className="text-sm line-through text-[#9ea3a6]">
                {fmtMoney(oferta.precio_regular)}
              </p>
            )}

            <p className="text-2xl md:text-3xl font-bold text-[#526600]">
              {fmtMoney(oferta.precio_oferta)}
            </p>

            {descuento && (
              <span className="inline-block mt-1 px-2.5 py-0.5 bg-[#526600] text-white text-[10px] font-bold tracking-wide rounded-md">
                {descuento}% OFF
              </span>
            )}
          </div>
        </div>

        {/* Detalles */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4 border-t border-[#EDEEEF]">

          {/* Izquierda */}
          <div className="space-y-4">
            {oferta.otros_detalles && (
              <div>
                <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#6b7280] mb-1">
                  Términos y condiciones
                </h3>
                <p className="text-sm text-[#454935] leading-relaxed whitespace-pre-line">
                  {oferta.otros_detalles}
                </p>
              </div>
            )}
          </div>

          {/* Derecha */}
          {showJustificacion && (
            <div className="p-4 rounded-xl bg-[#ffdad6]/40 border border-[#ba1a1a]/20">
              <h3 className="font-semibold text-sm text-[#ba1a1a] mb-2 flex items-center gap-2">
                ⚠️ Justificación
              </h3>

              <p className="text-sm text-[#454935] italic leading-relaxed">
                "{oferta.justificacion_rechazo}"
              </p>

              <div className="mt-3 pt-3 border-t border-[#ba1a1a]/10 flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-[#ba1a1a]/10 flex items-center justify-center text-xs">
                  🔒
                </div>
                <span className="text-[11px] font-medium text-[#191c1d]">
                  Admin
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Acciones */}
        {isRechazada && (
          <OfertaRechazadaActions oferta={oferta} />
        )}
      </div>
    </div>
  );
}