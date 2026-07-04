import { useState } from 'react'
import PageShell from '../components/PageShell'
import StreamBox from '../components/StreamBox'

const API = import.meta.env.VITE_API_URL

// Parses "MATCH SCORE: 78" patterns out of streamed text
// Returns array of { title, score, priority } for each job found so far
function parseJobScores(text) {
  const results = []
  const blocks = text.split('---').filter(b => b.trim())

  for (const block of blocks) {
    const jobMatch      = block.match(/JOB:\s*(.+)/)
    const scoreMatch    = block.match(/MATCH SCORE:\s*(\d+)/)
    const priorityMatch = block.match(/PRIORITY:\s*(High|Medium|Low)/i)

    if (jobMatch && scoreMatch) {
      results.push({
        title:    jobMatch[1].trim(),
        score:    parseInt(scoreMatch[1]),
        priority: priorityMatch ? priorityMatch[1] : null,
      })
    }
  }
  return results
}

const PRIORITY_STYLES = {
  High:   'bg-green-900/40 text-green-400 border border-green-700',
  Medium: 'bg-yellow-900/40 text-yellow-400 border border-yellow-700',
  Low:    'bg-red-900/40 text-red-400 border border-red-700',
}

const SCORE_COLOR = (s) =>
  s >= 80 ? 'text-green-400' : s >= 60 ? 'text-yellow-400' : 'text-red-400'

function MatchCard({ title, score, priority }) {
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 flex items-center justify-between gap-4">
      <p className="text-sm text-gray-200 font-medium truncate flex-1">{title}</p>
      <div className="flex items-center gap-3 shrink-0">
        {priority && (
          <span className={`text-xs font-semibold px-2 py-1 rounded-md ${PRIORITY_STYLES[priority] || ''}`}>
            {priority}
          </span>
        )}
        <span className={`text-xl font-bold w-10 text-right ${SCORE_COLOR(score)}`}>
          {score}
        </span>
      </div>
    </div>
  )
}

const EXAMPLE_PROFILE = `Final year ECE student at SPIT Mumbai (2027 grad).
Projects: ITC Ltd DCF Model (10-year 3-statement, WACC, peer beta), Portfolio Risk Dashboard (VaR, CVaR, Monte Carlo, Streamlit, NSE equities), FinEmo AI (NLP behavioral finance, Top 20 IIT Kanpur ShARE).
Certifications: CFI Corporate Finance, CFI Accounting Fundamentals, J.P. Morgan Forage simulation.
Skills: Python, Excel, Financial Modelling, Risk Analytics, SQL.
Target: Investment Banking / Risk / Fintech roles, Mumbai.`

const EXAMPLE_JOBS = `1. CIB Research & Analytics — J.P. Morgan Mumbai
2. Global Risk & Compliance Analyst — J.P. Morgan
3. Investment Banking Analyst — Kotak Mahindra Bank
4. Risk Analyst — HDFC Bank
5. Fintech Analyst — Razorpay`

export default function JobMatcher() {
  const [profile, setProfile] = useState('')
  const [jobs, setJobs]       = useState('')
  const [result, setResult]   = useState('')
  const [loading, setLoading] = useState(false)
  const [matches, setMatches] = useState([])
  const [error, setError]     = useState('')

  async function handleSubmit() {
    if (!profile.trim() || !jobs.trim()) {
      setError('Both profile and jobs are required.')
      return
    }
    setError('')
    setResult('')
    setMatches([])
    setLoading(true)

    try {
      const response = await fetch(`${API}/api/jobmatcher`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile, jobs })
      })

      if (!response.ok) throw new Error('Server error')

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let full = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        full += decoder.decode(value)
        setResult(full)

        // Parse and update match cards live as each job block streams in
        const parsed = parseJobScores(full)
        if (parsed.length > 0) setMatches(parsed)
      }
    } catch (err) {
      setError('Something went wrong. Is your backend running?')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  function handleClear() {
    setProfile('')
    setJobs('')
    setResult('')
    setMatches([])
    setError('')
  }

  function loadExample() {
    setProfile(EXAMPLE_PROFILE)
    setJobs(EXAMPLE_JOBS)
  }

  return (
    <PageShell
      icon="🧲"
      title="Job Matcher"
      description="Paste your profile and a list of jobs — get match scores, gap analysis, and a ranked apply order."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Profile */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
              Your Profile
            </label>
            <button
              onClick={loadExample}
              className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Load example
            </button>
          </div>
          <textarea
            value={profile}
            onChange={e => setProfile(e.target.value)}
            placeholder={`Summarize your background:\n- Degree, college, grad year\n- Key projects + tech used\n- Certifications\n- Skills\n- Target location / role type`}
            rows={12}
            className="bg-gray-900 border border-gray-700 rounded-xl p-4 text-gray-200 text-sm
                       leading-relaxed resize-none outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        {/* Jobs */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
            Jobs to Evaluate
          </label>
          <textarea
            value={jobs}
            onChange={e => setJobs(e.target.value)}
            placeholder={`List jobs — one per line:\n1. Role — Company\n2. Role — Company\n\nOr paste full JDs for deeper analysis.`}
            rows={12}
            className="bg-gray-900 border border-gray-700 rounded-xl p-4 text-gray-200 text-sm
                       leading-relaxed resize-none outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
      </div>

      {error && <p className="text-red-400 text-sm mb-3">{error}</p>}

      {/* Actions */}
      <div className="flex items-center gap-4 flex-wrap mb-4">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed
                     text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
        >
          {loading ? 'Matching…' : '🧲 Match Jobs'}
        </button>

        {result && (
          <>
            <button
              onClick={() => navigator.clipboard.writeText(result)}
              className="border border-gray-700 hover:border-gray-500 text-gray-400 hover:text-gray-200
                         px-4 py-3 rounded-xl transition-colors text-sm"
            >
              📋 Copy
            </button>
            <button
              onClick={handleClear}
              className="text-gray-600 hover:text-gray-400 text-sm transition-colors"
            >
              Clear
            </button>
          </>
        )}
      </div>

      {/* Live match cards — appear as each job streams in */}
      {matches.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
            Live Match Scores
          </p>
          <div className="flex flex-col gap-2">
            {matches.map((m, i) => (
              <MatchCard key={i} title={m.title} score={m.score} priority={m.priority} />
            ))}
          </div>
        </div>
      )}

      <StreamBox text={result} loading={loading} />
    </PageShell>
  )
}