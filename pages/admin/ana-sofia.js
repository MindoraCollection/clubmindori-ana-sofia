import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'
import ChatInterface from '../../components/ChatInterface'
import styles from '../../styles/AdminAnasofia.module.css'

export default function AdminAnaSofia() {
  const [isAuthed, setIsAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = () => {
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      setIsAuthed(true)
      setPassword('')
      setError('')
    } else {
      setError('Contraseña incorrecta')
      setPassword('')
    }
  }

  if (!isAuthed) {
    return (
      <>
        <Head>
          <title>Admin | Ana SofIA</title>
        </Head>
        <div className={styles.loginContainer}>
          <div className={styles.loginBox}>
            <div className={styles.loginLogo}>
              <img src="/logo.png" alt="Mindora" />
            </div>
            <h1>Administración</h1>
            <p className={styles.loginSubtitle}>Ana SofIA - Acceso Restringido</p>

            <div className={styles.loginForm}>
              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                autoFocus
              />
              {error && <p className={styles.error}>{error}</p>}
              <button onClick={handleLogin}>Ingresar</button>
            </div>

            <div className={styles.loginFooter}>
              <Link href="/">
                <a>← Volver al inicio</a>
              </Link>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Head>
        <title>Admin | Ana SofIA</title>
      </Head>

      <div className={styles.wrapper}>
        <div className={styles.navbar}>
          <div className={styles.navContent}>
            <Link href="/">
              <a className={styles.navLogo}>
                <span>🏠</span> Club Mindori
              </a>
            </Link>
            <div className={styles.navTitle}>
              <h1>Ana SofIA</h1>
              <p>Administración</p>
            </div>
            <button 
              className={styles.logoutBtn}
              onClick={() => setIsAuthed(false)}
            >
              Salir
            </button>
          </div>
        </div>

        <ChatInterface isAdmin={true} />

        <div className={styles.footer}>
          <p>Ana SofIA Admin © 2024 | Mindora Collection</p>
        </div>
      </div>
    </>
  )
}
