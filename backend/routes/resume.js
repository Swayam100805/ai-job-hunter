import express from 'express'
import Anthropic from '@anthropic-ai/sdk'

const router = express.Router()
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

router.post('/', async (req, res) => {
  const { resume, jobDescription } = req.body

  if (!resume || !jobDescription) {
    return res.status(400).json({ error: 'Resume and job description are required' })
  }

  // Tell the browser we're streaming text
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')

  try {
    const stream = client.messages.stream({
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

    // Send each text chunk to the frontend as it arrives
    stream.on('text', (text) => {
      res.write(text)
    })

    stream.on('finalMessage', () => {
      res.end()
    })

    stream.on('error', (err) => {
      console.error('Stream error:', err)
      res.end()
    })

  } catch (err) {
    console.error('Route error:', err)
    res.status(500).json({ error: 'Something went wrong' })
  }
})

export default router