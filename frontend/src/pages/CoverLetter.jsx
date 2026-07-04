import { useState } from 'react'
import PageShell from '../components/PageShell'
import StreamBox from '../components/StreamBox'

const API = import.meta.env.VITE_API_URL

const TONES = [
  {
    id: 'professional',
    label: 'Professional',
    desc: 'Formal and precise',
  },
  {
    id: 'confident',
    label: 'Confident',
    desc: 'Bold, lead with wins',
  },
  {
    id: 'story-driven',
    label: 'Story-driven',
    desc: 'Personal and compelling',
  },
  {
    id: 'concise',
    label: 'Concise',
    desc: 'Under 200 words',
  },
]

// Strips the meta section after --- so only the letter is copied
function extractLetter(text) {
  return text.split('---')[0].trim()
}

export default function CoverLetter() {
  const [resume, setResume]               = useState('')
  const [jd, setJd]                       = useState('')
  const [tone, setTone]                   = useState('professional')
  const [recipientName, setRecipientName] = useState('')
  const [companyName, setCompanyName]     = useState('')
  const [result, setResult]               = useState('')
  const [loading, setLoading]             = useState(false)
  const [error, setError]                 = useState('')
  const [copied, setCopied]               = useState(false)

  async function handleSubmit() {
    if (!resume.trim() || !jd.trim()) {
      setError('Resume and job description are required.')
      return
    }
    setError('')
    setResult('')
    setLoading(true)
    setCopied(false)

    try {
      const response = await fetch(`${API}/api/coverletter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume, jobDescription: jd, tone, recipientName, companyName })
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
      }
    } catch (err) {
      setError('Something went wrong. Is your backend running?')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  function handleCopy() {
    // Only copy the letter itself, not the meta feedback below ---
    navigator.clipboard.writeText(extractLetter(result))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handleClear() {
    setResume('')
    setJd('')
    setRecipientName('')
    setCompanyName('')
    setResult('')
    setError('')
    setCopied(false)
  }

  return (
    <PageShell
      icon="✍️"
      title="Cover Letter Generator"
      description="Generate a tailored, 3-paragraph cover letter grounded strictly in your resume."
    >
      {/* Tone selector */}
      <div className="mb-5">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Tone</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {TONES.map(({ id, label, desc }) => (
            <button
              key={id}
              onClick={() => setTone(id)}
              className={`flex flex-col gap-1 px-4 py-3 rounded-xl border text-left transition-all text-sm
                ${tone === id
                  ? 'border-indigo-500 bg-indigo-600/15 text-indigo-300'
                  : 'border-gray-700 text-gray-400 hover:border-gray-500 hover:text-gray-200'
                }`}
            >
              <span className="font-semibold">{label}</span>
              <span className="text-xs opacity-70">{desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Optional fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
            Recipient Name <span className="text-gray-600 normal-case font-normal">(optional)</span>
          </label>
          <input
            value={recipientName}
            onChange={e => setRecipientName(e.target.value)}
            placeholder="e.g. Ms. Priya Sharma"
            className="bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-gray-200 text-sm
                       outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
            Company Name <span className="text-gray-600 normal-case font-normal">(optional)</span>
          </label>
          <input
            value={companyName}
            onChange={e => setCompanyName(e.target.value)}
            placeholder="e.g. J.P. Morgan"
            className="bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-gray-200 text-sm
                       outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
      </div>

      {/* Resume + JD */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
            Your Resume
          </label>
          <textarea
            value={resume}
            onChange={e => setResume(e.target.value)}
            placeholder="Paste your full resume text…"
            rows={11}
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
            placeholder="Paste the job description…"
            rows={11}
            className="bg-gray-900 border border-gray-700 rounded-xl p-4 text-gray-200 text-sm
                       leading-relaxed resize-none outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
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
          {loading ? 'Writing…' : '✍️ Generate Cover Letter'}
        </button>

        {result && (
          <>
            <button
              onClick={handleCopy}
              className="border border-gray-700 hover:border-gray-500 text-gray-400 hover:text-gray-200
                         px-4 py-3 rounded-xl transition-colors text-sm"
            >
              {copied ? '✅ Copied!' : '📋 Copy Letter Only'}
            </button>
            <button
              onClick={() => navigator.clipboard.writeText(result)}
              className="border border-gray-700 hover:border-gray-500 text-gray-400 hover:text-gray-200
                         px-4 py-3 rounded-xl transition-colors text-sm"
            >
              📄 Copy Full Output
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

      <StreamBox text={result} loading={loading} />
    </PageShell>
  )
}