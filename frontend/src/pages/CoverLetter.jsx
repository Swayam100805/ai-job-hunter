import { useState } from 'react'
import { PenLine, Sparkles, Copy, Check, X } from 'lucide-react'
import PageShell from '../components/PageShell'
import StreamBox from '../components/StreamBox'
import { Textarea, Input, PrimaryBtn, GhostBtn, ToneSelector, ErrorMsg } from '../components/UI'

const API = import.meta.env.VITE_API_URL

const TONES = [
  { id: 'professional',  label: 'Professional',  desc: 'Formal & precise'   },
  { id: 'confident',     label: 'Confident',      desc: 'Lead with wins'     },
  { id: 'story-driven',  label: 'Story-driven',   desc: 'Personal & warm'    },
  { id: 'concise',       label: 'Concise',        desc: 'Under 200 words'    },
]

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
    if (!resume.trim() || !jd.trim()) { setError('Resume and JD are required.'); return }
    setError(''); setResult(''); setLoading(true); setCopied(false)
    try {
      const res = await fetch(`${API}/api/coverletter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume, jobDescription: jd, tone, recipientName, companyName })
      })
      if (!res.ok) throw new Error()
      const data = await res.json()
      setResult(data.result)
    } catch { setError('Request failed. Check your connection.') }
    finally { setLoading(false) }
  }

  function copyLetter() {
    navigator.clipboard.writeText(result.split('---')[0].trim())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <PageShell
      icon={PenLine}
      title="Cover letter generator"
      badge="3 paragraphs · Tailored"
      description="Generate a tight, role-specific cover letter grounded strictly in your resume. No fabrication."
    >
      {/* Tone */}
      <div className="mb-5">
        <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest mb-2">Tone</p>
        <ToneSelector tones={TONES} active={tone} onSelect={setTone} />
      </div>

      {/* Optional fields */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <Input label="Recipient name (optional)" value={recipientName} onChange={setRecipientName}
          placeholder="e.g. Ms. Priya Sharma" />
        <Input label="Company name (optional)" value={companyName} onChange={setCompanyName}
          placeholder="e.g. AuxoAI" />
      </div>

      {/* Editors */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <Textarea label="Your resume" value={resume} onChange={setResume}
          placeholder="Paste your resume…" rows={10} onFileUpload={setResume} />
        <Textarea label="Job description" value={jd} onChange={setJd}
          placeholder="Paste the JD…" rows={10} onFileUpload={setJd} />
      </div>

      <ErrorMsg message={error} />

      <div className="flex items-center gap-3 mt-4 flex-wrap">
        <PrimaryBtn onClick={handleSubmit} disabled={loading} icon={Sparkles}>
          {loading ? 'Writing…' : 'Generate letter'}
        </PrimaryBtn>
        {result && (
          <>
            <GhostBtn onClick={copyLetter} icon={copied ? Check : Copy}>
              {copied ? 'Copied!' : 'Copy letter'}
            </GhostBtn>
            <GhostBtn icon={X} onClick={() => { setResume(''); setJd(''); setResult('') }}>Clear</GhostBtn>
          </>
        )}
      </div>

      <StreamBox text={result} loading={loading} />
    </PageShell>
  )
}