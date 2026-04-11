"use client";

import { useActionState } from "react";
import { updatePassword } from "../actions";

export function PasswordForm() {
  const [state, formAction, isPending] = useActionState(updatePassword, null);

  return (
    <div style={{ background: 'white', padding: '3.5rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow)', maxWidth: '600px', fontFamily: 'var(--font-display)' }}>
      <h3 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>Actualizar Contraseña</h3>
      <p style={{ color: 'var(--subtle)', marginBottom: '2.5rem', fontWeight: 500 }}>Asegúrese de usar una contraseña segura de al menos 6 caracteres.</p>

      {}
      {state && (
        <div style={{ 
          background: state.success ? 'var(--green-bg)' : '#fef2f2', 
          border: `1px solid ${state.success ? 'var(--green)' : '#ef4444'}`, 
          color: state.success ? 'var(--green2)' : '#b91c1c', 
          padding: '1rem 1.5rem', borderRadius: 'var(--radius)', marginBottom: '2rem', fontWeight: 700, fontSize: '0.9rem' 
        }}>
          {state.message}
        </div>
      )}

      <form action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div>
          <label htmlFor="password" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, marginBottom: '0.8rem', color: 'var(--muted)' }}>NUEVA CONTRASEÑA</label>
          <input 
            type="password" 
            id="password" 
            name="password" 
            required 
            style={{ 
              width: '100%', padding: '1.2rem', borderRadius: 'var(--radius)', 
              border: '1px solid var(--border)', background: 'var(--surface)', 
              fontFamily: 'var(--font-mono)', fontSize: '1rem', outline: 'none' 
            }} 
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, marginBottom: '0.8rem', color: 'var(--muted)' }}>CONFIRMAR CONTRASEÑA</label>
          <input 
            type="password" 
            id="confirmPassword" 
            name="confirmPassword" 
            required 
            style={{ 
              width: '100%', padding: '1.2rem', borderRadius: 'var(--radius)', 
              border: '1px solid var(--border)', background: 'var(--surface)', 
              fontFamily: 'var(--font-mono)', fontSize: '1rem', outline: 'none' 
            }} 
          />
        </div>

        <button 
          type="submit" 
          disabled={isPending}
          style={{ 
            background: 'var(--text)', color: 'white', border: 'none', padding: '1.2rem', 
            borderRadius: 'var(--radius)', fontWeight: 800, fontSize: '1rem', 
            marginTop: '1rem', cursor: isPending ? 'not-allowed' : 'pointer', transition: 'var(--transition)'
          }}
        >
          {isPending ? "ACTUALIZANDO..." : "GUARDAR CAMBIOS"}
        </button>
      </form>
    </div>
  );
}
