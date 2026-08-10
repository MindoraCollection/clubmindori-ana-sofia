import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import styles from '../../styles/AdminDashboard.module.css'
import Head from 'next/head'

export default function Dashboard() {
  const [cierres, setCierres] = useState([])
  const [filtros, setFiltros] = useState({ sucursal: '', fecha: '', mindori: '' })
  const [loading, setLoading] = useState(true)
  const [admin, setAdmin] = useState(false)
  const [password, setPassword] = useState('')
  const [authenticated, setAuthenticated] = useState(false)

  // Check admin password
  const handleAuth = (e) => {
    e.preventDefault()
    if (password === 'admin3b89a297cb') {
      setAuthenticated(true)
      localStorage.setItem('admin_auth', 'true')
    } else {
      alert('Contraseña incorrecta')
    }
  }

  // Fetch data
  useEffect(() => {
    if (!authenticated) return

    const fetchData = async () => {
      setLoading(true)
      let query = supabase.from('cierres_turno').select('*')

      if (filtros.sucursal) query = query.eq('sucursal', filtros.sucursal)
      if (filtros.fecha) query = query.gte('creado_en', filtros.fecha)
      if (filtros.mindori) query = query.eq('usuario_id', filtros.mindori)

      const { data, error } = await query.order('creado_en', { ascending: false })

      if (error) {
        console.error('Error:', error)
      } else {
        setCierres(data || [])
      }
      setLoading(false)
    }

    fetchData()
  }, [filtros, authenticated])

  if (!authenticated) {
    return (
      <>
        <Head>
          <title>Admin Dashboard</title>
        </Head>
        <div className={styles.authContainer}>
          <div className={styles.authBox}>
            <h1>Dashboard Administrativo</h1>
            <form onSubmit={handleAuth}>
              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.authInput}
              />
              <button type="submit" className={styles.authBtn}>
                Acceder
              </button>
            </form>
          </div>
        </div>
      </>
    )
  }

  const totalVentas = cierres.reduce((sum, c) => sum + (c.venta_total || 0), 0)
  const totalReembolsos = cierres.reduce((sum, c) => sum + (c.reembolsos || 0), 0)
  const totalGarantias = cierres.reduce((sum, c) => sum + (c.garantias_cantidad || 0), 0)

  return (
    <>
      <Head>
        <title>Dashboard | Mindora</title>
      </Head>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Dashboard Administrativo</h1>
          <button onClick={() => setAuthenticated(false)} className={styles.logoutBtn}>
            Salir
          </button>
        </div>

        {/* KPIs */}
        <div className={styles.kpiGrid}>
          <div className={styles.kpiCard}>
            <div className={styles.kpiValue}>${totalVentas.toFixed(2)}</div>
            <div className={styles.kpiLabel}>Venta Total</div>
          </div>
          <div className={styles.kpiCard}>
            <div className={styles.kpiValue}>${totalReembolsos.toFixed(2)}</div>
            <div className={styles.kpiLabel}>Reembolsos</div>
          </div>
          <div className={styles.kpiCard}>
            <div className={styles.kpiValue}>{totalGarantias}</div>
            <div className={styles.kpiLabel}>Garantías</div>
          </div>
          <div className={styles.kpiCard}>
            <div className={styles.kpiValue}>{cierres.length}</div>
            <div className={styles.kpiLabel}>Total Cierres</div>
          </div>
        </div>

        {/* Filtros */}
        <div className={styles.filterBox}>
          <input
            type="date"
            value={filtros.fecha}
            onChange={(e) => setFiltros({ ...filtros, fecha: e.target.value })}
            className={styles.filterInput}
          />
          <input
            type="text"
            placeholder="Sucursal"
            value={filtros.sucursal}
            onChange={(e) => setFiltros({ ...filtros, sucursal: e.target.value })}
            className={styles.filterInput}
          />
          <button onClick={() => setFiltros({ sucursal: '', fecha: '', mindori: '' })} className={styles.resetBtn}>
            Limpiar filtros
          </button>
        </div>

        {/* Tabla */}
        <div className={styles.tableContainer}>
          {loading ? (
            <p>Cargando...</p>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Mindori</th>
                  <th>Sucursal</th>
                  <th>Turno</th>
                  <th>Venta Total</th>
                  <th>Reembolsos</th>
                  <th>Garantías</th>
                </tr>
              </thead>
              <tbody>
                {cierres.map((cierre) => (
                  <tr key={cierre.id}>
                    <td>{new Date(cierre.creado_en).toLocaleDateString()}</td>
                    <td>{cierre.usuario_id}</td>
                    <td>{cierre.sucursal}</td>
                    <td>{cierre.turno}</td>
                    <td>${cierre.venta_total || 0}</td>
                    <td>${cierre.reembolsos || 0}</td>
                    <td>{cierre.garantias_cantidad || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  )
}
