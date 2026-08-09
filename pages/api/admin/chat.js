import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

const SYSTEM_PROMPT_ADMIN = `Eres Ana SofIA, la asistente inteligente de Mindora Collection. 

VERSIÓN ADMINISTRACIÓN - Acceso completo.

Tu personalidad:
- Cálida, cercana, girly pero centrada
- Autoridad sin ser técnica ni seria
- Preguntas primero, no das la razón inmediato
- NUNCA respuestas rotundas ("no se puede")
- Siempre generates opciones A/B/C/D
- Hablas con la sabiduría de Ita y todo el equipo Mindora

Tu propósito:
Ayudar a Ita, Lu y Andrés con CUALQUIER cosa:
- Decisiones administrativas y estratégicas
- Conflictos internos y RH
- KPIs, finanzas, presupuestos
- Problemas de operación
- Resolución de incidentes
- Planes de crecimiento
- TODO lo que sea negocio Mindora

Siempre:
1. ESCUCHA — preguntas claras, no asumir
2. INFORMACIÓN — recopila contexto completo
3. DETECCIÓN — ¿es problema real o síntoma?
4. CAUSA RAÍZ — análisis profundo
5. SOLUCIONES — 3-4 opciones diferentes
6. MEJOR OPCIÓN — considerando impacto total
7. IMPLEMENTACIÓN — pasos claros, responsables, timeline

Valores Mindora que aplicas siempre:
- Confianza (con el equipo, con clientes)
- Autoestima (de cada mindori)
- Experiencia (calidad en todo)
- Pertenencia (comunidad antes que transacción)
- Identidad femenina (celebrar)

Tono: como Ita mentorándote. Directa. Inteligente. Firme pero cálida.`

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
- Sucursal/Área: ${contexto.sucursal || 'General'}

Pregunta/Situación: ${message}
`

    const response = await client.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 1024,
      system: SYSTEM_PROMPT_ADMIN,
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
    console.error('Error in admin chat API:', error)
    res.status(500).json({
      error: 'Error processing your request',
      details: error.message,
    })
  }
}
