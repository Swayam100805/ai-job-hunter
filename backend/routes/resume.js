import express from 'express'
import Anthropic from '@anthropic-ai/sdk'

const router = express.Router()
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

router.post('/', async (req, res) => {
  const { resume, jobDescription } = req.body

  if (!resume || !jobDescription) {
    return res.status(400).json({ error: 'Resume and job description are required' })
  }

  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1500,
      system: `You are an elite resume optimizer for finance and tech roles.
Analyze the resume against the job description and return your response in exactly this format:

SCORE: [number 0-100]

ATS KEYWORDS MISSING:
- [keyword 1]
- [keyword 2]
- [keyword 3]

WEAK BULLETS TO REWRITE:
- Original: [paste original bullet]
  Rewrite: [improved version with numbers and impact]

STRUCTURE FIXES:
- [fix 1]
- [fix 2]

OPTIMIZED SUMMARY:
[3-sentence professional summary tailored to this role]

Be specific, honest, and actionable. Only use facts from the resume provided.`,
      messages: [
        {
          role: 'user',
          content: `RESUME:\n${resume}\n\nJOB DESCRIPTION:\n${jobDescription}`
        }
      ]
    })

    res.json({ result: message.content[0].text })

  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Something went wrong' })
  }
})

export default router