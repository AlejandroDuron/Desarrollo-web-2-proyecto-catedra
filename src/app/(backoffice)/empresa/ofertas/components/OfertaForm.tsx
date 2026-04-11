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
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#e1e3e4]">
          <h2 className="text-xl font-black tracking-tight text-[#191c1d]">
            {step === "form"    && "Nueva Oferta"}
            {step === "warning" && "Confirmar Oferta"}
            {step === "success" && "¡Oferta Enviada!"}
          </h2>
          <button
            onClick={handleClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#f3f4f5] text-[#454935] transition-colors font-bold"
          >
            ✕
          </button>
        </div>

        <div className="px-6 py-6 max-h-[75vh] overflow-y-auto">

          {/* ── Paso 1: Formulario ── */}
          {step === "form" && (
            <form onSubmit={handleSubmit} className="space-y-5">

              <Field label="Título" error={errors.titulo}>
                <input
                  type="text"
                  placeholder="Ej. Pack Smart Home"
                  value={values.titulo}
                  onChange={(e) => handleChange("titulo", e.target.value)}
                  className="w-full rounded-lg border border-[#e1e3e4] bg-[#f3f4f5] px-4 py-3 text-[#191c1d] outline-none transition focus:border-[#b1d424] focus:bg-white"
                />
              </Field>

              <Field label="Descripción" error={errors.descripcion}>
                <textarea
                  placeholder="Describe la oferta..."
                  rows={3}
                  value={values.descripcion}
                  onChange={(e) => handleChange("descripcion", e.target.value)}
                  className="w-full rounded-lg border border-[#e1e3e4] bg-[#f3f4f5] px-4 py-3 text-[#191c1d] outline-none transition focus:border-[#b1d424] focus:bg-white resize-none"
                />
              </Field>

              <Field label="Otros detalles (opcional)" error={errors.otros_detalles}>
                <textarea
                  placeholder="Términos, condiciones, instrucciones adicionales..."
                  rows={2}
                  value={values.otros_detalles ?? ""}
                  onChange={(e) => handleChange("otros_detalles", e.target.value)}
                  className="w-full rounded-lg border border-[#e1e3e4] bg-[#f3f4f5] px-4 py-3 text-[#191c1d] outline-none transition focus:border-[#b1d424] focus:bg-white resize-none"
                />
              </Field>

              {/* Precios */}
              <div className="grid grid-cols-2 gap-4">
                <Field label="Precio Regular ($)" error={errors.precio_regular}>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={values.precio_regular === 0 ? "" : String(values.precio_regular)}
                    onChange={(e) => handleChange("precio_regular", e.target.value)}
                    className="w-full rounded-lg border border-[#e1e3e4] bg-[#f3f4f5] px-4 py-3 text-[#191c1d] outline-none transition focus:border-[#b1d424] focus:bg-white"
                  />
                </Field>
                <Field label="Precio Oferta ($)" error={errors.precio_oferta}>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={values.precio_oferta === 0 ? "" : String(values.precio_oferta)}
                    onChange={(e) => handleChange("precio_oferta", e.target.value)}
                    className="w-full rounded-lg border border-[#e1e3e4] bg-[#f3f4f5] px-4 py-3 text-[#191c1d] outline-none transition focus:border-[#b1d424] focus:bg-white"
                  />
                </Field>
              </div>

              {/* Stock y límite */}
              <div className="grid grid-cols-2 gap-4">
                <Field label="Total de Cupones" error={errors.total_cupones}>
                  <input
                    type="number"
                    min="1"
                    placeholder="Ej. 100"
                    value={values.total_cupones === 0 ? "" : String(values.total_cupones)}
                    onChange={(e) => handleChange("total_cupones", e.target.value)}
                    className="w-full rounded-lg border border-[#e1e3e4] bg-[#f3f4f5] px-4 py-3 text-[#191c1d] outline-none transition focus:border-[#b1d424] focus:bg-white"
                  />
                </Field>
                <Field label="Límite por Cliente (opcional)" error={errors.cantidad_limite}>
                  <input
                    type="number"
                    min="1"
                    placeholder="Ej. 2"
                    value={values.cantidad_limite ?? ""}
                    onChange={(e) => handleChange("cantidad_limite", e.target.value)}
                    className="w-full rounded-lg border border-[#e1e3e4] bg-[#f3f4f5] px-4 py-3 text-[#191c1d] outline-none transition focus:border-[#b1d424] focus:bg-white"
                  />
                </Field>
              </div>

              {/* Fechas */}
              <div className="grid grid-cols-2 gap-4">
                <Field label="Fecha de Inicio" error={errors.fecha_inicio}>
                  <input
                    type="date"
                    value={values.fecha_inicio}
                    onChange={(e) => handleChange("fecha_inicio", e.target.value)}
                    className="w-full rounded-lg border border-[#e1e3e4] bg-[#f3f4f5] px-4 py-3 text-[#191c1d] outline-none transition focus:border-[#b1d424] focus:bg-white"
                  />
                </Field>
                <Field label="Fecha de Fin" error={errors.fecha_fin}>
                  <input
                    type="date"
                    value={values.fecha_fin}
                    onChange={(e) => handleChange("fecha_fin", e.target.value)}
                    className="w-full rounded-lg border border-[#e1e3e4] bg-[#f3f4f5] px-4 py-3 text-[#191c1d] outline-none transition focus:border-[#b1d424] focus:bg-white"
                  />
                </Field>
              </div>

              <Field label="Fecha Límite de Uso" error={errors.fecha_limite_uso}>
                <input
                  type="date"
                  value={values.fecha_limite_uso}
                  onChange={(e) => handleChange("fecha_limite_uso", e.target.value)}
                  className="w-full rounded-lg border border-[#e1e3e4] bg-[#f3f4f5] px-4 py-3 text-[#191c1d] outline-none transition focus:border-[#b1d424] focus:bg-white"
                />
                <span className="mt-1 text-xs text-[#757963]">
                  Debe ser igual o posterior a la fecha de fin.
                </span>
              </Field>

              <Field label="URL de Imagen (opcional)" error={errors.imagen_url}>
                <input
                  type="url"
                  placeholder="https://..."
                  value={values.imagen_url ?? ""}
                  onChange={(e) => handleChange("imagen_url", e.target.value)}
                  className="w-full rounded-lg border border-[#e1e3e4] bg-[#f3f4f5] px-4 py-3 text-[#191c1d] outline-none transition focus:border-[#b1d424] focus:bg-white"
                />
              </Field>

              <button
                type="submit"
                className="w-full rounded-lg bg-[linear-gradient(135deg,#CCF143_0%,#D9FF50_100%)] px-4 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-[#171e00] transition hover:brightness-[0.98]"
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

              <div className="bg-[#f3f4f5] rounded-xl p-4 flex flex-col gap-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#757963] mb-1">Resumen</p>
                <Row label="Título"           value={values.titulo} />
                <Row label="Descripción"      value={values.descripcion} />
                {values.otros_detalles && (
                  <Row label="Otros detalles" value={values.otros_detalles} />
                )}
                <Row label="Precio Regular"   value={`$${Number(values.precio_regular).toFixed(2)}`} />
                <Row label="Precio Oferta"    value={`$${Number(values.precio_oferta).toFixed(2)}`} />
                <Row label="Total Cupones"    value={String(values.total_cupones)} />
                {values.cantidad_limite && (
                  <Row label="Límite por Cliente" value={String(values.cantidad_limite)} />
                )}
                <Row label="Inicio"           value={values.fecha_inicio} />
                <Row label="Fin"              value={values.fecha_fin} />
                <Row label="Límite de Uso"    value={values.fecha_limite_uso} />
                {values.imagen_url && (
                  <Row label="Imagen"         value={values.imagen_url} />
                )}
              </div>

              {serverError && (
                <p className="rounded-lg border border-[#ffdad6] bg-[#fff5f4] px-4 py-3 text-sm text-[#ba1a1a]">
                  {serverError}
                </p>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setStep("form")}
                  disabled={loading}
                  className="flex-1 rounded-lg border border-[#e1e3e4] px-4 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-[#454935] transition hover:bg-[#f3f4f5] disabled:opacity-50"
                >
                  Revisar
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={loading}
                  className="flex-1 rounded-lg bg-[linear-gradient(135deg,#CCF143_0%,#D9FF50_100%)] px-4 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-[#171e00] transition hover:brightness-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Enviando..." : "Confirmar"}
                </button>
              </div>
            </div>
          )}

          {/* ── Paso 3: Éxito ── */}
          {step === "success" && (
            <div className="flex flex-col items-center gap-4 py-8 text-center">
              <div className="w-16 h-16 rounded-full bg-[#D9FF50] flex items-center justify-center text-3xl font-black text-[#171e00]">
                ✓
              </div>
              <h3 className="text-lg font-black text-[#191c1d]">¡Oferta enviada!</h3>
              <p className="text-sm text-[#757963]">
                Tu oferta está en espera de aprobación por el administrador.
              </p>
              <button
                onClick={handleClose}
                className="mt-2 rounded-lg bg-[linear-gradient(135deg,#CCF143_0%,#D9FF50_100%)] px-6 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-[#171e00] transition hover:brightness-[0.98]"
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
    <div className="flex flex-col">
      <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-[#757963]">
        {label}
      </label>
      {children}
      {error && <span className="mt-1 text-xs text-[#ba1a1a]">{error}</span>}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-start gap-4 text-sm">
      <span className="text-[#757963] font-medium shrink-0">{label}</span>
      <span className="font-bold text-[#191c1d] text-right break-all">{value}</span>
    </div>
  );
}