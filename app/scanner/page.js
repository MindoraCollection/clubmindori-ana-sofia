'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';

function ScannerContent() {
  const searchParams = useSearchParams();
  
  const [loading, setLoading] = useState(false);
  const [vendedora, setVendedora] = useState('');
  const [sucursal, setSuccursal] = useState(
    searchParams.get('sucursal') || ''
  );
  const [resultado, setResultado] = useState(null);

  const sucursales = [
    { id: 'BL_JURIQUILLA', nombre: 'BL Juriquilla' },
    { id: 'PLAZA_GALERIAS', nombre: 'Plaza Galerías' },
    { id: 'MIYANA_POLANCO', nombre: 'Miyana Polanco' },
    { id: 'FASHION_DRIVE', nombre: 'Fashion Drive Mty' }
  ];

  const vendedoras = [
    'María González', 'Ana López', 'Sofia Martínez', 'Laura Rodríguez',
    'Jessica Pérez', 'Daniela Sánchez', 'Valeria Torres', 'Andrea Flores',
    'Catalina Ruiz', 'Alejandra Gómez'
  ];

  const registrarAsistencia = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResultado(null);

    try {
      const response = await fetch(
        `/api/asistencia?sucursal=${sucursal}&vendedora=${encodeURIComponent(vendedora)}`
      );
      
      const data = await response.json();

      if (response.ok) {
        setResultado({
          exito: true,
          mensaje: data.mensaje,
          tipo: data.tipo,
          hora: data.hora
        });
        setVendedora('');
        setTimeout(() => {
          setResultado(null);
        }, 3000);
      } else {
        setResultado({
          exito: false,
          mensaje: data.error
        });
      }
    } catch (error) {
      setResultado({
        exito: false,
        mensaje: 'Error al registrar: ' + error.message
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '40px',
        maxWidth: '500px',
        width: '100%',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        
        <h1 style={{
          textAlign: 'center',
          marginBottom: '10px',
          color: '#333',
          fontSize: '28px'
        }}>
          📱 Registro de Asistencia
        </h1>
        
        <p style={{
          textAlign: 'center',
          color: '#999',
          marginBottom: '30px',
          fontSize: '14px'
        }}>
          Mindora Collection
        </p>

        {resultado && (
          <div style={{
            padding: '15px',
            borderRadius: '8px',
            marginBottom: '20px',
            background: resultado.exito ? '#d4edda' : '#f8d7da',
            border: `2px solid ${resultado.exito ? '#28a745' : '#dc3545'}`,
            color: resultado.exito ? '#155724' : '#721c24',
            textAlign: 'center',
            fontSize: '16px',
            fontWeight: 'bold',
            minHeight: '50px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {resultado.mensaje}
          </div>
        )}

        <form onSubmit={registrarAsistencia} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          
          <div>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '600',
              color: '#333'
            }}>
              🏪 Sucursal
            </label>
            <select
              value={sucursal}
              onChange={(e) => setSuccursal(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '2px solid #ddd',
                fontSize: '16px',
                cursor: 'pointer'
              }}
            >
              <option value="">Selecciona sucursal</option>
              {sucursales.map(s => (
                <option key={s.id} value={s.id}>{s.nombre}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '600',
              color: '#333'
            }}>
              👤 Nombre
            </label>
            <input
              type="text"
              list="vendedoras-list"
              value={vendedora}
              onChange={(e) => setVendedora(e.target.value)}
              placeholder="Busca tu nombre o escribelo"
              required
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '2px solid #ddd',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
              autoComplete="off"
            />
            <datalist id="vendedoras-list">
              {vendedoras.map(v => (
                <option key={v} value={v} />
              ))}
            </datalist>
          </div>

          <button
            type="submit"
            disabled={loading || !sucursal || !vendedora}
            style={{
              padding: '14px',
              background: loading ? '#999' : '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => !loading && (e.target.style.background = '#764ba2')}
            onMouseLeave={(e) => !loading && (e.target.style.background = '#667eea')}
          >
            {loading ? '⏳ Registrando...' : '✓ REGISTRAR'}
          </button>

        </form>

        <p style={{
          textAlign: 'center',
          color: '#999',
          marginTop: '20px',
          fontSize: '12px'
        }}>
          Los datos se envían directamente a Supabase.
        </p>

      </div>
    </div>
  );
}

export default function Scanner() {
  return (
    <Suspense fallback={<div style={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>Cargando...</div>}>
      <ScannerContent />
    </Suspense>
  );
}
