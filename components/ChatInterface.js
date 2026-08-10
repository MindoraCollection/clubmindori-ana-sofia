import { useState, useRef, useEffect } from 'react'
import styles from './ChatInterface.module.css'

export default function ChatInterface({ isAdmin = false }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const chatEndRef = useRef(null)

  const categories = [
    { id: 'perforaciones', label: '🔗 PERFORACIONES', description: 'Cuidados, procesos, garantía' },
    { id: 'pedidos', label: '📦 PEDIDOS', description: 'Crear, buscar, cancelar' },
    { id: 'clientes-dificiles', label: '😤 CLIENTES DIFÍCILES', description: 'Reclamos, conflictos' },
    { id: 'garantias', label: '✅ GARANTÍAS', description: 'Devoluciones, cambios' },
    { id: 'reembolsos', label: '💰 REEMBOLSOS', description: 'Procesar, retrasos' },
    { id: 'piezas-defecto', label: '📸 PIEZAS SIN STOCK O CON DEFECTO', description: 'Inventario, defectos' },
    { id: 'otra', label: '❓ OTRA DUDA', description: 'Algo que no encaja' },
  ]

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!input.trim() || !selectedCategory) return

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
          category: selectedCategory,
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
          <div className={styles.categoryHeader}>
            <span>CATEGORÍA</span>
          </div>

          <div className={styles.categoriesList}>
            {categories.map((cat) => (
              <button
                key={cat.id}
                className={`${styles.categoryBtn} ${selectedCategory === cat.id ? styles.active : ''}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                <div className={styles.categoryLabel}>{cat.label}</div>
                <div className={styles.categoryDesc}>{cat.description}</div>
              </button>
            ))}
          </div>

          {selectedCategory && (
            <div className={styles.selectedInfo}>
              <p>✅ Categoría seleccionada</p>
            </div>
          )}
        </div>
      </div>

      <div className={styles.chatArea}>
        <div className={styles.messages}>
          {messages.length === 0 && !selectedCategory && (
            <div className={styles.emptyState}>
              <p>Selecciona una categoría para empezar</p>
            </div>
          )}
          {messages.length === 0 && selectedCategory && (
            <div className={styles.emptyState}>
              <p>¿Cuál es tu duda?</p>
            </div>
          )}
          {messages.map((msg, idx) => (
            <div key={idx} className={`${styles.message} ${styles[msg.role]}`}>
              <div className={styles.messageBubble}>
                {msg.content}
              </div>
            </div>
          ))}
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
            placeholder={selectedCategory ? "Escribe tu duda..." : "Selecciona una categoría primero..."}
            disabled={loading || !selectedCategory}
          />
          <button onClick={handleSendMessage} disabled={loading || !input.trim() || !selectedCategory}>
            {loading ? '...' : 'Enviar'}
          </button>
        </div>
      </div>
    </div>
  )
}
