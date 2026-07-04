import { useState } from 'react'
import PageShell from '../components/PageShell'
import StreamBox from '../components/StreamBox'

const API = import.meta.env.VITE_API_URL

function ScoreBadge({ score }) {
  const color =
    score >= 80 ? 'text-green-400 border-green-400' :
    score >= 60 ? 'text-yellow-400 border-yellow-400' :
                  'text-red-400 border-red-400'

  return (
    <div className={`w-16 h-16 rounded-full border-2 flex items-center justify-center font-bold text-xl ${color}`}>
      {score}
    </div>
  )
}

export default function ResumeOptimizer() {
  const [resume, setResume]   = useState('')
  const [jd, setJd]           = useState('')
  const [result, setResult]   = useState('')
  const [loading, setLoading] = useState(false)
  const [score, setScore]     = useState(null)
  const [error, setError]     = useState('')

 Building an AI job hunter application - Claude

  function handleClear() {
    setResume('')
    setJd('')
    setResult('')
    setScore(null)
    setError('')
  }

  return (
    <PageShell
      icon="📄"
      title="Resume Optimizer"
      description="Paste your resume and a job description — get an ATS score, missing keywords, and rewritten bullets."
    >
      {/* Two column input */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
            Your Resume
          </label>
          <textarea
            value={resume}
            onChange={e => setResume(e.target.value)}
            placeholder="Paste your full resume text here…"
            rows={12}
            className="bg-gray-900 border border-gray-700 rounded-xl p-4 text-gray-200 text-sm
                       leading-relaxed resize-none outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
            Job Description
          </label>
          <textarea
            value={jd}
            onChange={e => setJd(e.target.value)}
            placeholder="Paste the job description you're targeting…"
            rows={12}
            className="bg-gray-900 border border-gray-700 rounded-xl p-4 text-gray-200 text-sm
                       leading-relaxed resize-none outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <p className="text-red-400 text-sm mb-3">{error}</p>
      )}

      {/* Actions */}
      <div className="flex items-center gap-4 flex-wrap">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed
                     text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
        >
          {loading ? 'Analyzing…' : '⚡ Optimize Resume'}
        </button>

        {result && (
          <>
            <button
              onClick={() => navigator.clipboard.writeText(result)}
              className="border border-gray-700 hover:border-gray-500 text-gray-400 hover:text-gray-200
                         px-4 py-3 rounded-xl transition-colors text-sm"
            >
              📋 Copy Result
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
          <div className="flex items-center gap-3 ml-auto">
            <ScoreBadge score={score} />
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide">ATS Match</p>
              <p className="text-sm font-semibold text-gray-200">
                {score >= 80 ? 'Strong match' : score >= 60 ? 'Needs work' : 'Significant gaps'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Streaming output */}
      <StreamBox text={result} loading={loading} />
    </PageShell>
  )
}