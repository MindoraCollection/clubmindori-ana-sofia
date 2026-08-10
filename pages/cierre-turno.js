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
                  onChange={(e) => setSalidas(e.target.value)}
                  placeholder="Ej: Cambio de billete $500"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Entradas de Caja (motivo + monto)</label>
                <textarea
                  value={entradas}
                  onChange={(e) => setEntradas(e.target.value)}
                  placeholder="Ej: Cobro previo $300"
                />
              </div>
            </div>

            {/* SECCIÓN 2: CLIENTES */}
            <div className={styles.section}>
              <h2>👥 2. CLIENTES</h2>

              <div className={styles.formGroup}>
                <label>¿Tuviste situación difícil con algún cliente?</label>
                <textarea
                  value={situacionesClientes}
                  onChange={(e) => setSituacionesClientes(e.target.value)}
                  placeholder="Describe qué pasó"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Cantidad de garantías otorgadas</label>
                <input
                  type="number"
                  value={garantias}
                  onChange={(e) => setGarantias(e.target.value)}
                  placeholder="0"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Cantidad de cambios de piezas</label>
                <input
                  type="number"
                  value={cambiosPiezas}
                  onChange={(e) => setCambiosPiezas(e.target.value)}
                  placeholder="0"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Piezas que pedían pero no tenemos</label>
                <textarea
                  value={piezasSinStock}
                  onChange={(e) => setPiezasSinStock(e.target.value)}
                  placeholder="Ej: Argollas talla 8, collares plateados"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Comentarios positivos de clientes</label>
                <textarea
                  value={comentariosPositivos}
                  onChange={(e) => setComentariosPositivos(e.target.value)}
                  placeholder="Qué dijeron de buen"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Comentarios negativos de clientes</label>
                <textarea
                  value={comentariosNegativos}
                  onChange={(e) => setComentariosNegativos(e.target.value)}
                  placeholder="Qué dijeron de malo"
                />
              </div>
            </div>

            {/* SECCIÓN 3: CRECIMIENTO */}
            <div className={styles.section}>
              <h2>📈 3. CRECIMIENTO</h2>

              <div className={styles.formGroup}>
                <label>¿Aprendiste algo nuevo hoy?</label>
                <textarea
                  value={aprendizajes}
                  onChange={(e) => setAprendizajes(e.target.value)}
                  placeholder="Qué aprendiste"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Reseñas de Google que conseguiste</label>
                <input
                  type="number"
                  value={resenas}
                  onChange={(e) => setResenas(e.target.value)}
                  placeholder="0"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Buenos comentarios de clientas (cantidad + ejemplos)</label>
                <textarea
                  value={buenasOpiniones}
                  onChange={(e) => setBuenasOpiniones(e.target.value)}
                  placeholder="Ej: 3 clientas dijeron que les encantó el servicio"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Malos comentarios (cantidad + ejemplos)</label>
                <textarea
                  value={malasOpiniones}
                  onChange={(e) => setMalasOpiniones(e.target.value)}
                  placeholder="Ej: 1 cliente se quejó del tiempo de espera"
                />
              </div>
            </div>

            {/* SECCIÓN 4: SUCURSAL */}
            <div className={styles.section}>
              <h2>🏢 4. SUCURSAL</h2>

              <div className={styles.formGroup}>
                <label>Insumos faltantes</label>
                <textarea
                  value={insumosFaltantes}
                  onChange={(e) => setInsumosFaltantes(e.target.value)}
                  placeholder="Ej: Algodón, agujas estériles"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Accesorios que necesitamos pedir</label>
                <textarea
                  value={accesoriosNecesarios}
                  onChange={(e) => setAccesoriosNecesarios(e.target.value)}
                  placeholder="Ej: Aros plateados talla 5, 10 piezas"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Mantenimiento o fallas de equipos</label>
                <textarea
                  value={mantenimiento}
                  onChange={(e) => setMantenimiento(e.target.value)}
                  placeholder="Ej: Caja registradora lenta, espejo roto"
                />
              </div>

              <div className={styles.formGroup}>
                <label>¿Faltó alguna vendedora? ¿Por qué?</label>
                <textarea
                  value={faltasPersonal}
                  onChange={(e) => setFaltasPersonal(e.target.value)}
                  placeholder="Ej: María - enfermedad, Sofía - permiso"
                />
              </div>
            </div>

            {/* CHECKLIST */}
            <div className={styles.section}>
              <h2>✅ CHECKLIST DIARIO</h2>

              <div className={styles.checklistGrid}>
                {[
                  { key: 'limpieza', label: '🧹 Limpieza de la sucursal' },
                  { key: 'uniforme', label: '👗 Uniforme completo' },
                  { key: 'unas', label: '💅 Uñas y maquillaje' },
                  { key: 'aperturaCaja', label: '💳 Apertura de caja correcta' },
                  { key: 'playlist', label: '🎵 Playlist correcta' },
                  { key: 'insumos', label: '📦 Insumos completos' },
                  { key: 'regalos', label: '🎁 Regalos Copa disponibles' },
                  { key: 'vendedoras', label: '👥 Todas vendedoras asignadas' },
                ].map(item => (
                  <div key={item.key} className={styles.checklistItem}>
                    <label>
                      <input
                        type="checkbox"
                        checked={checklist[item.key]}
                        onChange={() => handleChecklistChange(item.key)}
                      />
                      <span>{item.label}</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* BOTÓN SUBMIT */}
            <div className={styles.submitSection}>
              <button type="submit" disabled={loading} className={styles.submitBtn}>
                {loading ? '⏳ Guardando...' : '💾 Guardar Cierre de Turno'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
