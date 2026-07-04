import { useState } from 'react'
import { User, Search, X } from 'lucide-react'
import PageShell from '../components/PageShell'
import StreamBox from '../components/StreamBox'
import { Input, Textarea, PrimaryBtn, GhostBtn, ScoreRing, ErrorMsg } from '../components/UI'

const API = import.meta.env.VITE_API_URL

export default function LinkedInReview() {
  const [headline, setHeadline]     = useState('')
  const [about, setAbout]           = useState('')
  const [experience, setExperience] = useState('')
  const [result, setResult]         = useState('')
  const [loading, setLoading]       = useState(false)
  const [scores, setScores]         = useState(null)
  const [error, setError]           = useState('')

  async function handleSubmit() {
    if (!headline.trim() || !about.trim()) { setError('Headline and About are required.'); return }
    setError(''); setResult(''); setScores(null); setLoading(true)
    try {
      const res = await fetch(`${API}/api/linkedin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ headline, about, experience })
      })
      if (!res.ok) throw new Error()
      const data = await res.json()
      setResult(data.result)
      const h = data.result.match(/HEADLINE SCORE:\s*(\d+)/)
      const a = data.result.match(/ABOUT SCORE:\s*(\d+)/)
      if (h || a) setScores({ headline: h ? parseInt(h[1]) : null, about: a ? parseInt(a[1]) : null })
    } catch { setError('Request failed. Check your connection.') }
    finally { setLoading(false) }
  }

  return (
    <PageShell
      icon={User}
      title="LinkedIn profile audit"
      badge="SSI · Recruiter visibility"
      description="Score your headline and About section, get rewrites optimized for recruiter search and algorithmic reach."
    >
      <div className="flex flex-col gap-4 mb-4">
        <div>
          <Input label="Your headline" value={headline} onChange={setHeadline}
            placeholder='e.g. "Final Year ECE · Finance & Risk Analytics · DCF · VaR · Python"' />
          <p className="text-[10px] text-zinc-600 mt-1.5 ml-1">{headline.length} / 220 characters</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Textarea label="About section" value={about} onChange={setAbout}
            placeholder="Paste your LinkedIn About section…" rows={10} onFileUpload={setAbout} />
          <Textarea label="Experience bullets" value={experience} onChange={setExperience}
            placeholder="Paste key experience descriptions…" rows={10} onFileUpload={setExperience} />
        </div>
      </div>

      <ErrorMsg message={error} />

      <div className="flex items-center gap-3 mt-4 flex-wrap">
        <PrimaryBtn onClick={handleSubmit} disabled={loading} icon={Search}>
          {loading ? 'Reviewing…' : 'Audit profile'}
        </PrimaryBtn>
        {result && <GhostBtn icon={X} onClick={() => { setHeadline(''); setAbout(''); setExperience(''); setResult(''); setScores(null) }}>Clear</GhostBtn>}
        {scores?.headline && <ScoreRing score={scores.headline} label="Headline" />}
        {scores?.about && <ScoreRing score={scores.about} label="About" />}
      </div>

      <StreamBox text={result} loading={loading} />
    </PageShell>
  )
}