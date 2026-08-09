import Link from 'next/link'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.logo}>
          <img src="/logo.png" alt="Mindora Collection" />
        </div>
        <h1>Club Mindori</h1>
        <p className={styles.subtitle}>Tu asistente inteligente</p>
      </div>

      <div className={styles.content}>
        <div className={styles.intro}>
          <h2>Bienvenida a Ana SofIA</h2>
          <p>
            Ana SofIA es tu asistente de confianza. Ella está aquí para ayudarte con cualquier duda que tengas, 
            desde cómo buscar un artículo en el sistema, hasta cómo manejar clientes difíciles o resolver problemas de envío.
          </p>
          <p>
            Pregunta lo que sea — Ana SofIA está disponible para ti con la experiencia y sabiduría de todo el equipo Mindora.
          </p>
        </div>

        <div className={styles.options}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.emoji}>💬</span>
              <h3>Para Mindoris</h3>
            </div>
            <p>Acceso a Ana SofIA para dudas operativas, procesos y atención al cliente.</p>
            <Link href="/ana-sofia">
              <a className={styles.button}>Ir a Ana SofIA</a>
            </Link>
          </div>

          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.emoji}>🔒</span>
              <h3>Para Administración</h3>
            </div>
            <p>Acceso restringido a Ana SofIA para decisiones administrativas y estratégicas.</p>
            <Link href="/admin/ana-sofia">
              <a className={styles.button + ' ' + styles.buttonSecondary}>Ir a Admin</a>
            </Link>
          </div>
        </div>
      </div>

      <footer className={styles.footer}>
        <p>© 2024 Mindora Collection. Todos los derechos reservados.</p>
      </footer>
    </div>
  )
}
