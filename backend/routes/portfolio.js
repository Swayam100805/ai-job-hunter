import express from 'express'
import Anthropic from '@anthropic-ai/sdk'

const router = express.Router()
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

router.post('/', async (req, res) => {
  const { projects, targetRole, techStack } = req.body

  if (!projects || !targetRole) {
    return res.status(400).json({ error: 'Projects and target role are required' })
  }

  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')
  res.flushHeaders()

  try {
    const stream = client.messages.stream({
      model: 'claude-sonnet-4-6',
      max_tokens: 1500,
      system: `You are a technical portfolio reviewer for finance, quant, and fintech hiring managers.
Evaluate the candidate's projects for the target role and return in exactly this format:

PORTFOLIO SCORE: [number 0-100]

PROJECT NARRATIVES:
For each project, write a PAR pitch (Problem → Action → Result) the candidate can use in interviews.
[Project Name]
- Problem: [what problem did this solve]
- Action: [what you specifically built/did]
- Result: [quantified outcome or learning]

STANDOUT FACTOR:
[What makes this portfolio unique vs other candidates for this role — be specific]

GAPS TO FILL:
- [Missing project type 1 — why it matters for this role]
- [Missing project type 2 — why it matters for this role]

GITHUB PRESENTATION TIPS:
- [tip 1]
- [tip 2]
- [tip 3]

INTERVIEW ONE-LINER:
[A single confident sentence the candidate can open with when asked "tell me about your projects"]

Be technically precise and recruiting-aware. Reward depth over breadth.`,
      messages: [
        {
          role: 'user',
          content: `TARGET ROLE: ${targetRole}\nTECH STACK: ${techStack || 'Not specified'}\n\nPROJECTS:\n${projects}`
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