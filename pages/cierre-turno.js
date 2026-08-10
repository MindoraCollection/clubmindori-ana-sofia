import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'
import styles from '../styles/CierreTurno.module.css'
import Head from 'next/head'

export default function CierreTurno() {
  const router = useRouter()
  const [usuario, setUsuario] = useState(null)
  const [sucursal, setSucursal] = useState('')
  const [turno, setTurno] = useState('')
  const [loading, setLoading] = useState(false)

  // SECCIÓN 1: CORTE
  const [ventaTotal, setVentaTotal] = useState('')
  const [reembolsos, setReembolsos] = useState('')
  const [salidas, setSalidas] = useState('')
  const [entradas, setEntradas] = useState('')

  // SECCIÓN 2: CLIENTES
  const [situacionesClientes, setSituacionesClientes] = useState('')
  const [garantias, setGarantias] = useState('')
  const [cambiosPiezas, setCambiosPiezas] = useState('')
  const [piezasSinStock, setPiezasSinStock] = useState('')
  const [comentariosPositivos, setComentariosPositivos] = useState('')
  const [comentariosNegativos, setComentariosNegativos] = useState('')

  // SECCIÓN 3: CRECIMIENTO
  const [aprendizajes, setAprendizajes] = useState('')
  const [resenas, setResenas] = useState('')
  const [buenasOpiniones, setBuenasOpiniones] = useState('')
  const [malasOpiniones, setMalasOpiniones] = useState('')

  // SECCIÓN 4: SUCURSAL
  const [insumosFaltantes, setInsumosFaltantes] = useState('')
  const [accesoriosNecesarios, setAccesoriosNecesarios] = useState('')
  const [mantenimiento, setMantenimiento] = useState('')
  const [faltasPersonal, setFaltasPersonal] = useState('')

  // CHECKLIST
  const [checklist, setChecklist] = useState({
    limpieza: false,
    uniforme: false,
    unas: false,
    aperturaCaja: false,
    playlist: false,
    insumos: false,
    regalos: false,
    vendedoras: false,
  })

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem('usuario_actual')
    const sucursalGuardada = localStorage.getItem('usuario_sucursal')

    if (!usuarioGuardado) {
      router.push('/login')
    } else {
      setUsuario(usuarioGuardado)
      setSucursal(sucursalGuardada)
    }
  }, [router])

  const handleChecklistChange = (key) => {
    setChecklist(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!turno) {
      alert('Selecciona un turno')
      return
    }

    setLoading(true)

    try {
      const usuarioId = localStorage.getItem('usuario_id')

      const { error } = await supabase.from('cierres_turno').insert([
        {
          usuario_id: parseInt(usuarioId),
          sucursal: sucursal,
          turno: turno,
          venta_total: parseFloat(ventaTotal) || 0,
          reembolsos: parseFloat(reembolsos) || 0,
          salidas_caja: parseFloat(salidas) || 0,
          entradas_caja: parseFloat(entradas) || 0,
          situaciones_clientes: situacionesClientes,
          garantias_cantidad: parseInt(garantias) || 0,
          cambios_piezas: parseInt(cambiosPiezas) || 0,
          piezas_sin_stock: piezasSinStock,
          aprendizajes: aprendizajes,
          resenas_google: parseInt(resenas) || 0,
          comentarios_positivos: comentariosPositivos,
          comentarios_negativos: comentariosNegativos,
          insumos_faltantes: insumosFaltantes,
          accesorios_necesarios: accesoriosNecesarios,
          mantenimiento_reportes: mantenimiento,
          faltas_personal: faltasPersonal,
          limpieza: checklist.limpieza,
          uniforme: checklist.uniforme,
          unas_maquillaje: checklist.unas,
          apertura_caja: checklist.aperturaCaja,
          playlist: checklist.playlist,
          insumos_completos: checklist.insumos,
          regalos_disponibles: checklist.regalos,
          vendedoras_asignadas: checklist.vendedoras,
        }
      ])

      if (error) {
        alert('Error al guardar: ' + error.message)
      } else {
        alert('✅ Cierre guardado correctamente')
        router.push('/cierre-turno')
        // Limpiar formulario
        setTurno('')
        setVentaTotal('')
        setReembolsos('')
        setSalidas('')
        setEntradas('')
        setSituacionesClientes('')
        setGarantias('')
        setCambiosPiezas('')
        setPiezasSinStock('')
        setComentariosPositivos('')
        setComentariosNegativos('')
        setAprendizajes('')
        setResenas('')
        setBuenasOpiniones('')
        setMalasOpiniones('')
        setInsumosFaltantes('')
        setAccesoriosNecesarios('')
        setMantenimiento('')
        setFaltasPersonal('')
        setChecklist({
          limpieza: false,
          uniforme: false,
          unas: false,
          aperturaCaja: false,
          playlist: false,
          insumos: false,
          regalos: false,
          vendedoras: false,
        })
      }
    } catch (err) {
      console.error(err)
      alert('Error al conectar con la base de datos')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('usuario_id')
    localStorage.removeItem('usuario_nombre')
    localStorage.removeItem('usuario_sucursal')
    localStorage.removeItem('usuario_actual')
    router.push('/login')
  }

  if (!usuario) return <div>Cargando...</div>

  return (
    <>
      <Head>
        <title>Cierre de Turno | {usuario}</title>
      </Head>
      <div className={styles.container}>
        <div className={styles.navbar}>
          <div className={styles.navContent}>
            <h1>Cierre de Turno</h1>
            <div className={styles.userInfo}>
              <span>{usuario} - {sucursal}</span>
              <button onClick={handleLogout} className={styles.logoutBtn}>
                Salir
              </button>
            </div>
          </div>
        </div>

        <div className={styles.content}>
          <form onSubmit={handleSubmit}>
            {/* TURNO */}
            <div className={styles.section}>
              <h2>📋 Selecciona tu Turno</h2>
              <div className={styles.formGroup}>
                <select value={turno} onChange={(e) => setTurno(e.target.value)} required>
                  <option value="">-- Selecciona turno --</option>
                  <option value="Mañana">🌅 Mañana</option>
                  <option value="Tarde">☀️ Tarde</option>
                  <option value="Noche">🌙 Noche</option>
                </select>
              </div>
            </div>

            {/* SECCIÓN 1: CORTE */}
            <div className={styles.section}>
              <h2>💰 1. CORTE DE CAJA</h2>

              <div className={styles.formGroup}>
                <label>Venta Total ({turno || 'turno'})</label>
                <input
                  type="number"
                  step="0.01"
                  value={ventaTotal}
                  onChange={(e) => setVentaTotal(e.target.value)}
                  placeholder="$0.00"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Reembolsos (monto)</label>
                <input
                  type="number"
                  step="0.01"
                  value={reembolsos}
                  onChange={(e) => setReembolsos(e.target.value)}
                  placeholder="$0.00"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Salidas de Caja (motivo + monto)</label>
                <textarea
                  value={salidas}
                  onChange={(e) =>
