import express from 'express'
import Groq from 'groq-sdk'

const router = express.Router()
const client = new Groq({ apiKey: process.env.GROQ_API_KEY })

router.post('/', async (req, res) => {
  const { headline, about, experience } = req.body

  if (!headline || !about) {
    return res.status(400).json({ error: 'Headline and About section are required' })
  }

  try {
    const message = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 1500,
      messages: [
        {
          role: 'system',
          content: `You are a LinkedIn profile coach for finance, banking, and fintech professionals.
Review the profile and return in exactly this format:

HEADLINE SCORE: [number 0-100]
HEADLINE REWRITE:
[rewritten headline under 220 characters]

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
3. [specific action]`
        },
        {
          role: 'user',
          content: `HEADLINE: ${headline}\n\nABOUT:\n${about}\n\nEXPERIENCE:\n${experience || 'Not provided'}`
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