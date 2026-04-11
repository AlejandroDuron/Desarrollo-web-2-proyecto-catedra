"use client";
import { useActionState } from "react";
import { updatePassword } from "../actions";

export function PasswordForm() {
  const [state, action, isPending] = useActionState(updatePassword, null);

  return (
    <form action={action} className="card" style={{ padding: '2rem', maxWidth: '450px' }}>
      <h2 className="section-title">Seguridad</h2>
      <p className="section-subtitle">Actualiza tu acceso al sistema.</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div className="input-group">
          <label>Nueva Contraseña</label>
          <input name="password" type="password" required className="input-field" />
        </div>

        <div className="input-group">
          <label>Confirmar Contraseña</label>
          <input name="confirmPassword" type="password" required className="input-field" />
        </div>

        {state && (
          <p style={{ 
            fontSize: '0.8rem', 
            fontWeight: 'bold', 
            color: state.success ? 'var(--green2)' : 'red' 
          }}>
            {state.message}
          </p>
        )}

        <button disabled={isPending} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
          {isPending ? "Guardando..." : "Actualizar Contraseña"}
        </button>
      </div>
    </form>
  );
}
