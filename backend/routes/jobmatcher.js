import express from 'express'
import Groq from 'groq-sdk'

const router = express.Router()
const client = new Groq({ apiKey: process.env.GROQ_API_KEY })

router.post('/', async (req, res) => {
  const { profile, jobs } = req.body

  if (!profile || !jobs) {
    return res.status(400).json({ error: 'Profile and jobs are required' })
  }

  try {
    const message = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 2000,
      messages: [
        {
          role: 'system',
          content: `You are a career matching expert for finance, banking, and fintech roles.
For each job evaluate and return in exactly this format:

---
JOB: [Job Title — Company]
MATCH SCORE: [number 0-100]
PRIORITY: [High / Medium / Low]
WHY IT FITS:
- [specific reason 1]
- [specific reason 2]
GAPS:
- [honest gap 1]
- [honest gap 2]
HOW TO BRIDGE: [one concrete action]
---

After all jobs:

RECOMMENDED APPLY ORDER:
1. [Job title] — [one sentence why]
2. [Job title] — [one sentence]
3. [Job title] — [one sentence]

OVERALL STRATEGY:
[2-3 sentences on positioning across applications]

Be realistic. Do not inflate scores.`
        },
        {
          role: 'user',
          content: `CANDIDATE PROFILE:\n${profile}\n\nJOBS TO EVALUATE:\n${jobs}`
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