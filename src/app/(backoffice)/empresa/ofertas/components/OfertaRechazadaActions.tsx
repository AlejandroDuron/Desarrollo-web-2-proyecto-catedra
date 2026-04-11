"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { descartarOferta, editarOfertaRechazada } from "../actions";
import { ofertaSchema, type OfertaFormValues } from "../schema";
import { type OfertaConMetricas } from "../actions";

interface OfertaRechazadaActionsProps {
  oferta: OfertaConMetricas;
}

type Step = "form" | "warning" | "success";

export default function OfertaRechazadaActions({ oferta }: OfertaRechazadaActionsProps) {
  const router = useRouter();

  // ── Descartar ──
  const [loadingDescartar, setLoadingDescartar] = useState(false);
  const [errorDescartar, setErrorDescartar]     = useState<string | null>(null);

  // ── Modal editar ──
  const [modalOpen, setModalOpen] = useState(false);
  const [step, setStep]           = useState<Step>("form");
  const [values, setValues]       = useState<OfertaFormValues>({
    titulo:           oferta.titulo,
    descripcion:      oferta.descripcion ?? "",
    otros_detalles:   oferta.otros_detalles ?? "",
    precio_regular:   oferta.precio_regular,
    precio_oferta:    oferta.precio_oferta,
    total_cupones:    oferta.stock,
    fecha_inicio:     oferta.fecha_inicio,
    fecha_fin:        oferta.fecha_fin,
    fecha_limite_uso: oferta.fecha_limite_uso,
    imagen_url:       oferta.image_url ?? "",
    cantidad_limite:  oferta.cantidad_limite ?? undefined,
  });
  const [errors, setErrors]           = useState<Partial<Record<keyof OfertaFormValues, string>>>({});
  const [loadingEditar, setLoadingEditar] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const handleChange = (field: keyof OfertaFormValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    const parsed = ofertaSchema.safeParse(values);
    if (!parsed.success) {
      const fieldErrors: Partial<Record<keyof OfertaFormValues, string>> = {};
      for (const [key, msgs] of Object.entries(parsed.error.flatten().fieldErrors)) {
        fieldErrors[key as keyof OfertaFormValues] = (msgs as string[])[0];
      }
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setStep("warning");
  };

  const handleConfirm = async () => {
    setLoadingEditar(true);
    setServerError(null);
    try {
      const formData = new FormData();
      Object.entries(values).forEach(([k, v]) => {
        if (v !== undefined && v !== "") formData.append(k, String(v));
      });
      const result = await editarOfertaRechazada(oferta.id, formData);
      if ("error" in result) {
        setServerError("Ocurrió un error al enviar la oferta. Intenta de nuevo.");
        setStep("form");
      } else {
        setStep("success");
      }
    } finally {
      setLoadingEditar(false);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setStep("form");
    setErrors({});
    setServerError(null);
    if (step === "success") router.push("/empresa/ofertas");
  };

  const handleDescartar = async () => {
    if (!confirm("¿Estás seguro de descartar esta oferta? Esta acción no se puede revertir.")) return;
    setLoadingDescartar(true);
    setErrorDescartar(null);
    try {
      const result = await descartarOferta(oferta.id);
      if ("error" in result) {
        setErrorDescartar(typeof result.error === "string" ? result.error : "Error al descartar.");
      } else {
        router.push("/empresa/ofertas");
      }
    } finally {
      setLoadingDescartar(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "10px 14px",
    borderRadius: 8, border: "1px solid #e1e3e4",
    background: "#f3f4f5", fontSize: 14,
    color: "#191c1d", outline: "none",
    fontFamily: "inherit", boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    display: "block", fontSize: 10, fontWeight: 700,
    textTransform: "uppercase", letterSpacing: "0.18em",
    color: "#757963", marginBottom: 6,
  };

  return (
    <>
      {/* ── Botones ── */}
      <div style={{ paddingTop: 24, borderTop: "1px solid #EDEEEF", display: "flex", flexDirection: "column", gap: 12 }}>
        {errorDescartar && (
          <p style={{ fontSize: 13, color: "#ba1a1a", textAlign: "center" }}>{errorDescartar}</p>
        )}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <button
            onClick={() => setModalOpen(true)}
            disabled={loadingDescartar}
            style={{
              flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
              gap: 8, padding: "14px 24px", background: "#526600", color: "white",
              fontWeight: 700, fontSize: 13, textTransform: "uppercase", letterSpacing: "0.1em",
              borderRadius: 12, border: "none", cursor: "pointer", opacity: loadingDescartar ? 0.5 : 1,
            }}
          >
            ✏️ Editar y Enviar Nuevamente
          </button>
          <button
            onClick={handleDescartar}
            disabled={loadingDescartar}
            style={{
              flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
              gap: 8, padding: "14px 24px", background: "transparent",
              color: "#ba1a1a", fontWeight: 700, fontSize: 13,
              textTransform: "uppercase", letterSpacing: "0.1em",
              borderRadius: 12, border: "1px solid rgba(186,26,26,0.5)",
              cursor: loadingDescartar ? "not-allowed" : "pointer",
              opacity: loadingDescartar ? 0.5 : 1,
            }}
          >
            {loadingDescartar ? "Descartando..." : "🗑️ Descartar Oferta"}
          </button>
        </div>
      </div>

      {/* ── Modal ── */}
      {modalOpen && (
        <div
          onClick={(e) => { if (e.target === e.currentTarget) handleCloseModal(); }}
          style={{
            position: "fixed", inset: 0, zIndex: 50,
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: 16, background: "rgba(25,28,29,0.5)", backdropFilter: "blur(4px)",
          }}
        >
          <div style={{
            width: "100%", maxWidth: 520, background: "white",
            borderRadius: 16, overflow: "hidden", boxShadow: "0 24px 48px rgba(0,0,0,0.2)",
          }}>

            {/* Header */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "20px 24px", borderBottom: "1px solid #e1e3e4",
            }}>
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 900, color: "#191c1d" }}>
                {step === "form"    && "Editar Oferta"}
                {step === "warning" && "Confirmar Cambios"}
                {step === "success" && "¡Oferta Enviada!"}
              </h2>
              <button
                onClick={handleCloseModal}
                style={{
                  width: 32, height: 32, borderRadius: "50%", border: "none",
                  background: "transparent", cursor: "pointer", fontSize: 16,
                  color: "#454935", display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div style={{ padding: "24px", maxHeight: "75vh", overflowY: "auto" }}>

              {/* Paso 1: Formulario */}
              {step === "form" && (
                <form onSubmit={handleSubmitForm} style={{ display: "flex", flexDirection: "column", gap: 16 }}>

                  <div>
                    <label style={labelStyle}>Título</label>
                    <input style={inputStyle} type="text" value={values.titulo}
                      onChange={(e) => handleChange("titulo", e.target.value)} />
                    {errors.titulo && <span style={{ fontSize: 11, color: "#ba1a1a" }}>{errors.titulo}</span>}
                  </div>

                  <div>
                    <label style={labelStyle}>Descripción</label>
                    <textarea style={{ ...inputStyle, resize: "none" }} rows={3} value={values.descripcion}
                      onChange={(e) => handleChange("descripcion", e.target.value)} />
                    {errors.descripcion && <span style={{ fontSize: 11, color: "#ba1a1a" }}>{errors.descripcion}</span>}
                  </div>

                  <div>
                    <label style={labelStyle}>Otros detalles (opcional)</label>
                    <textarea style={{ ...inputStyle, resize: "none" }} rows={2} value={values.otros_detalles ?? ""}
                      onChange={(e) => handleChange("otros_detalles", e.target.value)} />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div>
                      <label style={labelStyle}>Precio Regular ($)</label>
                      <input style={inputStyle} type="number" min="0" step="0.01"
                        value={values.precio_regular === 0 ? "" : String(values.precio_regular)}
                        onChange={(e) => handleChange("precio_regular", e.target.value)} />
                      {errors.precio_regular && <span style={{ fontSize: 11, color: "#ba1a1a" }}>{errors.precio_regular}</span>}
                    </div>
                    <div>
                      <label style={labelStyle}>Precio Oferta ($)</label>
                      <input style={inputStyle} type="number" min="0" step="0.01"
                        value={values.precio_oferta === 0 ? "" : String(values.precio_oferta)}
                        onChange={(e) => handleChange("precio_oferta", e.target.value)} />
                      {errors.precio_oferta && <span style={{ fontSize: 11, color: "#ba1a1a" }}>{errors.precio_oferta}</span>}
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div>
                      <label style={labelStyle}>Total de Cupones</label>
                      <input style={inputStyle} type="number" min="1"
                        value={values.total_cupones === 0 ? "" : String(values.total_cupones)}
                        onChange={(e) => handleChange("total_cupones", e.target.value)} />
                      {errors.total_cupones && <span style={{ fontSize: 11, color: "#ba1a1a" }}>{errors.total_cupones}</span>}
                    </div>
                    <div>
                      <label style={labelStyle}>Límite por Cliente (opcional)</label>
                      <input style={inputStyle} type="number" min="1"
                        value={values.cantidad_limite ?? ""}
                        onChange={(e) => handleChange("cantidad_limite", e.target.value)} />
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div>
                      <label style={labelStyle}>Fecha de Inicio</label>
                      <input style={inputStyle} type="date" value={values.fecha_inicio}
                        onChange={(e) => handleChange("fecha_inicio", e.target.value)} />
                      {errors.fecha_inicio && <span style={{ fontSize: 11, color: "#ba1a1a" }}>{errors.fecha_inicio}</span>}
                    </div>
                    <div>
                      <label style={labelStyle}>Fecha de Fin</label>
                      <input style={inputStyle} type="date" value={values.fecha_fin}
                        onChange={(e) => handleChange("fecha_fin", e.target.value)} />
                      {errors.fecha_fin && <span style={{ fontSize: 11, color: "#ba1a1a" }}>{errors.fecha_fin}</span>}
                    </div>
                  </div>

                  <div>
                    <label style={labelStyle}>Fecha Límite de Uso</label>
                    <input style={inputStyle} type="date" value={values.fecha_limite_uso}
                      onChange={(e) => handleChange("fecha_limite_uso", e.target.value)} />
                    {errors.fecha_limite_uso && <span style={{ fontSize: 11, color: "#ba1a1a" }}>{errors.fecha_limite_uso}</span>}
                  </div>

                  <div>
                    <label style={labelStyle}>URL de Imagen (opcional)</label>
                    <input style={inputStyle} type="url" placeholder="https://..."
                      value={values.imagen_url ?? ""}
                      onChange={(e) => handleChange("imagen_url", e.target.value)} />
                  </div>

                  <button type="submit" style={{
                    width: "100%", padding: "12px", borderRadius: 8, border: "none",
                    background: "linear-gradient(135deg, #CCF143 0%, #D9FF50 100%)",
                    color: "#171e00", fontWeight: 700, fontSize: 12,
                    textTransform: "uppercase", letterSpacing: "0.12em", cursor: "pointer",
                  }}>
                    Revisar y Enviar
                  </button>
                </form>
              )}

              {/* Paso 2: Confirmación */}
              {step === "warning" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div style={{
                    display: "flex", gap: 12, padding: 16, borderRadius: 12,
                    background: "#FFF9C4", border: "1px solid #F0D800",
                  }}>
                    <span style={{ fontSize: 20, flexShrink: 0 }}>⚠️</span>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 700, color: "#5C4A00", margin: "0 0 4px 0" }}>
                        ¿Estás seguro de enviar esta oferta?
                      </p>
                      <p style={{ fontSize: 12, color: "#7A6200", margin: 0, lineHeight: 1.5 }}>
                        La oferta quedará nuevamente en espera de revisión por el administrador.
                      </p>
                    </div>
                  </div>

                  {serverError && (
                    <p style={{
                      padding: "12px 16px", borderRadius: 8,
                      background: "#fff5f4", border: "1px solid #ffdad6",
                      fontSize: 13, color: "#ba1a1a", margin: 0,
                    }}>
                      {serverError}
                    </p>
                  )}

                  <div style={{ display: "flex", gap: 12 }}>
                    <button
                      onClick={() => setStep("form")}
                      disabled={loadingEditar}
                      style={{
                        flex: 1, padding: "12px", borderRadius: 8,
                        border: "1px solid #e1e3e4", background: "transparent",
                        color: "#454935", fontWeight: 700, fontSize: 12,
                        textTransform: "uppercase", letterSpacing: "0.12em",
                        cursor: "pointer", opacity: loadingEditar ? 0.5 : 1,
                      }}
                    >
                      Revisar
                    </button>
                    <button
                      onClick={handleConfirm}
                      disabled={loadingEditar}
                      style={{
                        flex: 1, padding: "12px", borderRadius: 8, border: "none",
                        background: "linear-gradient(135deg, #CCF143 0%, #D9FF50 100%)",
                        color: "#171e00", fontWeight: 700, fontSize: 12,
                        textTransform: "uppercase", letterSpacing: "0.12em",
                        cursor: loadingEditar ? "not-allowed" : "pointer",
                        opacity: loadingEditar ? 0.5 : 1,
                      }}
                    >
                      {loadingEditar ? "Enviando..." : "Confirmar"}
                    </button>
                  </div>
                </div>
              )}

              {/* Paso 3: Éxito */}
              {step === "success" && (
                <div style={{
                  display: "flex", flexDirection: "column", alignItems: "center",
                  gap: 16, padding: "32px 0", textAlign: "center",
                }}>
                  <div style={{
                    width: 64, height: 64, borderRadius: "50%",
                    background: "#D9FF50", display: "flex",
                    alignItems: "center", justifyContent: "center",
                    fontSize: 28, fontWeight: 900, color: "#171e00",
                  }}>
                    ✓
                  </div>
                  <h3 style={{ margin: 0, fontSize: 18, fontWeight: 900, color: "#191c1d" }}>
                    ¡Oferta enviada!
                  </h3>
                  <p style={{ fontSize: 14, color: "#757963", margin: 0 }}>
                    Tu oferta está nuevamente en espera de aprobación.
                  </p>
                  <button
                    onClick={handleCloseModal}
                    style={{
                      marginTop: 8, padding: "12px 24px", borderRadius: 8, border: "none",
                      background: "linear-gradient(135deg, #CCF143 0%, #D9FF50 100%)",
                      color: "#171e00", fontWeight: 700, fontSize: 12,
                      textTransform: "uppercase", letterSpacing: "0.12em", cursor: "pointer",
                    }}
                  >
                    Cerrar
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </>
  );
}