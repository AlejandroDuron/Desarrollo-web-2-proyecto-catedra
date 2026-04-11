import { CanjeForm } from "./components/canje-form";
import { requireAuthenticatedEmployee } from "../../../../lib/supabase/server";

export default async function CanjesPage() {
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
            {}
            <nav style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <span style={{ 
                fontSize: '0.8rem', fontWeight: 800, background: 'var(--green-bg)', 
                padding: '0.3rem 1rem', borderRadius: '100px', color: 'var(--green2)' 
              }}>CANJE</span>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--muted)' }}>SEGURIDAD</span>
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
        <div style={{ marginBottom: '3rem' }}>
          <h2 style={{ 
            fontSize: '4.5rem', fontWeight: 800, lineHeight: 0.85, margin: 0, letterSpacing: '-0.04em' 
          }}>
            CANJE DE <span style={{ color: 'var(--green)' }}>CUPONES</span>
          </h2>
          <p style={{ color: 'var(--muted)', marginTop: '1rem', fontSize: '1.1rem', fontWeight: 500 }}>
            Sesión iniciada como: <span style={{ color: 'var(--text)', fontWeight: 800 }}>{user.email}</span>
          </p>
        </div>

        {}
        <CanjeForm />
      </div>
    </div>
  );
}