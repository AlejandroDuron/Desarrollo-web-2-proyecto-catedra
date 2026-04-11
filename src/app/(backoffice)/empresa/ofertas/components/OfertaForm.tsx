"use client";

import { useState } from "react";
import { ofertaSchema, ofertaInitialValues, type OfertaFormValues } from "../schema";
import { crearOferta } from "../actions";

interface OfertaFormProps {
  open:    boolean;
  onClose: () => void;
}

type Step = "form" | "warning" | "success";

export default function OfertaForm({ open, onClose }: OfertaFormProps) {
  const [step, setStep]               = useState<Step>("form");
  const [values, setValues]           = useState<OfertaFormValues>(ofertaInitialValues);
  const [errors, setErrors]           = useState<Partial<Record<keyof OfertaFormValues, string>>>({});
  const [loading, setLoading]         = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  if (!open) return null;

  const handleChange = (field: keyof OfertaFormValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  // Valida y avanza al paso de advertencia
  const handleSubmit = (e: React.FormEvent) => {
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

  // Confirma y envía al servidor
  const handleConfirm = async () => {
    setLoading(true);
    setServerError(null);
    try {
      const formData = new FormData();
      Object.entries(values).forEach(([k, v]) => {
        if (v !== undefined && v !== "") formData.append(k, String(v));
      });
      const result = await crearOferta(formData);
      if ("error" in result) {
        setServerError("Ocurrió un error al crear la oferta. Intenta de nuevo.");
        setStep("warning");
      } else {
        setStep("success");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep("form");
    setValues(ofertaInitialValues);
    setErrors({});
    setServerError(null);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#191C1D]/50 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
    >
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">

        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#EDEEEF]">
          <h2 className="text-xl font-black tracking-tight text-[#191C1D]">
            {step === "form"    && "Nueva Oferta"}
            {step === "warning" && "Confirmar Oferta"}
            {step === "success" && "¡Oferta Enviada!"}
          </h2>
          <button
            onClick={handleClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#F3F4F5] text-[#454935] transition-colors font-bold"
          >
            ✕
          </button>
        </div>

        <div className="px-6 py-6 max-h-[75vh] overflow-y-auto">

          {/* ── Paso 1: Formulario ── */}
          {step === "form" && (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <Field label="Título" error={errors.titulo}>
                <input
                  type="text"
                  placeholder="Ej. Pack Smart Home"
                  value={String(values.titulo)}
                  onChange={(e) => handleChange("titulo", e.target.value)}
                  className="input-field"
                />
              </Field>

              <Field label="Descripción" error={errors.descripcion}>
                <textarea
                  placeholder="Describe la oferta..."
                  rows={3}
                  value={String(values.descripcion)}
                  onChange={(e) => handleChange("descripcion", e.target.value)}
                  className="input-field resize-none"
                />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Precio ($)" error={errors.precio_oferta}>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={String(values.precio_oferta)}
                    onChange={(e) => handleChange("precio_oferta", e.target.value)}
                    className="input-field"
                  />
                </Field>
                <Field label="Total de Cupones" error={errors.total_cupones}>
                  <input
                    type="number"
                    min="1"
                    placeholder="100"
                    value={String(values.total_cupones)}
                    onChange={(e) => handleChange("total_cupones", e.target.value)}
                    className="input-field"
                  />
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Fecha de Inicio" error={errors.fecha_inicio}>
                  <input
                    type="date"
                    value={String(values.fecha_inicio)}
                    onChange={(e) => handleChange("fecha_inicio", e.target.value)}
                    className="input-field"
                  />
                </Field>
                <Field label="Fecha de Fin" error={errors.fecha_fin}>
                  <input
                    type="date"
                    value={String(values.fecha_fin)}
                    onChange={(e) => handleChange("fecha_fin", e.target.value)}
                    className="input-field"
                  />
                </Field>
              </div>

              <Field label="URL de Imagen (opcional)" error={errors.imagen_url}>
                <input
                  type="url"
                  placeholder="https://..."
                  value={String(values.imagen_url ?? "")}
                  onChange={(e) => handleChange("imagen_url", e.target.value)}
                  className="input-field"
                />
              </Field>

              <button
                type="submit"
                className="w-full py-3 bg-[#D9FF50] text-[#171E00] text-xs font-bold uppercase tracking-widest rounded-lg hover:opacity-90 transition-opacity"
              >
                Revisar y Enviar
              </button>
            </form>
          )}

          {/* ── Paso 2: Advertencia ── */}
          {step === "warning" && (
            <div className="flex flex-col gap-5">
              <div className="flex gap-3 p-4 rounded-xl bg-[#FFF9C4] border border-[#F0D800]">
                <span className="text-xl shrink-0">⚠️</span>
                <div>
                  <p className="text-sm font-bold text-[#5C4A00] mb-1">
                    ¿Estás seguro de enviar esta oferta?
                  </p>
                  <p className="text-xs text-[#7A6200] leading-relaxed">
                    Una vez enviada, <strong>los datos no podrán ser modificados</strong>. La oferta quedará en espera de revisión por el administrador.
                  </p>
                </div>
              </div>

              <div className="bg-[#F3F4F5] rounded-xl p-4 flex flex-col gap-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#454935] mb-1">Resumen</p>
                <Row label="Título"       value={String(values.titulo)} />
                <Row label="Descripción"  value={String(values.descripcion)} />
                <Row label="Precio"       value={`$${values.precio_oferta}`} />
                <Row label="Cupones"      value={String(values.total_cupones)} />
                <Row label="Inicio"       value={String(values.fecha_inicio)} />
                <Row label="Fin"          value={String(values.fecha_fin)} />
                {values.imagen_url && <Row label="Imagen" value={String(values.imagen_url)} />}
              </div>

              {serverError && (
                <p className="text-xs text-center text-[#ba1a1a]">{serverError}</p>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setStep("form")}
                  disabled={loading}
                  className="flex-1 py-3 border border-[#EDEEEF] text-[#454935] text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-[#F3F4F5] transition-colors disabled:opacity-50"
                >
                  Revisar
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={loading}
                  className="flex-1 py-3 bg-[#D9FF50] text-[#171E00] text-xs font-bold uppercase tracking-widest rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Enviando..." : "Confirmar"}
                </button>
              </div>
            </div>
          )}

          {/* ── Paso 3: Éxito ── */}
          {step === "success" && (
            <div className="flex flex-col items-center gap-4 py-8 text-center">
              <div className="w-16 h-16 rounded-full bg-[#D9FF50] flex items-center justify-center text-3xl font-black text-[#171E00]">
                ✓
              </div>
              <h3 className="text-lg font-black text-[#191C1D]">¡Oferta enviada!</h3>
              <p className="text-sm text-[#454935]">
                Tu oferta está en espera de aprobación por el administrador.
              </p>
              <button
                onClick={handleClose}
                className="mt-2 px-6 py-3 bg-[#D9FF50] text-[#171E00] text-xs font-bold uppercase tracking-widest rounded-lg hover:opacity-90 transition-opacity"
              >
                Cerrar
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

function Field({ label, error, children }: {
  label:    string;
  error?:   string;
  children: React.ReactNode;
}) {
  return (
    <div className="input-group">
      <label>{label}</label>
      {children}
      {error && <span className="text-xs text-[#ba1a1a] mt-1">{error}</span>}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-start gap-4 text-sm">
      <span className="text-[#454935] font-medium shrink-0">{label}</span>
      <span className="font-bold text-[#191C1D] text-right break-all">{value}</span>
    </div>
  );
}