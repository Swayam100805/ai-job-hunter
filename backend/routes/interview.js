import express from 'express'
import Anthropic from '@anthropic-ai/sdk'

const router = express.Router()
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

// Route 1 — Generate a question
router.post('/question', async (req, res) => {
  const { role, company, type } = req.body

  if (!role) {
    return res.status(400).json({ error: 'Role is required' })
  }

  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')
  res.flushHeaders()

  const typeInstructions = {
    behavioral:  'A behavioral question using the STAR format. Focus on teamwork, leadership, or handling failure.',
    technical:   'A technical question specific to finance or fintech — financial modelling, risk metrics, or data analysis.',
    finance:     'A conceptual finance question — valuation, markets, accounting, or instruments.',
    'case study':'A mini case study: give a business scenario and ask the candidate to walk through their analysis.',
    hr:          'An HR / fit question about motivation, career goals, or why this firm.',
  }

  try {
    const stream = client.messages.stream({
      model: 'claude-sonnet-4-6',
      max_tokens: 600,
      system: `You are a senior interviewer at a top investment bank or fintech firm.
Generate ONE high-quality interview question and return in exactly this format:

QUESTION:
[The full question — be specific to the role and company if provided]

WHAT THE INTERVIEWER IS TESTING:
[2-3 sentences on the real intent behind this question]

TIPS TO ANSWER WELL:
- [tip 1]
- [tip 2]
- [tip 3]

COMMON MISTAKE TO AVOID:
[One specific thing candidates get wrong on this question]`,
      messages: [
        {
          role: 'user',
          content: `Role: ${role}\nCompany: ${company || 'a top firm'}\nQuestion type: ${typeInstructions[type] || typeInstructions['behavioral']}`
        }
      ]
    })

    stream.on('text', (text) => res.write(text))
    stream.on('finalMessage', () => res.end())
    stream.on('error', () => res.end())

  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Something went wrong' })
  }
})

// Route 2 — Evaluate the candidate's answer
router.post('/evaluate', async (req, res) => {
  const { question, answer, role } = req.body

  if (!question || !answer) {
    return res.status(400).json({ error: 'Question and answer are required' })
  }

  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')

  try {
    const stream = client.messages.stream({
      model: 'claude-sonnet-4-6',
      max_tokens: 1000,
      system: `You are an interview coach evaluating a candidate's answer for a ${role || 'finance'} role.
Return in exactly this format:

SCORE: [number 0-100]

STRENGTHS:
- [what they did well 1]
- [what they did well 2]

IMPROVEMENTS:
- [specific fix 1 — say exactly what to change]
- [specific fix 2 — say exactly what to change]

STRUCTURE CHECK:
[Did they use STAR / PAR format? What was missing?]

MODEL ANSWER:
[A strong sample answer to this exact question — 150-200 words, STAR format]

Be honest. A 90+ score means near-perfect delivery.`,
      messages: [
        {
          role: 'user',
          content: `QUESTION:\n${question}\n\nCANDIDATE ANSWER:\n${answer}`
        }
      ]
    })

    stream.on('text', (text) => res.write(text))
    stream.on('finalMessage', () => res.end())
    stream.on('error', () => res.end())

  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Something went wrong' })
  }
})

export default router