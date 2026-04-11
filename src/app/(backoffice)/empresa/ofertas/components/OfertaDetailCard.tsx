import { type OfertaConMetricas } from "../schema";
import OfertaRechazadaActions from "./OfertaRechazadaActions";

const fmtMoney = (n: number) =>
  `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString("es-SV", { day: "2-digit", month: "long", year: "numeric" });

export default function OfertaDetailCard({ oferta }: { oferta: OfertaConMetricas }) {
  const descuento = oferta.precio_regular > 0
    ? Math.round((1 - oferta.precio_oferta / oferta.precio_regular) * 100)
    : null;

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-[#EDEEEF]">

      {/* ── Imagen hero ── */}
      <div className={`relative aspect-[21/8] w-full overflow-hidden bg-[#F3F4F5] ${oferta.categoria === "rechazadas" ? "grayscale-[0.5]" : ""}`}>
        {oferta.image_url ? (
          <>
            <img
              src={oferta.image_url}
              alt={oferta.titulo}
              className="w-full h-full object-cover scale-105 hover:scale-100 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#E1E3E4] text-6xl">
            🏷️
          </div>
        )}
        {oferta.categoria === "rechazadas" && (
          <div className="absolute top-6 right-6">
            <div className="flex items-center gap-2 bg-[#ba1a1a] text-white px-6 py-2.5 rounded-full font-bold text-sm shadow-xl">
              ✕ RECHAZADA
            </div>
          </div>
        )}
      </div>

      {/* ── Contenido ── */}
      <div className="p-8 md:p-12 space-y-10">

        {/* Título y precios */}
        <div className="flex flex-col xl:flex-row justify-between items-start gap-8">
          <div className="space-y-3 max-w-3xl">
            <h2 className="text-3xl md:text-4xl font-black tracking-tighter leading-tight text-[#191C1D]">
              {oferta.titulo}
            </h2>
            {oferta.descripcion && (
              <p className="text-lg text-[#454935] leading-relaxed">{oferta.descripcion}</p>
            )}
          </div>

          <div className="shrink-0 xl:text-right space-y-1">
            {oferta.precio_regular > 0 && (
              <p className="text-xl font-bold line-through text-[#9EA3A6]">
                {fmtMoney(oferta.precio_regular)}
              </p>
            )}
            <p className="text-4xl md:text-5xl font-black tracking-tighter text-[#526600]">
              {fmtMoney(oferta.precio_oferta)}
            </p>
            {descuento && (
              <span className="inline-block px-3 py-1 bg-[#526600] text-white text-sm font-bold tracking-widest uppercase rounded-lg">
                {descuento}% OFF
              </span>
            )}
          </div>
        </div>

        {/* Datos clave */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-[#EDEEEF]">

          <InfoSection title="Vigencia">
            <InfoRow label="Fecha de inicio"    value={fmtDate(oferta.fecha_inicio)} />
            <InfoRow label="Fecha de fin"        value={fmtDate(oferta.fecha_fin)} />
            <InfoRow label="Límite de uso"       value={fmtDate(oferta.fecha_limite_uso)} />
          </InfoSection>

          <InfoSection title="Cupones">
            <InfoRow label="Stock total"         value={oferta.stock.toLocaleString("en-US")} />
            {oferta.cantidad_limite && (
              <InfoRow label="Límite por cliente" value={String(oferta.cantidad_limite)} />
            )}
            <InfoRow label="Vendidos"            value={oferta.cupones_vendidos.toLocaleString("en-US")} />
            <InfoRow label="Disponibles"         value={oferta.cupones_disponibles.toLocaleString("en-US")} />
          </InfoSection>

        </div>

        {/* Otros detalles */}
        {oferta.otros_detalles && (
          <div className="pt-6 border-t border-[#EDEEEF]">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#454935] mb-3">
              Términos y Condiciones
            </h3>
            <p className="text-sm text-[#454935] leading-relaxed whitespace-pre-line">
              {oferta.otros_detalles}
            </p>
          </div>
        )}

        {/* Justificación de rechazo */}
        {oferta.categoria === "rechazadas" && oferta.justificacion_rechazo && (
          <div className="p-8 rounded-2xl bg-[#FFDAD6]/30 border border-[#ba1a1a]/20">
            <h3 className="text-lg font-black uppercase tracking-tight text-[#ba1a1a] mb-4 flex items-center gap-2">
              ⚠️ Justificación del Rechazo
            </h3>
            <p className="text-[#454935] text-base leading-relaxed italic">
              "{oferta.justificacion_rechazo}"
            </p>
            <div className="mt-6 pt-6 border-t border-[#ba1a1a]/10 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#ba1a1a]/10 flex items-center justify-center text-sm">
                🔒
              </div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#191C1D]">
                Admin de Plataforma
              </p>
            </div>
          </div>
        )}

        {/* Acciones para oferta rechazada */}
        {oferta.categoria === "rechazadas" && (
          <OfertaRechazadaActions ofertaId={oferta.id} />
        )}

      </div>
    </div>
  );
}

function InfoSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-xs font-bold uppercase tracking-widest text-[#454935]">{title}</h3>
      <div className="flex flex-col">{children}</div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-2.5 border-b border-[#F3F4F5]">
      <span className="text-sm text-[#454935]">{label}</span>
      <span className="text-sm font-bold text-[#191C1D]">{value}</span>
    </div>
  );
}