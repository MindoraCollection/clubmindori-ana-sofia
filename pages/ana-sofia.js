import Head from 'next/head'
import Link from 'next/link'
import ChatInterface from '../components/ChatInterface'
import styles from '../styles/Anasofia.module.css'

export default function AnaSofia() {
  return (
    <>
      <Head>
        <title>Ana SofIA | Club Mindori</title>
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
              <p>Tu asistente inteligente</p>
            </div>
          </div>
        </div>

        <ChatInterface isAdmin={false} />

        <div className={styles.footer}>
          <p>Ana SofIA © 2024 | Mindora Collection</p>
        </div>
      </div>
    </>
  )
}
