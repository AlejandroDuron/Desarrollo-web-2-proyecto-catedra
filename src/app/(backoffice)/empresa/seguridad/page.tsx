"use client";

import { useTransition, useState } from "react";
import { updatePasswordAction } from "./actions";

export default function SeguridadPage() {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const handleSubmit = (formData: FormData) => {
    setStatus(null);
    startTransition(async () => {
      const result = await updatePasswordAction(formData);
      if (result?.error) {
        setStatus({ type: "error", msg: result.error });
      } else if (result?.success) {
        setStatus({ type: "success", msg: "Contraseña actualizada correctamente" });
      }
    });
  };

  return (
    <div className="p-8 max-w-xl mx-auto flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-black mb-1" style={{ fontFamily: "var(--font-display)" }}>
          Seguridad de la Cuenta
        </h1>
        <p className="text-[var(--muted)] text-sm">Actualiza tu contraseña de acceso administrativo.</p>
      </div>

      <div className="card bg-[var(--bg)] p-6 shadow-sm">
        <form action={handleSubmit} className="flex flex-col gap-5">
          {status && (
            <div className={`p-4 rounded-[var(--radius-sm)] text-sm font-bold ${
              status.type === "success" 
                ? "bg-[var(--green-bg)] text-[var(--green2)]"
                : "bg-red-100 text-[#ba1a1a]"
            }`}>
              {status.msg}
            </div>
          )}

          <div className="flex flex-col gap-1">
            <label className="text-sm font-bold text-[var(--subtle)]">Nueva Contraseña</label>
            <input 
              type="password" 
              name="password" 
              required minLength={6}
              autoComplete="new-password"
              className="border border-[var(--border)] rounded-[var(--radius)] px-4 py-2 font-mono text-sm focus:outline-none focus:border-[var(--green)] transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-bold text-[var(--subtle)]">Confirmar Contraseña</label>
            <input 
              type="password" 
              name="confirmPassword" 
              required minLength={6}
              autoComplete="new-password"
              className="border border-[var(--border)] rounded-[var(--radius)] px-4 py-2 font-mono text-sm focus:outline-none focus:border-[var(--green)] transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="mt-2 px-4 py-3 bg-[var(--text)] text-[var(--bg)] text-sm font-bold rounded-[var(--radius-sm)] hover:opacity-90 disabled:opacity-50"
            style={{ transition: "var(--transition)" }}
          >
            {isPending ? "Procesando..." : "Actualizar Contraseña"}
          </button>
        </form>
      </div>
    </div>
  );
}
