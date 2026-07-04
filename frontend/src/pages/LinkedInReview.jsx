import { useState } from 'react'
import PageShell from '../components/PageShell'
import StreamBox from '../components/StreamBox'

const API = import.meta.env.VITE_API_URL

function ScorePill({ label, score }) {
  const color =
    score >= 80 ? 'bg-green-900/40 text-green-400 border-green-700' :
    score >= 60 ? 'bg-yellow-900/40 text-yellow-400 border-yellow-700' :
                  'bg-red-900/40 text-red-400 border-red-700'

  return (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-semibold ${color}`}>
      <span>{label}</span>
      <span className="text-lg font-bold">{score}</span>
    </div>
  )
}

export default function LinkedInReview() {
  const [headline, setHeadline]     = useState('')
  const [about, setAbout]           = useState('')
  const [experience, setExperience] = useState('')
  const [result, setResult]         = useState('')
  const [loading, setLoading]       = useState(false)
  const [scores, setScores]         = useState(null)
  const [error, setError]           = useState('')

  async function handleSubmit() {
    if (!headline.trim() || !about.trim()) {
      setError('Headline and About section are required.')
      return
    }
    setError('')
    setResult('')
    setScores(null)
    setLoading(true)

    try {
      const response = await fetch(`${API}/api/linkedin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ headline, about, experience })
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

        // Parse both scores as they stream in
        const h = full.match(/HEADLINE SCORE:\s*(\d+)/)
        const a = full.match(/ABOUT SCORE:\s*(\d+)/)
        if (h || a) {
          setScores({
            headline: h ? parseInt(h[1]) : null,
            about: a ? parseInt(a[1]) : null,
          })
        }
      }
    } catch (err) {
      setError('Something went wrong. Is your backend running?')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  function handleClear() {
    setHeadline('')
    setAbout('')
    setExperience('')
    setResult('')
    setScores(null)
    setError('')
  }

  return (
    <PageShell
      icon="💼"
      title="LinkedIn Profile Review"
      description="Get your headline and About section scored, rewritten, and optimized for recruiter search."
    >
      {/* Headline — single line input */}
      <div className="flex flex-col gap-2 mb-4">
        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
          Your Headline
        </label>
        <input
          value={headline}
          onChange={e => setHeadline(e.target.value)}
          placeholder='e.g. "Final Year ECE Student | Finance & Risk Analytics | DCF Models · VaR · Python"'
          className="bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-gray-200 text-sm
                     outline-none focus:border-indigo-500 transition-colors"
        />
        <p className="text-xs text-gray-600">{headline.length} / 220 characters</p>
      </div>

      {/* About + Experience side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
            About Section
          </label>
          <textarea
            value={about}
            onChange={e => setAbout(e.target.value)}
            placeholder="Paste your LinkedIn About / Summary section…"
            rows={10}
            className="bg-gray-900 border border-gray-700 rounded-xl p-4 text-gray-200 text-sm
                       leading-relaxed resize-none outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
            Experience Bullets <span className="text-gray-600 normal-case font-normal">(optional)</span>
          </label>
          <textarea
            value={experience}
            onChange={e => setExperience(e.target.value)}
            placeholder="Paste key experience descriptions from your LinkedIn roles…"
            rows={10}
            className="bg-gray-900 border border-gray-700 rounded-xl p-4 text-gray-200 text-sm
                       leading-relaxed resize-none outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
      </div>

      {error && <p className="text-red-400 text-sm mb-3">{error}</p>}

      {/* Actions + scores */}
      <div className="flex items-center gap-4 flex-wrap">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed
                     text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
        >
          {loading ? 'Reviewing…' : '🔍 Review Profile'}
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

        {scores && (
          <div className="flex items-center gap-3 ml-auto flex-wrap">
            {scores.headline && <ScorePill label="Headline" score={scores.headline} />}
            {scores.about    && <ScorePill label="About"    score={scores.about} />}
          </div>
        )}
      </div>

      <StreamBox text={result} loading={loading} />
    </PageShell>
  )
}