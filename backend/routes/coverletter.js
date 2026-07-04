import express from 'express'
import Anthropic from '@anthropic-ai/sdk'

const router = express.Router()
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

router.post('/', async (req, res) => {
  const { resume, jobDescription, tone, recipientName, companyName } = req.body

  if (!resume || !jobDescription) {
    return res.status(400).json({ error: 'Resume and job description are required' })
  }

  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')

  const toneInstructions = {
    professional:  'Formal, precise, and confident. Standard banking tone.',
    confident:     'Bold and direct. Lead with achievements, not humility.',
    'story-driven':'Open with a specific moment or insight that led you to finance. Make it personal but professional.',
    concise:       'Under 200 words total. Every sentence must earn its place. No filler.',
  }

  try {
    const stream = client.messages.stream({
      model: 'claude-sonnet-4-6',
      max_tokens: 1000,
      system: `You are an expert cover letter writer for investment banking, finance, and fintech roles.

STRICT RULES:
- Maximum 3 paragraphs
- Under 300 words (under 200 if tone is concise)
- Never open with "I am writing to apply" or "I am excited to"
- Open with a specific insight about the firm, role, or industry
- Paragraph 2: connect exactly 2 specific projects/achievements from the resume to the role's needs
- Paragraph 3: confident closing with a specific next-step ask
- Only use facts from the resume — never fabricate anything
- No generic statements that could apply to any company

Tone: ${toneInstructions[tone] || toneInstructions['professional']}

After the letter, add:
---
WORD COUNT: [number]
STRENGTH: [one sentence on what makes this letter effective]
ONE THING TO CHANGE: [honest suggestion if anything could be stronger]`,
      messages: [
        {
          role: 'user',
          content: `RESUME:\n${resume}\n\nJOB DESCRIPTION:\n${jobDescription}\n\nRECIPIENT: ${recipientName || 'Hiring Manager'}\nCOMPANY: ${companyName || 'the company'}`
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