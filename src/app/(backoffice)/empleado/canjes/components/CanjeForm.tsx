"use client";

import { useState } from "react";
import { verificarCupon, registrarCanjeFinal } from "../actions";
import { type CuponRow } from "../queries";

type Estado = "idle" | "valido" | "error";

export function CanjeForm() {
  const [codigo,  setCodigo]  = useState("");
  const [cupon,   setCupon]   = useState<CuponRow | null>(null);
  const [estado,  setEstado]  = useState<Estado>("idle");
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);
  const [canjeado, setCanjeado] = useState(false);

  const handleBuscar = async () => {
    if (!codigo.trim()) {
      setEstado("error");
      setMensaje("Por favor ingresa un código de cupón.");
      return;
    }
    setLoading(true);
    setEstado("idle");
    setCupon(null);
    setCanjeado(false);

    const res = await verificarCupon(codigo.trim().toUpperCase());
    if (res.success && res.data) {
      setCupon(res.data);
      setEstado("valido");
    } else {
      setEstado("error");
      setMensaje(res.message ?? "Cupón no encontrado.");
    }
    setLoading(false);
  };

  const handleCanje = async () => {
    if (!confirm("¿Confirmas que el DUI físico del cliente coincide con el sistema?")) return;
    setLoading(true);
    const res = await registrarCanjeFinal(codigo);
    if (res.success) {
      setCanjeado(true);
      setEstado("idle");
    } else {
      setMensaje(res.message ?? "Error al registrar el canje.");
      setEstado("error");
    }
    setLoading(false);
  };

  const handleReset = () => {
    setCodigo("");
    setCupon(null);
    setEstado("idle");
    setMensaje("");
    setCanjeado(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

      {/* ── Buscador ── */}
      <div style={{
        background: "white", borderRadius: 16,
        border: "1px solid #EDEEEF", overflow: "hidden",
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
      }}>
        <div style={{
          padding: "20px 24px", borderBottom: "1px solid #EDEEEF",
        }}>
          <p style={{
            fontSize: 10, fontWeight: 700, textTransform: "uppercase",
            letterSpacing: "0.18em", color: "#757963", margin: "0 0 12px 0",
          }}>
            Código de Cupón
          </p>
          <div style={{ display: "flex", gap: 12 }}>
            <input
              value={codigo}
              onChange={(e) => setCodigo(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === "Enter" && handleBuscar()}
              placeholder="EJ: CP-9823-XL12"
              disabled={loading}
              style={{
                flex: 1, padding: "12px 16px",
                borderRadius: 8, border: "1px solid #e1e3e4",
                background: "#f3f4f5", fontSize: 16,
                fontWeight: 700, fontFamily: "monospace",
                color: "#191c1d", outline: "none",
                letterSpacing: "0.05em",
              }}
            />
            <button
              onClick={handleBuscar}
              disabled={loading}
              style={{
                padding: "12px 28px", borderRadius: 8, border: "none",
                background: "linear-gradient(135deg, #CCF143 0%, #D9FF50 100%)",
                color: "#171e00", fontWeight: 700, fontSize: 13,
                textTransform: "uppercase", letterSpacing: "0.12em",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? "Buscando..." : "Validar"}
            </button>
          </div>

          {/* Error */}
          {estado === "error" && (
            <div style={{
              marginTop: 12, padding: "12px 16px", borderRadius: 8,
              background: "#fff5f4", border: "1px solid #ffdad6",
              fontSize: 13, color: "#ba1a1a", fontWeight: 600,
            }}>
              ✕ {mensaje}
            </div>
          )}
        </div>
      </div>

      {/* ── Canje exitoso ── */}
      {canjeado && (
        <div style={{
          padding: 32, borderRadius: 16, background: "white",
          border: "1px solid #EDEEEF", textAlign: "center",
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        }}>
          <div style={{
            width: 64, height: 64, borderRadius: "50%",
            background: "#D9FF50", display: "flex",
            alignItems: "center", justifyContent: "center",
            fontSize: 28, fontWeight: 900, color: "#171e00",
            margin: "0 auto 16px",
          }}>
            ✓
          </div>
          <h3 style={{ fontSize: 20, fontWeight: 900, color: "#191c1d", margin: "0 0 8px 0" }}>
            ¡Canje Registrado!
          </h3>
          <p style={{ fontSize: 14, color: "#757963", margin: "0 0 24px 0" }}>
            El cupón <strong style={{ fontFamily: "monospace", color: "#191c1d" }}>{codigo}</strong> fue canjeado exitosamente.
          </p>
          <button
            onClick={handleReset}
            style={{
              padding: "12px 32px", borderRadius: 8, border: "none",
              background: "linear-gradient(135deg, #CCF143 0%, #D9FF50 100%)",
              color: "#171e00", fontWeight: 700, fontSize: 13,
              textTransform: "uppercase", letterSpacing: "0.12em",
              cursor: "pointer",
            }}
          >
            Nuevo Canje
          </button>
        </div>
      )}

      {/* ── Resultado del cupón ── */}
      {cupon && !canjeado && (
        <div style={{
          background: "white", borderRadius: 16,
          border: "1px solid #EDEEEF", overflow: "hidden",
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        }}>

          {/* Banner válido */}
          <div style={{
            padding: "14px 24px",
            background: "rgba(217, 255, 80, 0.2)",
            borderBottom: "1px solid rgba(82, 102, 0, 0.15)",
            display: "flex", alignItems: "center", gap: 10,
          }}>
            <span style={{ fontSize: 18 }}>✅</span>
            <div>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#526600" }}>
                Código Válido
              </p>
              <p style={{ margin: 0, fontSize: 11, color: "#757963" }}>
                Disponible para canje inmediato
              </p>
            </div>
          </div>

          <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 20 }}>

            {/* Info oferta */}
            <div>
              <p style={{
                fontSize: 10, fontWeight: 700, textTransform: "uppercase",
                letterSpacing: "0.18em", color: "#757963", margin: "0 0 6px 0",
              }}>
                Oferta
              </p>
              <h3 style={{ fontSize: 20, fontWeight: 900, color: "#191c1d", margin: "0 0 4px 0" }}>
                {cupon.ofertas?.titulo}
              </h3>
              {cupon.ofertas?.descripcion && (
                <p style={{ fontSize: 13, color: "#454935", margin: 0, lineHeight: 1.6 }}>
                  {cupon.ofertas.descripcion}
                </p>
              )}
              {cupon.ofertas?.precio_oferta && (
                <p style={{
                  fontSize: 24, fontWeight: 900, color: "#526600",
                  margin: "8px 0 0 0", letterSpacing: "-0.02em",
                }}>
                  ${Number(cupon.ofertas.precio_oferta).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </p>
              )}
            </div>

            {/* Info cliente + botón */}
            <div style={{
              display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16,
              paddingTop: 20, borderTop: "1px solid #EDEEEF",
            }}>

              {/* Cliente */}
              <div style={{
                padding: 20, borderRadius: 12, background: "#f3f4f5",
              }}>
                <p style={{
                  fontSize: 10, fontWeight: 700, textTransform: "uppercase",
                  letterSpacing: "0.18em", color: "#757963", margin: "0 0 10px 0",
                }}>
                  Datos del Cliente
                </p>
                <p style={{ fontSize: 16, fontWeight: 800, color: "#191c1d", margin: "0 0 4px 0" }}>
                  {cupon.clientes?.nombres} {cupon.clientes?.apellidos}
                </p>
                <p style={{
                  fontSize: 20, fontWeight: 800, color: "#191c1d",
                  fontFamily: "monospace", margin: 0, letterSpacing: "0.05em",
                }}>
                  {cupon.clientes?.dui ?? "Sin DUI registrado"}
                </p>
              </div>

              {/* Confirmar */}
              <div style={{
                padding: 20, borderRadius: 12, background: "#191c1d",
                display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 12,
              }}>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", margin: 0, lineHeight: 1.6 }}>
                  El cupón quedará invalidado permanentemente al confirmar el canje.
                </p>
                <button
                  onClick={handleCanje}
                  disabled={loading}
                  style={{
                    padding: "12px", borderRadius: 8, border: "none",
                    background: "linear-gradient(135deg, #CCF143 0%, #D9FF50 100%)",
                    color: "#171e00", fontWeight: 700, fontSize: 13,
                    textTransform: "uppercase", letterSpacing: "0.12em",
                    cursor: loading ? "not-allowed" : "pointer",
                    opacity: loading ? 0.7 : 1,
                  }}
                >
                  {loading ? "Procesando..." : "✓ Confirmar Canje"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}