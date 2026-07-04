import { useState } from 'react'
import { FolderOpen, Target, X } from 'lucide-react'
import PageShell from '../components/PageShell'
import StreamBox from '../components/StreamBox'
import { Input, Textarea, PrimaryBtn, GhostBtn, ScoreRing, ErrorMsg } from '../components/UI'

const API = import.meta.env.VITE_API_URL

export default function PortfolioReview() {
  const [projects, setProjects]     = useState('')
  const [targetRole, setTargetRole] = useState('')
  const [techStack, setTechStack]   = useState('')
  const [result, setResult]         = useState('')
  const [loading, setLoading]       = useState(false)
  const [score, setScore]           = useState(null)
  const [error, setError]           = useState('')

  async function handleSubmit() {
    if (!projects.trim() || !targetRole.trim()) { setError('Projects and target role are required.'); return }
    setError(''); setResult(''); setScore(null); setLoading(true)
    try {
      const res = await fetch(`${API}/api/portfolio`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projects, targetRole, techStack })
      })
      if (!res.ok) throw new Error()
      const data = await res.json()
      setResult(data.result)
      const m = data.result.match(/PORTFOLIO SCORE:\s*(\d+)/)
      if (m) setScore(parseInt(m[1]))
    } catch { setError('Request failed. Check your connection.') }
    finally { setLoading(false) }
  }

  return (
    <PageShell
      icon={FolderOpen}
      title="Portfolio coach"
      badge="PAR narratives · Gap analysis"
      description="Get interview-ready project narratives in PAR format, standout factor analysis, and GitHub presentation tips."
    >
      <div className="grid grid-cols-2 gap-4 mb-4">
        <Input label="Target role" value={targetRole} onChange={setTargetRole}
          placeholder="e.g. AI Engineer at AuxoAI" />
        <Input label="Tech stack" value={techStack} onChange={setTechStack}
          placeholder="e.g. Python, React, Node.js, SQL" />
      </div>
      <Textarea label="Your projects" value={projects} onChange={setProjects}
        placeholder={"Describe each project:\n1. Project Name — what you built, tech used, results/recognition\n2. …"}
        rows={10} onFileUpload={setProjects} />

      <ErrorMsg message={error} />

      <div className="flex items-center gap-3 mt-4 flex-wrap">
        <PrimaryBtn onClick={handleSubmit} disabled={loading} icon={Target}>
          {loading ? 'Reviewing…' : 'Coach portfolio'}
        </PrimaryBtn>
        {result && <GhostBtn icon={X} onClick={() => { setProjects(''); setResult(''); setScore(null) }}>Clear</GhostBtn>}
        {score !== null && <ScoreRing score={score} label="Portfolio strength" />}
      </div>
      <StreamBox text={result} loading={loading} />
    </PageShell>
  )
}