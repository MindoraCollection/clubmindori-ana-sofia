'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function DashboardAsistencia() {
  const [registros, setRegistros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroFecha, setFiltroFecha] = useState(new Date().toISOString().split('T')[0]);
  const [filtroSucursal, setFiltroSucursal] = useState('');

  const sucursales = [
    'BL_JURIQUILLA',
    'PLAZA_GALERIAS',
    'MIYANA_POLANCO',
    'FASHION_DRIVE'
  ];

  useEffect(() => {
    cargarDatos();
  }, [filtroFecha, filtroSucursal]);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('asistencia')
        .select('*')
        .eq('fecha', filtroFecha)
        .order('timestamp', { ascending: true });

      if (filtroSucursal) {
        query = query.eq('sucursal', filtroSucursal);
      }

      const { data, error } = await query;
      if (error) throw error;

      setRegistros(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Agrupar por vendedora
  const porVendedora = {};
  registros.forEach(reg => {
    if (!porVendedora[reg.vendedora_nombre]) {
      porVendedora[reg.vendedora_nombre] = [];
    }
    porVendedora[reg.vendedora_nombre].push(reg);
  });

  // Calcular horas trabajadas
  const calcularHoras = (registrosList) => {
    const checkins = registrosList.filter(r => r.tipo === 'checkin');
    const checkouts = registrosList.filter(r => r.tipo === 'checkout');

    if (checkins.length === 0) return 0;

    let horas = 0;
    for (let i = 0; i < checkins.length; i++) {
      const checkinTime = new Date(`2000-01-01 ${checkins[i].hora_registrada}`);
      const checkoutTime = checkouts[i] 
        ? new Date(`2000-01-01 ${checkouts[i].hora_registrada}`)
        : new Date(`2000-01-01 20:00`);

      horas += (checkoutTime - checkinTime) / (1000 * 60 * 60);
    }

    return horas.toFixed(2);
  };

  return (
    <div style={{
      padding: '30px',
      maxWidth: '1200px',
      margin: '0 auto',
      fontFamily: 'system-ui, sans-serif',
      background: '#f5f5f5',
      minHeight: '100vh'
    }}>
      
      <h1 style={{ color: '#333', marginBottom: '10px' }}>📊 Asistencia Diaria</h1>
      <p style={{ color: '#999', marginBottom: '30px' }}>Mindora Collection</p>

      <div style={{
        display: 'flex',
        gap: '15px',
        marginBottom: '30px',
        flexWrap: 'wrap'
      }}>
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Fecha</label>
          <input
            type="date"
            value={filtroFecha}
            onChange={(e) => setFiltroFecha(e.target.value)}
            style={{
              padding: '10px',
              borderRadius: '6px',
              border: '1px solid #ddd',
              fontSize: '14px'
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Sucursal</label>
          <select
            value={filtroSucursal}
            onChange={(e) => setFiltroSucursal(e.target.value)}
            style={{
              padding: '10px',
              borderRadius: '6px',
              border: '1px solid #ddd',
              fontSize: '14px'
            }}
          >
            <option value="">Todas</option>
            {sucursales.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <p style={{ textAlign: 'center', color: '#999' }}>⏳ Cargando...</p>
      ) : (
        <div>
          {Object.keys(porVendedora).length === 0 ? (
            <p style={{
              background: 'white',
              padding: '20px',
              borderRadius: '8px',
              color: '#999',
              textAlign: 'center'
            }}>
              Sin registros para esta fecha y sucursal
            </p>
          ) : (
            <div style={{ display: 'grid', gap: '20px' }}>
              {Object.entries(porVendedora).map(([vendedora, regs]) => (
                <div
                  key={vendedora}
                  style={{
                    background: 'white',
                    padding: '20px',
                    borderRadius: '8px',
                    border: '1px solid #ddd'
                  }}
                >
                  <h3 style={{ margin: '0 0 15px 0', color: '#333' }}>👤 {vendedora}</h3>
                  
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr',
                    gap: '10px',
                    marginBottom: '15px'
                  }}>
                    {regs.map((reg, idx) => (
                      <div
                        key={idx}
                        style={{
                          padding: '10px',
                          background: reg.tipo === 'checkin' ? '#d4edda' : '#fff3cd',
                          borderRadius: '6px',
                          fontSize: '14px',
                          textAlign: 'center'
                        }}
                      >
                        <div style={{ fontWeight: 'bold', color: '#333' }}>
                          {reg.tipo === 'checkin' ? '✓ Entrada' : '✗ Salida'}
                        </div>
                        <div style={{ color: '#666' }}>{reg.hora_registrada}</div>
                        <div style={{ fontSize: '12px', color: '#999' }}>
                          {reg.sucursal}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={{
                    padding: '10px',
                    background: '#e7f3ff',
                    borderRadius: '6px',
                    fontWeight: 'bold',
                    color: '#0066cc',
                    textAlign: 'center'
                  }}>
                    ⏱️ Total: {calcularHoras(regs)} horas
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
