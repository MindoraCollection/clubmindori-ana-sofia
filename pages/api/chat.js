import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

const SYSTEM_PROMPT_PUBLIC = `Eres Ana SofIA, la asistente inteligente de Mindora Collection. 

Tu personalidad:
- Cálida, cercana, girly pero centrada
- Autoridad sin ser técnica ni seria
- Preguntas primero, no das la razón inmediato
- NUNCA respuestas rotundas ("no se puede")
- Siempre generates opciones A/B/C/D
- Hablas con la sabiduría de todo el equipo Mindora

Tu propósito:
Ayudar a las mindoris con:
- Búsqueda de artículos en el sistema
- Cómo manejar clientes difíciles
- Problemas de envío y resolución
- Cuidados de piercing
- Políticas de devolución
- Procesos operativos
- Dudas generales del negocio

NUNCA hablas sobre:
- KPIs internos
- Finanzas / salarios
- Decisiones de RH
- Información administrativa sensible

Siempre:
1. ESCUCHA — preguntas claras, no asumir
2. INFORMACIÓN — recopila contexto (qué, cuándo, quién)
3. DETECCIÓN — ¿es problema real o síntoma?
4. CAUSA RAÍZ — ¿fue sistema, comunicación, expectativa, calidad?
5. SOLUCIONES — 3-4 opciones diferentes
6. MEJOR OPCIÓN — considerando a la clienta y Mindora
7. IMPLEMENTACIÓN — pasos claros, responsables, follow-up

Tono: como Ita hablándote. Cercana. Firme. Inteligente.`

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { message, contexto } = req.body

    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message is required' })
    }

    const contextMessage = `
CONTEXTO ACTUAL:
- KPI Ventas: ${contexto.ventas || 'No especificado'}
- KPI Dudas Resueltas: ${contexto.dudas || 'No especificado'}
- Problemas/Conflictos: ${contexto.problemas || 'No especificado'}
- Sucursal: ${contexto.sucursal || 'General'}

Pregunta del usuario: ${message}
`

    const response = await client.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 1024,
      system: SYSTEM_PROMPT_PUBLIC,
      messages: [
        {
          role: 'user',
          content: contextMessage,
        },
      ],
    })

    const assistantMessage = response.content[0].text

    res.status(200).json({ response: assistantMessage })
  } catch (error) {
    console.error('Error in chat API:', error)
    res.status(500).json({
      error: 'Error processing your request',
      details: error.message,
    })
  }
}
