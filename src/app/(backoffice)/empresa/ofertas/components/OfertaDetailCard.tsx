"use client";

import { type OfertaConMetricas } from "../actions";
import OfertaRechazadaActions from "./OfertaRechazadaActions";

const fmtMoney = (n: number) =>
  `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString("es-SV", { day: "2-digit", month: "long", year: "numeric" });

export default function OfertaDetailCard({ oferta }: { oferta: OfertaConMetricas }) {
  const descuento = oferta.precio_regular > 0
    ? Math.round((1 - oferta.precio_oferta / oferta.precio_regular) * 100)
    : null;

  const isRechazada       = oferta.categoria === "rechazadas";
  const isDescartada      = oferta.categoria === "descartadas";
  const showJustificacion = (isRechazada || isDescartada) && oferta.justificacion_rechazo;

  return (
    <div style={{
      background: "white", borderRadius: 16, overflow: "hidden",
      border: "1px solid #EDEEEF", boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
    }}>

      {/* ── Imagen hero ── */}
      <div style={{
        position: "relative", width: "100%", aspectRatio: "21/6",
        overflow: "hidden", background: "#f3f4f5",
        filter: isRechazada || isDescartada ? "grayscale(0.5)" : "none",
      }}>
        {oferta.image_url ? (
          <>
            <img
              src={oferta.image_url}
              alt={oferta.titulo}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            <div style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(to top, rgba(0,0,0,0.4), transparent)",
            }} />
          </>
        ) : (
          <div style={{
            width: "100%", height: "100%",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 48, color: "#e1e3e4",
          }}>
            🏷️
          </div>
        )}

        {isRechazada && (
          <div style={{ position: "absolute", top: 16, right: 16 }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              background: "#ba1a1a", color: "white",
              padding: "8px 16px", borderRadius: 999,
              fontWeight: 700, fontSize: 13, boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            }}>
              ✕ RECHAZADA
            </div>
          </div>
        )}
        {isDescartada && (
          <div style={{ position: "absolute", top: 16, right: 16 }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              background: "#454935", color: "white",
              padding: "8px 16px", borderRadius: 999,
              fontWeight: 700, fontSize: 13,
            }}>
              ✕ DESCARTADA
            </div>
          </div>
        )}
      </div>

      {/* ── Contenido ── */}
      <div style={{ padding: 32, display: "flex", flexDirection: "column", gap: 24 }}>

        {/* Título y precios */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 24, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <h2 style={{ fontSize: 24, fontWeight: 900, color: "#191c1d", margin: 0, lineHeight: 1.2, letterSpacing: "-0.02em" }}>
              {oferta.titulo}
            </h2>
            {oferta.descripcion && (
              <p style={{ fontSize: 14, color: "#454935", marginTop: 8, lineHeight: 1.6, margin: "8px 0 0 0" }}>
                {oferta.descripcion}
              </p>
            )}
          </div>

          <div style={{ textAlign: "right", flexShrink: 0 }}>
            {oferta.precio_regular > 0 && (
              <p style={{ fontSize: 14, fontWeight: 700, textDecoration: "line-through", color: "#9ea3a6", margin: 0 }}>
                {fmtMoney(oferta.precio_regular)}
              </p>
            )}
            <p style={{ fontSize: 32, fontWeight: 900, color: "#526600", margin: 0, letterSpacing: "-0.02em" }}>
              {fmtMoney(oferta.precio_oferta)}
            </p>
            {descuento && (
              <span style={{
                display: "inline-block", marginTop: 8,
                padding: "4px 12px", background: "#526600",
                color: "white", fontWeight: 700, fontSize: 12,
                letterSpacing: "0.1em", textTransform: "uppercase", borderRadius: 6,
              }}>
                {descuento}% OFF
              </span>
            )}
          </div>
        </div>

        {/* ── Datos principales + Justificación ── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 24,
          paddingTop: 24,
          borderTop: "1px solid #EDEEEF",
        }}>

          {/* Columna izquierda */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

            {/* Vigencia — solo para no rechazadas/descartadas */}
            {!isRechazada && !isDescartada && (
              <div>
                <p style={{
                  fontSize: 10, fontWeight: 700, textTransform: "uppercase",
                  letterSpacing: "0.12em", color: "#454935", margin: "0 0 8px 0",
                }}>
                  Vigencia
                </p>
                <InfoRow label="Fecha de inicio" value={fmtDate(oferta.fecha_inicio)} />
                <InfoRow label="Fecha de fin"     value={fmtDate(oferta.fecha_fin)} />
                <InfoRow label="Límite de uso"    value={fmtDate(oferta.fecha_limite_uso)} />
              </div>
            )}

            {/* Cupones — solo para no rechazadas/descartadas */}
            {!isRechazada && !isDescartada && (
              <div>
                <p style={{
                  fontSize: 10, fontWeight: 700, textTransform: "uppercase",
                  letterSpacing: "0.12em", color: "#454935", margin: "0 0 8px 0",
                }}>
                  Cupones
                </p>
                <InfoRow label="Stock total"      value={oferta.stock.toLocaleString("en-US")} />
                {oferta.cantidad_limite != null && (
                  <InfoRow label="Límite por cliente" value={String(oferta.cantidad_limite)} />
                )}
                <InfoRow label="Vendidos"         value={oferta.cupones_vendidos.toLocaleString("en-US")} />
                <InfoRow label="Disponibles"      value={oferta.cupones_disponibles.toLocaleString("en-US")} />
                <InfoRow label="Ingresos totales" value={fmtMoney(oferta.ingresos_totales)} />
                <InfoRow
                  label={`Comisión (${oferta.porcentaje_comision}%)`}
                  value={fmtMoney(oferta.cargo_servicio)}
                />
              </div>
            )}

            {/* Términos y condiciones */}
            {oferta.otros_detalles && (
              <div>
                <p style={{
                  fontSize: 10, fontWeight: 700, textTransform: "uppercase",
                  letterSpacing: "0.12em", color: "#454935", margin: "0 0 8px 0",
                }}>
                  Términos y Condiciones
                </p>
                <p style={{ fontSize: 13, color: "#454935", lineHeight: 1.7, whiteSpace: "pre-line", margin: 0 }}>
                  {oferta.otros_detalles}
                </p>
              </div>
            )}
          </div>

          {/* Columna derecha */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

            {/* Vigencia para rechazadas/descartadas */}
            {(isRechazada || isDescartada) && (
              <div>
                <p style={{
                  fontSize: 10, fontWeight: 700, textTransform: "uppercase",
                  letterSpacing: "0.12em", color: "#454935", margin: "0 0 8px 0",
                }}>
                  Vigencia
                </p>
                <InfoRow label="Fecha de inicio" value={fmtDate(oferta.fecha_inicio)} />
                <InfoRow label="Fecha de fin"     value={fmtDate(oferta.fecha_fin)} />
                <InfoRow label="Límite de uso"    value={fmtDate(oferta.fecha_limite_uso)} />
              </div>
            )}

            {/* Justificación */}
            {showJustificacion && (
              <div style={{
                padding: 20, borderRadius: 12,
                background: "rgba(255, 218, 214, 0.3)",
                border: "1px solid rgba(186, 26, 26, 0.2)",
              }}>
                <h3 style={{
                  fontSize: 12, fontWeight: 900, textTransform: "uppercase",
                  letterSpacing: "0.08em", color: "#ba1a1a", margin: "0 0 12px 0",
                }}>
                  Justificación del Rechazo
                </h3>
                <p style={{ fontSize: 13, color: "#454935", lineHeight: 1.7, fontStyle: "italic", margin: 0 }}>
                  "{oferta.justificacion_rechazo}"
                </p>
                <div style={{
                  marginTop: 16, paddingTop: 16,
                  borderTop: "1px solid rgba(186,26,26,0.1)",
                  display: "flex", alignItems: "center", gap: 10,
                }}>
                  <p style={{
                    fontSize: 11, fontWeight: 700, textTransform: "uppercase",
                    letterSpacing: "0.1em", color: "#191c1d", margin: 0,
                  }}>
                    Admin de Plataforma
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Acciones — solo rechazadas */}
        {isRechazada && (
          <OfertaRechazadaActions oferta={oferta} />
        )}

      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{
      display: "flex", justifyContent: "space-between",
      alignItems: "center", padding: "8px 0",
      borderBottom: "1px solid #f3f4f5",
    }}>
      <span style={{ fontSize: 13, color: "#454935" }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 700, color: "#191c1d" }}>{value}</span>
    </div>
  );
}