import express from 'express'
import Groq from 'groq-sdk'

const router = express.Router()
const client = new Groq({ apiKey: process.env.GROQ_API_KEY })

router.post('/question', async (req, res) => {
  const { role, company, type } = req.body

  if (!role) {
    return res.status(400).json({ error: 'Role is required' })
  }

  const typeInstructions = {
    behavioral:  'A behavioral question using STAR format. Focus on teamwork, leadership, or handling failure.',
    technical:   'A technical question specific to finance or fintech — modelling, risk metrics, or data analysis.',
    finance:     'A conceptual finance question — valuation, markets, accounting, or instruments.',
    'case study':'A mini case study: give a business scenario and ask the candidate to walk through their analysis.',
    hr:          'An HR/fit question about motivation, career goals, or why this firm.',
  }

  try {
    const message = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 600,
      messages: [
        {
          role: 'system',
          content: `You are a senior interviewer at a top investment bank or fintech firm.
Generate ONE high-quality interview question in exactly this format:

QUESTION:
[The full question]

WHAT THE INTERVIEWER IS TESTING:
[2-3 sentences on the real intent]

TIPS TO ANSWER WELL:
- [tip 1]
- [tip 2]
- [tip 3]

COMMON MISTAKE TO AVOID:
[One specific thing candidates get wrong]`
        },
        {
          role: 'user',
          content: `Role: ${role}\nCompany: ${company || 'a top firm'}\nQuestion type: ${typeInstructions[type] || typeInstructions['behavioral']}`
        }
      ]
    })

    res.json({ result: message.choices[0].message.content })

  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Something went wrong' })
  }
})

router.post('/evaluate', async (req, res) => {
  const { question, answer, role } = req.body

  if (!question || !answer) {
    return res.status(400).json({ error: 'Question and answer are required' })
  }

  try {
    const message = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 1000,
      messages: [
        {
          role: 'system',
          content: `You are an interview coach evaluating a candidate's answer for a ${role || 'finance'} role.
Return in exactly this format:

SCORE: [number 0-100]

STRENGTHS:
- [what they did well 1]
- [what they did well 2]

IMPROVEMENTS:
- [specific fix 1]
- [specific fix 2]

STRUCTURE CHECK:
[Did they use STAR/PAR format? What was missing?]

MODEL ANSWER:
[A strong sample answer — 150-200 words, STAR format]

Be honest. A 90+ score means near-perfect delivery.`
        },
        {
          role: 'user',
          content: `QUESTION:\n${question}\n\nCANDIDATE ANSWER:\n${answer}`
        }
      ]
    })

    res.json({ result: message.choices[0].message.content })

  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Something went wrong' })
  }
})

export default router