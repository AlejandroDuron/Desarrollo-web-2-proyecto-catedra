"use client";

import { useState } from "react";
import { empleadoSchema, empleadoUpdateSchema, type EmpleadoFormValues, type EmpleadoUpdateValues } from "../schema";
import { crearEmpleado, actualizarEmpleado } from "../actions";
import { type EmpleadoRow } from "../actions";

interface EmpleadoFormProps {
  open:      boolean;
  onClose:   () => void;
  empleado?: EmpleadoRow; // si viene → modo edición, si no → modo creación
}

type Step = "form" | "success";

export default function EmpleadoForm({ open, onClose, empleado }: EmpleadoFormProps) {
  const isEdit = !!empleado;

  const [step, setStep]               = useState<Step>("form");
  const [values, setValues]           = useState<EmpleadoFormValues>({
    nombres:   empleado?.nombres   ?? "",
    apellidos: empleado?.apellidos ?? "",
    correo:    empleado?.email     ?? "",
    password:  "",
  });
  const [errors, setErrors]           = useState<Partial<Record<keyof EmpleadoFormValues, string>>>({});
  const [loading, setLoading]         = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  if (!open) return null;

  const handleChange = (field: keyof EmpleadoFormValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    // Usar schema según modo
    const schema = isEdit ? empleadoUpdateSchema : empleadoSchema;
    const parsed = schema.safeParse(values);

    if (!parsed.success) {
      const fieldErrors: Partial<Record<keyof EmpleadoFormValues, string>> = {};
      for (const [key, msgs] of Object.entries(parsed.error.flatten().fieldErrors)) {
        fieldErrors[key as keyof EmpleadoFormValues] = (msgs as string[])[0];
      }
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(values).forEach(([k, v]) => {
        if (v !== undefined && v !== "") formData.append(k, String(v));
      });

      const result = isEdit
        ? await actualizarEmpleado(empleado!.id, formData)
        : await crearEmpleado(formData);

      if ("error" in result) {
        const err = result.error;
        setServerError(
          typeof err === "object" && "server" in err
            ? (err as any).server[0]
            : "Ocurrió un error. Intenta de nuevo."
        );
      } else {
        setStep("success");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep("form");
    setValues({
      nombres:   empleado?.nombres   ?? "",
      apellidos: empleado?.apellidos ?? "",
      correo:    empleado?.email     ?? "",
      password:  "",
    });
    setErrors({});
    setServerError(null);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#191C1D]/50 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
    >
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#EDEEEF]">
          <h2 className="text-xl font-black tracking-tight text-[#191C1D]">
            {step === "success"
              ? isEdit ? "¡Datos Actualizados!" : "¡Empleado Creado!"
              : isEdit ? "Editar Empleado" : "Nuevo Empleado"
            }
          </h2>
          <button
            onClick={handleClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#F3F4F5] text-[#454935] transition-colors font-bold"
          >
            ✕
          </button>
        </div>

        <div className="px-6 py-6">
          {step === "success" ? (
            /* ── Éxito ── */
            <div className="flex flex-col items-center gap-4 py-6 text-center">
              <div className="w-16 h-16 rounded-full bg-[#D9FF50] flex items-center justify-center text-3xl font-black text-[#171e00]">
                ✓
              </div>
              <h3 className="text-lg font-black text-[#191C1D]">
                {isEdit ? "Empleado actualizado" : "Empleado creado"}
              </h3>
              <p className="text-sm text-[#757963]">
                {isEdit
                  ? "Los cambios han sido guardados correctamente."
                  : "El empleado ya puede acceder al sistema con sus credenciales."
                }
              </p>
              <button
                onClick={handleClose}
                className="mt-2 rounded-lg bg-[linear-gradient(135deg,#CCF143_0%,#D9FF50_100%)] px-6 py-3 text-sm font-bold uppercase tracking-widest text-[#171e00] transition hover:brightness-[0.98]"
              >
                Cerrar
              </button>
            </div>
          ) : (
            /* ── Formulario ── */
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Field label="Nombres" error={errors.nombres}>
                  <input
                    type="text"
                    placeholder="Juan"
                    value={values.nombres}
                    onChange={(e) => handleChange("nombres", e.target.value)}
                    className="w-full rounded-lg border border-[#e1e3e4] bg-[#f3f4f5] px-4 py-3 text-[#191c1d] outline-none transition focus:border-[#b1d424] focus:bg-white"
                  />
                </Field>
                <Field label="Apellidos" error={errors.apellidos}>
                  <input
                    type="text"
                    placeholder="Pérez"
                    value={values.apellidos}
                    onChange={(e) => handleChange("apellidos", e.target.value)}
                    className="w-full rounded-lg border border-[#e1e3e4] bg-[#f3f4f5] px-4 py-3 text-[#191c1d] outline-none transition focus:border-[#b1d424] focus:bg-white"
                  />
                </Field>
              </div>

              <Field label="Correo Electrónico" error={errors.correo}>
                <input
                  type="email"
                  placeholder="juan@empresa.com"
                  value={values.correo}
                  onChange={(e) => handleChange("correo", e.target.value)}
                  className="w-full rounded-lg border border-[#e1e3e4] bg-[#f3f4f5] px-4 py-3 text-[#191c1d] outline-none transition focus:border-[#b1d424] focus:bg-white"
                />
              </Field>

              <Field
                label={isEdit ? "Nueva Contraseña (opcional)" : "Contraseña"}
                error={errors.password}
              >
                <input
                  type="password"
                  placeholder={isEdit ? "Dejar vacío para no cambiar" : "Mínimo 8 caracteres"}
                  value={values.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  className="w-full rounded-lg border border-[#e1e3e4] bg-[#f3f4f5] px-4 py-3 text-[#191c1d] outline-none transition focus:border-[#b1d424] focus:bg-white"
                />
                {isEdit && (
                  <span className="mt-1 text-xs text-[#757963]">
                    Solo completa este campo si deseas cambiar la contraseña.
                  </span>
                )}
              </Field>

              {serverError && (
                <p className="rounded-lg border border-[#ffdad6] bg-[#fff5f4] px-4 py-3 text-sm text-[#ba1a1a]">
                  {serverError}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-[linear-gradient(135deg,#CCF143_0%,#D9FF50_100%)] px-4 py-3 text-sm font-bold uppercase tracking-widest text-[#171e00] transition hover:brightness-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading
                  ? isEdit ? "Guardando..." : "Creando..."
                  : isEdit ? "Guardar Cambios" : "Crear Empleado"
                }
              </button>
            </form>
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
      <label className="mb-2 text-xs font-bold uppercase tracking-widest text-[#757963]">
        {label}
      </label>
      {children}
      {error && <span className="mt-1 text-xs text-[#ba1a1a]">{error}</span>}
    </div>
  );
}