import { useState } from 'react'
import { Target, Zap, X } from 'lucide-react'
import PageShell from '../components/PageShell'
import StreamBox from '../components/StreamBox'
import { Textarea, PrimaryBtn, GhostBtn, ErrorMsg } from '../components/UI'

const API = import.meta.env.VITE_API_URL

function parseMatches(text) {
  return text.split('---').filter(b => b.trim()).map(block => {
    const job   = block.match(/JOB:\s*(.+)/)
    const score = block.match(/MATCH SCORE:\s*(\d+)/)
    const pri   = block.match(/PRIORITY:\s*(High|Medium|Low)/i)
    if (!job || !score) return null
    return { title: job[1].trim(), score: parseInt(score[1]), priority: pri?.[1] }
  }).filter(Boolean)
}

const PRI_STYLE = {
  High:   'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  Medium: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  Low:    'bg-red-500/10 text-red-400 border-red-500/20',
}

export default function JobMatcher() {
  const [profile, setProfile] = useState('')
  const [jobs, setJobs]       = useState('')
  const [result, setResult]   = useState('')
  const [loading, setLoading] = useState(false)
  const [matches, setMatches] = useState([])
  const [error, setError]     = useState('')

  async function handleSubmit() {
    if (!profile.trim() || !jobs.trim()) { setError('Both fields required.'); return }
    setError(''); setResult(''); setMatches([]); setLoading(true)
    try {
      const res = await fetch(`${API}/api/jobmatcher`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile, jobs })
      })
      if (!res.ok) throw new Error()
      const data = await res.json()
      setResult(data.result)
      setMatches(parseMatches(data.result))
    } catch { setError('Request failed. Check your connection.') }
    finally { setLoading(false) }
  }

  return (
    <PageShell
      icon={Target}
      title="Job matcher"
      badge="Fit scoring · Gap analysis"
      description="Score your profile against multiple roles simultaneously. Get ranked apply order and gap-bridging actions."
    >
      <div className="grid grid-cols-2 gap-4 mb-4">
        <Textarea label="Your profile" value={profile} onChange={setProfile}
          placeholder={"Summarize your background:\n— Degree, college, grad year\n— Projects + tech\n— Certifications\n— Target roles"}
          rows={12} onFileUpload={setProfile} />
        <Textarea label="Jobs to evaluate" value={jobs} onChange={setJobs}
          placeholder={"One per line:\n1. Role — Company\n2. Role — Company\n\nOr paste full JDs for deeper analysis."}
          rows={12} onFileUpload={setJobs} />
      </div>

      <ErrorMsg message={error} />

      <div className="flex items-center gap-3 mt-4 flex-wrap">
        <PrimaryBtn onClick={handleSubmit} disabled={loading} icon={Zap}>
          {loading ? 'Matching…' : 'Match jobs'}
        </PrimaryBtn>
        {result && <GhostBtn icon={X} onClick={() => { setProfile(''); setJobs(''); setResult(''); setMatches([]) }}>Clear</GhostBtn>}
      </div>

      {/* Live match cards */}
      {matches.length > 0 && (
        <div className="mt-5 grid grid-cols-1 gap-2">
          <p className="text-[10px] font-semibold text-zinc-600 uppercase tracking-widest mb-1">Live match scores</p>
          {matches.map((m, i) => {
            const color = m.score >= 80 ? '#34d399' : m.score >= 60 ? '#fbbf24' : '#f87171'
            return (
              <div key={i} className="flex items-center gap-4 px-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-xl">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-zinc-200 font-medium truncate">{m.title}</p>
                </div>
                {m.priority && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${PRI_STYLE[m.priority] || ''}`}>
                    {m.priority}
                  </span>
                )}
                <div className="flex items-center gap-2 shrink-0">
                  <div className="w-20 h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${m.score}%`, background: color }} />
                  </div>
                  <span className="text-sm font-bold w-8 text-right" style={{ color }}>{m.score}</span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <StreamBox text={result} loading={loading} />
    </PageShell>
  )
}