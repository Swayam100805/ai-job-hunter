import { useState } from 'react'
import { Copy, Check, Terminal } from 'lucide-react'

export default function StreamBox({ text, loading }) {
  const [copied, setCopied] = useState(false)

  if (!text && !loading) return null

  function handleCopy() {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="mt-5 rounded-xl border border-zinc-800/80 overflow-hidden bg-zinc-900/50 animate-fade-in">
      {/* Header bar */}
      <div className="flex items-center gap-2.5 px-4 py-2.5 border-b border-zinc-800/80 bg-zinc-900/80">
        <div className={`w-2 h-2 rounded-full transition-colors duration-500 ${
          loading ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'
        }`} />
        <Terminal size={12} className="text-zinc-600" />
        <span className="text-[11px] font-medium text-zinc-500 tracking-wide uppercase">
          {loading ? 'Processing' : 'Analysis output'}
        </span>
        {!loading && text && (
          <button
            onClick={handleCopy}
            className="ml-auto flex items-center gap-1.5 text-[11px] text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        )}
      </div>

      {/* Body */}
      <div className="p-5">
        {loading && !text && (
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {[0, 1, 2].map(i => (
                <span
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-indigo-400"
                  style={{ animation: `pulse 1.4s ease-in-out ${i * 0.16}s infinite` }}
                />
              ))}
            </div>
            <span className="text-xs text-zinc-500">Generating analysis…</span>
          </div>
        )}
        <pre className="whitespace-pre-wrap text-[13px] text-zinc-300 leading-relaxed font-sans">
          {text}
        </pre>
      </div>
    </div>
  )
}