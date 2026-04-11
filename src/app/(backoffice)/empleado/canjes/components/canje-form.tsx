"use client";

import { useState } from "react";
import { verificarCupon, registrarCanjeFinal } from "../actions";

export function CanjeForm() {
  const [codigo, setCodigo] = useState("");
  const [cupon, setCupon] = useState<any>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!codigo.trim()) {
      setError("Por favor, ingrese un código.");
      return;
    }
    
    setLoading(true);
    setError("");
    const res = await verificarCupon(codigo);
    
    if (res.success) {
      setCupon(res.data);
    } else {
      setError(res.message || "Cupón no encontrado");
      setCupon(null);
    }
    setLoading(false);
  };

  const handleCanje = async () => {
    const confirmacion = window.confirm("¿El DUI físico del cliente coincide con el sistema?");
    if (!confirmacion) return;

    const res = await registrarCanjeFinal(codigo);
    if (res.success) {
      alert("¡Canje registrado exitosamente en el sistema!");
      setCupon(null);
      setCodigo("");
    } else {
      alert(res.message || "Error al procesar el canje.");
    }
  };

  return (
    <div style={{ width: '100%', fontFamily: 'var(--font-display)' }}>
      {/* Buscador de Cupón */}
      <section style={{ 
        background: 'var(--surface)', 
        padding: '3.5rem', 
        borderRadius: 'var(--radius-lg)', 
        borderLeft: '10px solid var(--green)', 
        marginBottom: '3rem' 
      }}>
        <label style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.1em', color: 'var(--subtle)' }}>
          INGRESAR CÓDIGO DE CUPÓN
        </label>
        <div style={{ 
          display: 'flex', gap: '1rem', marginTop: '1.5rem', background: 'white', 
          padding: '0.6rem', borderRadius: 'var(--radius)', boxShadow: '0 2px 15px rgba(0,0,0,0.03)'
        }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', paddingLeft: '1.5rem' }}>
            <span className="material-symbols-outlined" style={{ color: 'var(--muted)', fontSize: '1.8rem' }}>qr_code_scanner</span>
            <input 
              value={codigo}
              onChange={(e) => setCodigo(e.target.value.toUpperCase())}
              placeholder="EJ: CP-9823-XL12"
              disabled={loading}
              style={{ 
                border: 'none', width: '100%', padding: '1.2rem', fontSize: '1.6rem', 
                fontFamily: 'var(--font-mono)', fontWeight: 700, outline: 'none', color: 'var(--text)'
              }}
            />
          </div>
          <button onClick={handleSearch} disabled={loading} style={{ 
            background: 'var(--green)', color: 'white', border: 'none', padding: '0 3.5rem', 
            borderRadius: 'var(--radius)', fontWeight: 800, fontSize: '1rem', cursor: loading ? 'not-allowed' : 'pointer'
          }}>
            {loading ? "BUSCANDO..." : "VALIDAR"}
          </button>
        </div>
        {error && <p style={{ color: '#ef4444', marginTop: '1.2rem', fontWeight: 700, fontSize: '0.9rem' }}>{error}</p>}
      </section>

      {/* Resultados de Validación (Bento Grid) */}
      {cupon && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '2rem', animation: 'fadeIn 0.5s ease' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            <div style={{ background: 'var(--green-bg)', border: '1.5px solid var(--green)', padding: '2rem', borderRadius: 'var(--radius-lg)', display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
              <span className="material-symbols-outlined" style={{ color: 'var(--green2)', fontSize: '2.5rem' }}>check_circle</span>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800 }}>CÓDIGO VÁLIDO</h3>
                <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600, color: 'var(--subtle)' }}>Disponible para canje inmediato.</p>
              </div>
            </div>

            <div style={{ background: 'white', padding: '2.5rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow)' }}>
              <span style={{ fontSize: '0.65rem', fontWeight: 800, background: 'var(--surface2)', padding: '0.3rem 0.8rem', borderRadius: '50px' }}>OFERTA ACTIVA</span>
              <h3 style={{ fontSize: '2.5rem', fontWeight: 800, margin: '1rem 0' }}>{cupon.ofertas?.titulo}</h3>
              <p style={{ color: 'var(--subtle)', fontWeight: 500, lineHeight: 1.6 }}>{cupon.ofertas?.descripcion}</p>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '2.5rem' }}>
                <div style={{ background: 'var(--surface2)', padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
                  <p style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--muted)' }}>DATOS DEL CLIENTE</p>
                  <p style={{ fontWeight: 800, fontSize: '1.1rem', marginTop: '0.5rem' }}>{cupon.clientes?.nombres} {cupon.clientes?.apellidos}</p>
                  <p style={{ fontSize: '1.6rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--text)' }}>{cupon.clientes?.dui}</p>
                </div>
                <div style={{ background: 'var(--text)', color: 'white', padding: '2rem', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <p style={{ fontSize: '0.75rem', opacity: 0.7, fontWeight: 500 }}>El cupón quedará invalidado permanentemente al confirmar.</p>
                  <button onClick={handleCanje} style={{ background: 'var(--green)', color: 'white', border: 'none', padding: '1.2rem', borderRadius: 'var(--radius)', fontWeight: 800, cursor: 'pointer' }}>
                    CONFIRMAR CANJE
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div style={{ background: 'white', padding: '2rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow)', height: 'fit-content' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 800, borderBottom: '1.5px solid var(--border)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>GUÍA DE ESTADOS</h4>
            <ul style={{ padding: 0, fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <li style={{ display: 'flex', gap: '0.8rem' }}><span style={{ color: 'var(--green)' }}>●</span> <b>VÁLIDO:</b> Listo para canje inmediato.</li>
              <li style={{ display: 'flex', gap: '0.8rem', opacity: 0.5 }}><span style={{ color: '#ef4444' }}>●</span> <b>CANJEADO:</b> Código utilizado previamente.</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}