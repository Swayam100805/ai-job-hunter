import { useState } from 'react'
import { FileText, Zap, X } from 'lucide-react'
import PageShell from '../components/PageShell'
import StreamBox from '../components/StreamBox'
import { Textarea, PrimaryBtn, GhostBtn, ScoreRing, ErrorMsg } from '../components/UI'

const API = import.meta.env.VITE_API_URL

export default function ResumeOptimizer() {
  const [resume, setResume]   = useState('')
  const [jd, setJd]           = useState('')
  const [result, setResult]   = useState('')
  const [loading, setLoading] = useState(false)
  const [score, setScore]     = useState(null)
  const [error, setError]     = useState('')

  async function handleSubmit() {
    if (!resume.trim() || !jd.trim()) { setError('Both fields are required.'); return }
    setError(''); setResult(''); setScore(null); setLoading(true)
    try {
      const res = await fetch(`${API}/api/resume`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume, jobDescription: jd })
      })
      if (!res.ok) throw new Error()
      const data = await res.json()
      setResult(data.result)
      const m = data.result.match(/SCORE:\s*(\d+)/)
      if (m) setScore(parseInt(m[1]))
    } catch { setError('Request failed. Check your connection.') }
    finally { setLoading(false) }
  }

  return (
    <PageShell
      icon={FileText}
      title="Resume optimizer"
      badge="ATS · Powered by AI"
      description="Paste your resume and a target job description — get a precise ATS match score, missing keywords, and rewritten impact bullets."
    >
      {/* Dual editor */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <Textarea
          label="Your resume"
          value={resume}
          onChange={setResume}
          placeholder="Paste your full resume text here…"
          rows={12}
          onFileUpload={setResume}
        />
        <Textarea
          label="Job description"
          value={jd}
          onChange={setJd}
          placeholder="Paste the target job description…"
          rows={12}
          onFileUpload={setJd}
        />
      </div>

      <ErrorMsg message={error} />

      {/* Actions row */}
      <div className="flex items-center gap-3 mt-4 flex-wrap">
        <PrimaryBtn onClick={handleSubmit} disabled={loading} icon={Zap}>
          {loading ? 'Analyzing…' : 'Optimize resume'}
        </PrimaryBtn>

        {result && (
          <GhostBtn icon={X} onClick={() => { setResume(''); setJd(''); setResult(''); setScore(null) }}>
            Clear
          </GhostBtn>
        )}

        {score !== null && <ScoreRing score={score} label="ATS Match" />}
      </div>

      <StreamBox text={result} loading={loading} />
    </PageShell>
  )
}