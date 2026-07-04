import { useState } from 'react'
import PageShell from '../components/PageShell'
import StreamBox from '../components/StreamBox'

const API = import.meta.env.VITE_API_URL

const QUESTION_TYPES = [
  { id: 'behavioral',  label: '🤝 Behavioral' },
  { id: 'technical',   label: '⚙️ Technical' },
  { id: 'finance',     label: '📊 Finance' },
  { id: 'case study',  label: '🧩 Case Study' },
  { id: 'hr',          label: '💬 HR / Fit' },
]

const SCORE_CONFIG = (s) =>
  s >= 80 ? { color: 'text-green-400 border-green-400', label: 'Strong answer' } :
  s >= 60 ? { color: 'text-yellow-400 border-yellow-400', label: 'Needs polish' } :
            { color: 'text-red-400 border-red-400', label: 'Needs work' }

function ScoreBadge({ score }) {
  const { color, label } = SCORE_CONFIG(score)
  return (
    <div className="flex items-center gap-4">
      <div className={`w-16 h-16 rounded-full border-2 flex items-center justify-center font-bold text-xl ${color}`}>
        {score}
      </div>
      <div>
        <p className="text-xs text-gray-400 uppercase tracking-wide">Answer Score</p>
        <p className={`text-sm font-semibold ${color.split(' ')[0]}`}>{label}</p>
      </div>
    </div>
  )
}

// Pulls just the question text from the generated output
function extractQuestion(text) {
  const match = text.match(/QUESTION:\n([\s\S]*?)\n\nWHAT/)
  return match ? match[1].trim() : text
}

export default function InterviewPrep() {
  const [role, setRole]           = useState('')
  const [company, setCompany]     = useState('')
  const [type, setType]           = useState('behavioral')
  const [question, setQuestion]   = useState('')      // full streamed output
  const [answer, setAnswer]       = useState('')
  const [feedback, setFeedback]   = useState('')
  const [loading, setLoading]     = useState(false)
  const [stage, setStage]         = useState('setup') // setup | practice | feedback
  const [score, setScore]         = useState(null)
  const [error, setError]         = useState('')
  const [sessionCount, setSessionCount] = useState(0)

  async function generateQuestion() {
    if (!role.trim()) {
      setError('Please enter a target role.')
      return
    }
    setError('')
    setQuestion('')
    setAnswer('')
    setFeedback('')
    setScore(null)
    setLoading(true)
    setStage('setup')

    try {
      const response = await fetch(`${API}/api/interview/question`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, company, type })
      })

      if (!response.ok) throw new Error('Server error')

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let full = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        full += decoder.decode(value)
        setQuestion(full)
      }

      setStage('practice')
    } catch (err) {
      setError('Something went wrong. Is your backend running?')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function evaluateAnswer() {
    if (!answer.trim()) {
      setError('Please write your answer first.')
      return
    }
    setError('')
    setFeedback('')
    setScore(null)
    setLoading(true)

    try {
      const response = await fetch(`${API}/api/interview/evaluate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: extractQuestion(question),
          answer,
          role
        })
      })

      if (!response.ok) throw new Error('Server error')

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let full = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        full += decoder.decode(value)
        setFeedback(full)

        const match = full.match(/SCORE:\s*(\d+)/)
        if (match) setScore(parseInt(match[1]))
      }

      setStage('feedback')
      setSessionCount(prev => prev + 1)
    } catch (err) {
      setError('Something went wrong. Is your backend running?')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  function nextQuestion() {
    setQuestion('')
    setAnswer('')
    setFeedback('')
    setScore(null)
    setStage('setup')
  }

  return (
    <PageShell
      icon="🎤"
      title="Interview Prep"
      description="Generate role-specific questions, write your answer, get scored feedback and a model answer."
    >
      {/* Session counter */}
      {sessionCount > 0 && (
        <div className="mb-4 inline-flex items-center gap-2 bg-indigo-900/30 border border-indigo-700
                        text-indigo-300 text-xs font-semibold px-3 py-1.5 rounded-full">
          🔥 {sessionCount} question{sessionCount > 1 ? 's' : ''} practiced this session
        </div>
      )}

      {/* Step 1 — Setup */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-4">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">
          Step 1 — Configure
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
              Target Role
            </label>
            <input
              value={role}
              onChange={e => setRole(e.target.value)}
              placeholder="e.g. CIB Research & Analytics Analyst"
              className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-gray-200 text-sm
                         outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
              Company <span className="text-gray-600 normal-case font-normal">(optional)</span>
            </label>
            <input
              value={company}
              onChange={e => setCompany(e.target.value)}
              placeholder="e.g. J.P. Morgan"
              className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-gray-200 text-sm
                         outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
        </div>

        {/* Question type pills */}
        <div className="flex flex-wrap gap-2 mb-5">
          {QUESTION_TYPES.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setType(id)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-all
                ${type === id
                  ? 'border-indigo-500 bg-indigo-600/20 text-indigo-300'
                  : 'border-gray-700 text-gray-400 hover:border-gray-500 hover:text-gray-200'
                }`}
            >
              {label}
            </button>
          ))}
        </div>

        <button
          onClick={generateQuestion}
          disabled={loading && stage === 'setup'}
          className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed
                     text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
        >
          {loading && stage === 'setup' ? 'Generating…' : '🎲 Generate Question'}
        </button>
      </div>

      {/* Step 2 — Question + Answer */}
      {question && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">
            Step 2 — Your Answer
          </p>

          {/* Question output */}
          <div className="bg-gray-800 border border-indigo-900/50 rounded-xl p-5 mb-4">
            <pre className="whitespace-pre-wrap text-gray-200 text-sm leading-relaxed font-sans">
              {question}
              {loading && stage === 'setup' && (
                <span className="text-indigo-400 animate-pulse">▋</span>
              )}
            </pre>
          </div>

          {/* Answer textarea — only show when question is fully generated */}
          {stage !== 'setup' && (
            <>
              <div className="flex flex-col gap-2 mb-4">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Your Answer
                </label>
                <textarea
                  value={answer}
                  onChange={e => setAnswer(e.target.value)}
                  placeholder={`Write your answer here.\n\nTip: Use STAR format:\n  Situation — set the context\n  Task — what you needed to do\n  Action — what you specifically did\n  Result — quantified outcome`}
                  rows={8}
                  className="bg-gray-800 border border-gray-700 rounded-xl p-4 text-gray-200 text-sm
                             leading-relaxed resize-none outline-none focus:border-indigo-500 transition-colors"
                />
                <p className="text-xs text-gray-600 text-right">{answer.split(' ').filter(Boolean).length} words</p>
              </div>

              {error && <p className="text-red-400 text-sm mb-3">{error}</p>}

              <button
                onClick={evaluateAnswer}
                disabled={loading || !answer.trim()}
                className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed
                           text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
              >
                {loading && stage === 'practice' ? 'Evaluating…' : '📊 Get Feedback'}
              </button>
            </>
          )}
        </div>
      )}

      {/* Step 3 — Feedback */}
      {feedback && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
              Step 3 — Feedback
            </p>
            {score !== null && <ScoreBadge score={score} />}
          </div>

          <StreamBox text={feedback} loading={loading && stage === 'practice'} />

          {/* Next question button */}
          {stage === 'feedback' && !loading && (
            <button
              onClick={nextQuestion}
              className="mt-5 border border-indigo-700 hover:bg-indigo-600/20 text-indigo-300
                         font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
            >
              🔄 Next Question
            </button>
          )}
        </div>
      )}
    </PageShell>
  )
}