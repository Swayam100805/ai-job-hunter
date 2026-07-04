import express from 'express'
import Anthropic from '@anthropic-ai/sdk'

const router = express.Router()
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

router.post('/', async (req, res) => {
  const { profile, jobs } = req.body

  if (!profile || !jobs) {
    return res.status(400).json({ error: 'Profile and jobs are required' })
  }

  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')

  try {
    const stream = client.messages.stream({
      model: 'claude-sonnet-4-6',
      max_tokens: 2000,
      system: `You are a career matching expert for finance, banking, and fintech roles.
Given a candidate profile and list of jobs, evaluate each one and return in exactly this format:

For each job:
---
JOB: [Job Title — Company]
MATCH SCORE: [number 0-100]
PRIORITY: [High / Medium / Low]
WHY IT FITS:
- [specific reason 1 tied to candidate's actual experience]
- [specific reason 2 tied to candidate's actual experience]
GAPS:
- [honest gap 1]
- [honest gap 2]
HOW TO BRIDGE: [one concrete action to close the biggest gap]
---

After all jobs:

RECOMMENDED APPLY ORDER:
1. [Job title] — [one sentence why this is #1]
2. [Job title] — [one sentence]
3. [Job title] — [one sentence]

OVERALL STRATEGY:
[2-3 sentences on how this candidate should position themselves across these applications]

Be realistic. Do not inflate scores. A 90+ score means near-perfect fit.`,
      messages: [
        {
          role: 'user',
          content: `CANDIDATE PROFILE:\n${profile}\n\nJOBS TO EVALUATE:\n${jobs}`
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