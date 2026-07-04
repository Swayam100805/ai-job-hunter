import express from 'express'
import Groq from 'groq-sdk'

const router = express.Router()
const client = new Groq({ apiKey: process.env.GROQ_API_KEY })

router.post('/', async (req, res) => {
  const { resume, jobDescription, tone, recipientName, companyName } = req.body

  if (!resume || !jobDescription) {
    return res.status(400).json({ error: 'Resume and job description are required' })
  }

  const toneInstructions = {
    professional:  'Formal, precise, and confident. Standard banking tone.',
    confident:     'Bold and direct. Lead with achievements, not humility.',
    'story-driven':'Open with a specific moment or insight that led you to this field. Make it personal but professional.',
    concise:       'Under 200 words total. Every sentence must earn its place. No filler.',
  }

  try {
    const message = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 1000,
      messages: [
        {
          role: 'system',
          content: `You are an expert cover letter writer for investment banking, finance, and fintech roles.

STRICT RULES:
- Maximum 3 paragraphs
- Under 300 words
- Never open with "I am writing to apply" or "I am excited to"
- Open with a specific insight about the firm or role
- Paragraph 2: connect exactly 2 specific projects from the resume to the role
- Paragraph 3: confident closing with next-step ask
- Only use facts from the resume — never fabricate
- Tone: ${toneInstructions[tone] || toneInstructions['professional']}

After the letter add:
---
WORD COUNT: [number]
STRENGTH: [one sentence on what makes this letter effective]
ONE THING TO CHANGE: [honest suggestion]`
        },
        {
          role: 'user',
          content: `RESUME:\n${resume}\n\nJOB DESCRIPTION:\n${jobDescription}\n\nRECIPIENT: ${recipientName || 'Hiring Manager'}\nCOMPANY: ${companyName || 'the company'}`
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