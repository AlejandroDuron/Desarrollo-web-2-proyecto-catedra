"use client";

import { useState } from "react";
import { ofertaSchema, ofertaInitialValues, type OfertaFormValues } from "../schema";
import { crearOferta } from "../actions";

export default function OfertaForm({ onSuccess }: { onSuccess?: () => void }) {
  const [values, setValues]   = useState<OfertaFormValues>(ofertaInitialValues);
  const [errors, setErrors]   = useState<Partial<Record<keyof OfertaFormValues, string>>>({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const handleChange = (field: keyof OfertaFormValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
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

    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(parsed.data).forEach(([k, v]) => {
        if (v !== undefined) formData.append(k, String(v));
      });
      const result = await crearOferta(formData);
      if ("error" in result) {
        setServerError("Ocurrió un error al crear la oferta. Intenta de nuevo.");
      } else {
        setValues(ofertaInitialValues);
        setErrors({});
        onSuccess?.();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
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
          className="input-field resize-y"
        />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Precio ($)" error={errors.precio}>
          <input
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            value={String(values.precio)}
            onChange={(e) => handleChange("precio", e.target.value)}
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

      {serverError && (
        <p className="text-xs text-center text-[#ba1a1a]">{serverError}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-[#D9FF50] text-[#171E00] text-xs font-bold uppercase tracking-widest rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Enviando..." : "Crear Oferta"}
      </button>
    </form>
  );
}

function Field({ label, error, children }: {
  label: string;
  error?: string;
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