import { PasswordForm } from "./components/password-form";
import { requireAuthenticatedEmployee } from "../../../../lib/supabase/server";

export default async function SeguridadPage() {

  const { user } = await requireAuthenticatedEmployee();

  const nombre = user.user_metadata?.nombres || "Empleado";
  const apellido = user.user_metadata?.apellidos || "";
  const iniciales = (nombre[0] + (apellido[0] || "")).toUpperCase();

  return (
    <div style={{ 
      fontFamily: 'var(--font-display)', 
      color: 'var(--text)',
      backgroundColor: 'var(--bg)',
      minHeight: '100vh'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
        
        {}
        <header style={{ 
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
          padding: '2rem 0', borderBottom: '1px solid var(--border)', marginBottom: '3rem'
        }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-0.05em' }}>LA CUPONERA</h1>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <nav style={{ display: 'flex', gap: '1rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--muted)' }}>CANJE</span>
              <span style={{ 
                fontSize: '0.8rem', fontWeight: 800, background: 'var(--green-bg)', 
                padding: '0.3rem 1rem', borderRadius: '100px', color: 'var(--green2)' 
              }}>SEGURIDAD</span>
            </nav>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <div style={{ 
                width: '40px', height: '40px', background: 'var(--green)', color: 'white', 
                borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', 
                fontWeight: 800, fontSize: '0.85rem' 
              }}>
                {iniciales}
              </div>
              <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>{nombre.split(' ')[0]}</span>
            </div>
          </div>
        </header>

        {}
        <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '4rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '3.5rem', fontWeight: 800, lineHeight: 0.9, margin: 0, letterSpacing: '-0.03em' }}>
              PROTEGE TU <span style={{ color: 'var(--green)' }}>CUENTA</span>
            </h2>
            <p style={{ color: 'var(--muted)', marginTop: '1rem', fontSize: '1.1rem', fontWeight: 500 }}>
              Sesión iniciada como: <span style={{ color: 'var(--text)', fontWeight: 800 }}>{user.email}</span>
            </p>
          </div>

          <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            {}
            <PasswordForm />
          </div>
        </main>
      </div>
    </div>
  );
}
