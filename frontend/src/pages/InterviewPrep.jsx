import { useState } from 'react'
import { Mic, Shuffle, BarChart2, RefreshCw } from 'lucide-react'
import PageShell from '../components/PageShell'
import StreamBox from '../components/StreamBox'
import { Input, Textarea, PrimaryBtn, GhostBtn, ScoreRing, ErrorMsg } from '../components/UI'

const API = import.meta.env.VITE_API_URL

const TYPES = [
  { id: 'behavioral',  label: '🤝 Behavioral'  },
  { id: 'technical',   label: '⚙️ Technical'    },
  { id: 'finance',     label: '📊 Finance'      },
  { id: 'case study',  label: '🧩 Case study'   },
  { id: 'hr',          label: '💬 HR / Fit'     },
]

function extractQuestion(text) {
  const m = text.match(/QUESTION:\n([\s\S]*?)\n\nWHAT/)
  return m ? m[1].trim() : text
}

export default function InterviewPrep() {
  const [role, setRole]           = useState('')
  const [company, setCompany]     = useState('')
  const [type, setType]           = useState('behavioral')
  const [question, setQuestion]   = useState('')
  const [answer, setAnswer]       = useState('')
  const [feedback, setFeedback]   = useState('')
  const [loading, setLoading]     = useState(false)
  const [stage, setStage]         = useState('setup')
  const [score, setScore]         = useState(null)
  const [error, setError]         = useState('')
  const [count, setCount]         = useState(0)

  async function generateQuestion() {
    if (!role.trim()) { setError('Target role is required.'); return }
    setError(''); setQuestion(''); setAnswer(''); setFeedback(''); setScore(null); setLoading(true); setStage('setup')
    try {
      const res = await fetch(`${API}/api/interview/question`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, company, type })
      })
      if (!res.ok) throw new Error()
      const data = await res.json()
      setQuestion(data.result)
      setStage('practice')
    } catch { setError('Request failed.') }
    finally { setLoading(false) }
  }

  async function evaluateAnswer() {
    if (!answer.trim()) { setError('Write your answer first.'); return }
    setError(''); setFeedback(''); setScore(null); setLoading(true)
    try {
      const res = await fetch(`${API}/api/interview/evaluate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: extractQuestion(question), answer, role })
      })
      if (!res.ok) throw new Error()
      const data = await res.json()
      setFeedback(data.result)
      const m = data.result.match(/SCORE:\s*(\d+)/)
      if (m) setScore(parseInt(m[1]))
      setStage('feedback')
      setCount(c => c + 1)
    } catch { setError('Request failed.') }
    finally { setLoading(false) }
  }

  return (
    <PageShell
      icon={Mic}
      title="Interview prep"
      badge="Generate · Practice · Score"
      description="Generate role-specific questions, write your answer, get scored feedback with a model strong answer."
    >
      {/* Session count */}
      {count > 0 && (
        <div className="inline-flex items-center gap-2 mb-5 px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[11px] font-medium text-indigo-400">
          🔥 {count} question{count > 1 ? 's' : ''} practiced this session
        </div>
      )}

      {/* Step 1 */}
      <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-2xl p-6 mb-4">
        <p className="text-[10px] font-semibold text-zinc-600 uppercase tracking-widest mb-4">Step 1 — Configure</p>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <Input label="Target role" value={role} onChange={setRole}
            placeholder="e.g. AI Engineer at AuxoAI" />
          <Input label="Company (optional)" value={company} onChange={setCompany}
            placeholder="e.g. AuxoAI" />
        </div>
        <div className="flex gap-2 flex-wrap mb-5">
          {TYPES.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setType(id)}
              className={`
                px-3.5 py-2 rounded-xl border text-[12px] font-medium transition-all
                ${type === id
                  ? 'border-indigo-500/40 bg-indigo-500/10 text-indigo-300'
                  : 'border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300'
                }
              `}
            >
              {label}
            </button>
          ))}
        </div>
        <ErrorMsg message={error} />
        <div className="mt-2">
          <PrimaryBtn onClick={generateQuestion} disabled={loading && stage === 'setup'} icon={Shuffle}>
            {loading && stage === 'setup' ? 'Generating…' : 'Generate question'}
          </PrimaryBtn>
        </div>
      </div>

      {/* Step 2 */}
      {question && (
        <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-2xl p-6 mb-4">
          <p className="text-[10px] font-semibold text-zinc-600 uppercase tracking-widest mb-4">Step 2 — Your answer</p>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 mb-4">
            <pre className="whitespace-pre-wrap text-[13px] text-zinc-300 leading-relaxed font-sans">{question}</pre>
          </div>
          {stage !== 'setup' && (
            <>
              <Textarea
                label="Your answer"
                value={answer}
                onChange={setAnswer}
                placeholder={"Use STAR format:\nSituation — set the context\nTask — what you needed to do\nAction — what you specifically did\nResult — quantified outcome"}
                rows={7}
              />
              <p className="text-[10px] text-zinc-600 text-right mt-1.5">
                {answer.split(' ').filter(Boolean).length} words
              </p>
              <div className="mt-3">
                <PrimaryBtn onClick={evaluateAnswer} disabled={loading || !answer.trim()} icon={BarChart2}>
                  {loading && stage === 'practice' ? 'Evaluating…' : 'Get feedback'}
                </PrimaryBtn>
              </div>
            </>
          )}
        </div>
      )}

      {/* Step 3 */}
      {feedback && (
        <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <p className="text-[10px] font-semibold text-zinc-600 uppercase tracking-widest">Step 3 — Feedback</p>
            {score !== null && <ScoreRing score={score} label="Answer score" />}
          </div>
          <StreamBox text={feedback} loading={false} />
          {stage === 'feedback' && (
            <div className="mt-4">
              <GhostBtn icon={RefreshCw} onClick={() => { setQuestion(''); setAnswer(''); setFeedback(''); setScore(null); setStage('setup') }}>
                Next question
              </GhostBtn>
            </div>
          )}
        </div>
      )}
    </PageShell>
  )
}