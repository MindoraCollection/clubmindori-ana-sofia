import { useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'
import styles from '../styles/Login.module.css'
import Head from 'next/head'

export default function Login() {
  const [usuario, setUsuario] = useState('')
  const [contraseña, setContraseña] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { data, error: err } = await supabase
        .from('usuarios')
        .select('*')
        .eq('usuario', usuario)
        .eq('contraseña', contraseña)
        .single()

      if (err || !data) {
        setError('Usuario o contraseña incorrectos')
        setLoading(false)
        return
      }

      localStorage.setItem('usuario_id', data.id)
      localStorage.setItem('usuario_nombre', data.nombre)
      localStorage.setItem('usuario_sucursal', data.sucursal)
      localStorage.setItem('usuario_actual', usuario)

      router.push('/cierre-turno')
    } catch (err) {
      setError('Error al conectar. Intenta de nuevo.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>Login | Cierre de Turno</title>
      </Head>
      <div className={styles.container}>
        <div className={styles.loginBox}>
          <div className={styles.logo}>
            <img src="/logo.png" alt="Mindora" />
          </div>
          <h1 className={styles.heading}>Cierre de Turno</h1>
          <p className={styles.subtitle}>Mindora Collection</p>

          <form onSubmit={handleLogin} className={styles.form}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Usuario</label>
              <input
                type="text"
                className={styles.input}
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                placeholder="Tu usuario"
                disabled={loading}
                autoFocus
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Contraseña</label>
              <input
                type="password"
                className={styles.input}
                value={contraseña}
                onChange={(e) => setContraseña(e.target.value)}
                placeholder="Tu contraseña"
                disabled={loading}
              />
            </div>

            {error && <p className={styles.error}>{error}</p>}

            <button type="submit" disabled={loading} className={styles.submitBtn}>
              {loading ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>
        </div>
      </div>
    </>
  )
}
