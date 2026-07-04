import { useState } from 'react'
import PageShell from '../components/PageShell'
import StreamBox from '../components/StreamBox'

const API = import.meta.env.VITE_API_URL

const SCORE_LABELS = {
  high:   { text: 'Strong portfolio',   color: 'text-green-400 border-green-400' },
  mid:    { text: 'Solid — needs depth', color: 'text-yellow-400 border-yellow-400' },
  low:    { text: 'Needs more projects', color: 'text-red-400 border-red-400' },
}

function PortfolioScore({ score }) {
  const tier = score >= 80 ? 'high' : score >= 60 ? 'mid' : 'low'
  const { text, color } = SCORE_LABELS[tier]

  return (
    <div className="flex items-center gap-4">
      <div className={`w-16 h-16 rounded-full border-2 flex items-center justify-center font-bold text-xl ${color}`}>
        {score}
      </div>
      <div>
        <p className="text-xs text-gray-400 uppercase tracking-wide">Portfolio Strength</p>
        <p className="text-sm font-semibold text-gray-200">{text}</p>
      </div>
    </div>
  )
}

// Pre-filled example so users understand the format expected
const EXAMPLE_PROJECTS = `1. ITC Ltd DCF Model
   Built a 10-year integrated 3-statement financial model with WACC derivation, peer beta analysis, and sensitivity tables. Used Excel with custom VBA macros.

2. Portfolio Risk Dashboard
   Built a Streamlit app modeling Historical VaR, CVaR, and Monte Carlo simulation on NSE equities. Data pulled via yfinance, visualized with Plotly.

3. FinEmo AI — Behavioral Finance Framework
   Developed an NLP-based sentiment analysis tool mapping market emotions to price movements. Top 20 finish at IIT Kanpur ShARE competition.`

export default function PortfolioReview() {
  const [projects, setProjects]     = useState('')
  const [targetRole, setTargetRole] = useState('')
  const [techStack, setTechStack]   = useState('')
  const [result, setResult]         = useState('')
  const [loading, setLoading]       = useState(false)
  const [score, setScore]           = useState(null)
  const [error, setError]           = useState('')
  const [showExample, setShowExample] = useState(false)

  async function handleSubmit() {
    if (!projects.trim() || !targetRole.trim()) {
      setError('Projects and target role are required.')
      return
    }
    setError('')
    setResult('')
    setScore(null)
    setLoading(true)

    try {
      const response = await fetch(`${API}/api/portfolio`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projects, targetRole, techStack })
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

        const match = full.match(/PORTFOLIO SCORE:\s*(\d+)/)
        if (match) setScore(parseInt(match[1]))
      }
    } catch (err) {
      setError('Something went wrong. Is your backend running?')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  function handleClear() {
    setProjects('')
    setTargetRole('')
    setTechStack('')
    setResult('')
    setScore(null)
    setError('')
    setShowExample(false)
  }

  function loadExample() {
    setProjects(EXAMPLE_PROJECTS)
    setTargetRole('CIB Research & Analytics, J.P. Morgan')
    setTechStack('Python, Excel, Streamlit, Plotly, yfinance, NLP')
    setShowExample(false)
  }

  return (
    <PageShell
      icon="🗂️"
      title="Portfolio Review"
      description="Get PAR-format interview narratives, gap analysis, and GitHub tips for your projects."
    >
      {/* Target role + tech stack row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
            Target Role
          </label>
          <input
            value={targetRole}
            onChange={e => setTargetRole(e.target.value)}
            placeholder="e.g. Investment Banking Analyst at J.P. Morgan"
            className="bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-gray-200 text-sm
                       outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
            Tech Stack <span className="text-gray-600 normal-case font-normal">(optional)</span>
          </label>
          <input
            value={techStack}
            onChange={e => setTechStack(e.target.value)}
            placeholder="e.g. Python, Excel, Streamlit, SQL"
            className="bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-gray-200 text-sm
                       outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
      </div>

      {/* Projects textarea */}
      <div className="flex flex-col gap-2 mb-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
            Your Projects
          </label>
          <button
            onClick={() => setShowExample(!showExample)}
            className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            {showExample ? 'Hide example' : 'See example format'}
          </button>
        </div>

        {/* Example format hint */}
        {showExample && (
          <div className="bg-gray-900 border border-indigo-900 rounded-xl p-4 text-xs text-gray-400 leading-relaxed">
            <p className="text-indigo-400 font-semibold mb-2">Example format:</p>
            <pre className="whitespace-pre-wrap font-sans">{EXAMPLE_PROJECTS}</pre>
            <button
              onClick={loadExample}
              className="mt-3 text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
            >
              Load this example →
            </button>
          </div>
        )}

        <textarea
          value={projects}
          onChange={e => setProjects(e.target.value)}
          placeholder={`Describe each project. Include:\n- What you built\n- Tech used\n- Any results or recognition\n\nNumber them: 1. Project Name...`}
          rows={10}
          className="bg-gray-900 border border-gray-700 rounded-xl p-4 text-gray-200 text-sm
                     leading-relaxed resize-none outline-none focus:border-indigo-500 transition-colors"
        />
      </div>

      {error && <p className="text-red-400 text-sm mb-3">{error}</p>}

      {/* Actions */}
      <div className="flex items-center gap-4 flex-wrap">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed
                     text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
        >
          {loading ? 'Reviewing…' : '🎯 Review Portfolio'}
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

        {score !== null && (
          <div className="ml-auto">
            <PortfolioScore score={score} />
          </div>
        )}
      </div>

      <StreamBox text={result} loading={loading} />
    </PageShell>
  )
}