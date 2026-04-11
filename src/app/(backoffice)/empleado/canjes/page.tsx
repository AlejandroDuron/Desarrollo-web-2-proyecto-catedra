import { CanjeForm } from "./components/canje-form";

export default function CanjesPage() {
  // Datos simulados para evitar el 404 de sesión
  const user = { nombre: "Roberto", apellido: "Mejía" };
  const iniciales = (user.nombre[0] + user.apellido[0]).toUpperCase();

  return (
    <div style={{ 
      fontFamily: 'var(--font-display)', 
      color: 'var(--text)',
      backgroundColor: 'var(--bg)',
      minHeight: '100vh'
    }}>
      {/* Contenedor principal que centra todo el diseño */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
        
        {/* Header con el logo y las iniciales */}
        <header style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          padding: '2rem 0', 
          borderBottom: '1px solid var(--border)',
          marginBottom: '3rem'
        }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-0.05em' }}>LA CUPONERA</h1>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ 
              fontSize: '0.7rem', 
              fontWeight: 800, 
              background: 'var(--green-bg)', 
              padding: '0.5rem 1.2rem', 
              borderRadius: '100px', 
              color: 'var(--green2)' 
            }}>CANJE</span>

            <div style={{ 
              width: '45px', 
              height: '45px', 
              background: 'var(--green)', 
              color: 'white', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              fontWeight: 800, 
              fontSize: '0.9rem' 
            }}>
              {iniciales}
            </div>
            <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>{user.nombre}</span>
          </div>
        </header>

        {/* Título Principal */}
        <div style={{ marginBottom: '3rem' }}>
          <h2 style={{ 
            fontSize: '4.5rem', 
            fontWeight: 800, 
            lineHeight: 0.85, 
            margin: 0,
            letterSpacing: '-0.04em'
          }}>
            CANJE DE <span style={{ color: 'var(--green)' }}>CUPONES</span>
          </h2>
          <p style={{ color: 'var(--muted)', marginTop: '1rem', fontSize: '1.1rem', fontWeight: 500 }}>
            Valide y procese cupones de clientes de forma segura.
          </p>
        </div>

        <CanjeForm />
      </div>
    </div>
  );
}