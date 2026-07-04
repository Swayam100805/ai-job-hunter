import express from 'express'
import Anthropic from '@anthropic-ai/sdk'

const router = express.Router()
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

router.post('/', async (req, res) => {
  const { headline, about, experience } = req.body

  if (!headline || !about) {
    return res.status(400).json({ error: 'Headline and About section are required' })
  }

  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')
  res.flushHeaders()

  try {
    const stream = client.messages.stream({
      model: 'claude-sonnet-4-6',
      max_tokens: 1500,
      system: `You are a LinkedIn profile coach for finance, banking, and fintech professionals.
Review the profile and return your response in exactly this format:

HEADLINE SCORE: [number 0-100]
HEADLINE REWRITE:
[rewritten headline — punchy, keyword-rich, under 220 characters]

ABOUT SCORE: [number 0-100]
ABOUT REWRITE:
[rewritten About section — hook in first 2 lines, story in middle, CTA at end, under 300 words]

EXPERIENCE FEEDBACK:
- [specific improvement 1]
- [specific improvement 2]
- [specific improvement 3]

KEYWORDS TO ADD:
- [keyword 1 — explain why]
- [keyword 2 — explain why]
- [keyword 3 — explain why]

TOP 3 ACTIONS THIS WEEK:
1. [specific action]
2. [specific action]
3. [specific action]

Be direct and specific. Focus on finance and banking recruiter visibility.`,
      messages: [
        {
          role: 'user',
          content: `HEADLINE: ${headline}\n\nABOUT:\n${about}\n\nEXPERIENCE:\n${experience || 'Not provided'}`
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