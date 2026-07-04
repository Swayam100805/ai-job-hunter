import express from 'express'
import Groq from 'groq-sdk'

const router = express.Router()
const client = new Groq({ apiKey: process.env.GROQ_API_KEY })

router.post('/', async (req, res) => {
  const { projects, targetRole, techStack } = req.body

  if (!projects || !targetRole) {
    return res.status(400).json({ error: 'Projects and target role are required' })
  }

  try {
    const message = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 1500,
      messages: [
        {
          role: 'system',
          content: `You are a technical portfolio reviewer for finance, quant, and fintech hiring managers.
Evaluate the candidate's projects and return in exactly this format:

PORTFOLIO SCORE: [number 0-100]

PROJECT NARRATIVES:
[Project Name]
- Problem: [what problem did this solve]
- Action: [what you specifically built/did]
- Result: [quantified outcome or learning]

STANDOUT FACTOR:
[What makes this portfolio unique vs other candidates]

GAPS TO FILL:
- [Missing project type 1 — why it matters]
- [Missing project type 2 — why it matters]

GITHUB PRESENTATION TIPS:
- [tip 1]
- [tip 2]
- [tip 3]

INTERVIEW ONE-LINER:
[A single confident sentence to open with when asked about projects]`
        },
        {
          role: 'user',
          content: `TARGET ROLE: ${targetRole}\nTECH STACK: ${techStack || 'Not specified'}\n\nPROJECTS:\n${projects}`
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