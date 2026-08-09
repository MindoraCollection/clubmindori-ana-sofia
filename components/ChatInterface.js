import { useState, useRef, useEffect } from 'react'
import styles from './ChatInterface.module.css'

export default function ChatInterface({ isAdmin = false }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [contexto, setContexto] = useState({
    ventas: '',
    dudas: '',
    problemas: '',
    sucursal: 'general',
  })
  const [showContexto, setShowContexto] = useState(true)
  const chatEndRef = useRef(null)

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage = input
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setLoading(true)

    try {
      const response = await fetch(isAdmin ? '/api/admin/chat' : '/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          contexto: contexto,
          isAdmin: isAdmin,
        })
      })

      const data = await response.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }])
    } catch (error) {
      console.error('Error:', error)
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Hubo un error. Intenta de nuevo.'
      }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <div className={styles.sidebarContent}>
          <div 
            className={`${styles.contextToggle} ${showContexto ? styles.expanded : ''}`}
            onClick={() => setShowContexto(!showContexto)}
          >
            <span>Contexto</span>
            <span>▼</span>
          </div>

          {showContexto && (
            <div className={styles.contextFields}>
              <input
                type="text"
                placeholder="KPI Ventas"
                value={contexto.ventas}
                onChange={(e) => setContexto({...contexto, ventas: e.target.value})}
              />
              <input
                type="text"
                placeholder="KPI Dudas Resueltas"
                value={contexto.dudas}
                onChange={(e) => setContexto({...contexto, dudas: e.target.value})}
              />
              <input
                type="text"
                placeholder="Problemas/Conflictos"
                value={contexto.problemas}
                onChange={(e) => setContexto({...contexto, problemas: e.target.value})}
              />
              <select
                value={contexto.sucursal}
                onChange={(e) => setContexto({...contexto, sucursal: e.target.value})}
              >
                <option value="general">General</option>
                <option value="querétaro-pro">Querétaro Pro</option>
                <option value="monterrey">Monterrey</option>
                <option value="galerías">Galerías</option>
                <option value="juriquilla">Juriquilla</option>
                <option value="miyana">Miyana</option>
              </select>
              <p className={styles.hint}>Actualiza para respuestas personalizadas</p>
            </div>
          )}
        </div>
      </div>

      <div className={styles.chatArea}>
        <div className={styles.messages}>
          {messages.length === 0 ? (
            <div className={styles.emptyState}>
              <p>¿Qué necesitas hoy?</p>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div key={idx} className={`${styles.message} ${styles[msg.role]}`}>
                <div className={styles.messageBubble}>
                  {msg.content}
                </div>
              </div>
            ))
          )}
          {loading && (
            <div className={`${styles.message} ${styles.assistant}`}>
              <div className={styles.messageBubble}>
                Ana SofIA está pensando...
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <div className={styles.inputArea}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Escribe tu pregunta..."
            disabled={loading}
          />
          <button onClick={handleSendMessage} disabled={loading || !input.trim()}>
            {loading ? '...' : 'Enviar'}
          </button>
        </div>
      </div>
    </div>
  )
}
