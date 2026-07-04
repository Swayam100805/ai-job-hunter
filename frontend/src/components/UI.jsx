import { useRef, useState } from 'react'
import { UploadCloud, Paperclip, X } from 'lucide-react'

// ── File Upload ──────────────────────────────────────────────────────────────
export function FileUpload({ onTextExtracted }) {
  const [fileName, setFileName] = useState('')
  const [loading, setLoading]   = useState(false)
  const ref = useRef()

  async function handle(e) {
    const file = e.target.files[0]
    if (!file) return
    setFileName(file.name)
    setLoading(true)
    try {
      const text = await file.text()
      onTextExtracted(text)
    } catch {
      // silently fail — user can paste manually
    }
    setLoading(false)
  }

  return (
    <>
      <input ref={ref} type="file" accept=".txt,.pdf,.doc,.docx" onChange={handle} className="hidden" />
      <button
        onClick={() => ref.current.click()}
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium
                   text-zinc-500 hover:text-zinc-300 bg-zinc-900 hover:bg-zinc-800
                   border border-zinc-800 hover:border-zinc-700 transition-all duration-150"
      >
        {loading
          ? <span className="w-3 h-3 rounded-full border border-zinc-500 border-t-transparent animate-spin" />
          : <UploadCloud size={12} />
        }
        {fileName ? (
          <span className="max-w-[120px] truncate">{fileName}</span>
        ) : 'Upload file'}
        {fileName && (
          <X size={10} className="text-zinc-600 hover:text-zinc-400"
            onClick={e => { e.stopPropagation(); setFileName(''); }} />
        )}
      </button>
    </>
  )
}

// ── Label ────────────────────────────────────────────────────────────────────
export function FieldLabel({ children, action }) {
  return (
    <div className="flex items-center justify-between mb-2">
      <label className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest">
        {children}
      </label>
      {action}
    </div>
  )
}

// ── Textarea ─────────────────────────────────────────────────────────────────
export function Textarea({ label, value, onChange, placeholder, rows = 9, onFileUpload }) {
  return (
    <div>
      <FieldLabel action={onFileUpload && <FileUpload onTextExtracted={onFileUpload} />}>
        {label}
      </FieldLabel>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="
          w-full bg-zinc-900/80 border border-zinc-800/80 rounded-xl
          px-4 py-3.5 text-[13px] text-zinc-200 placeholder-zinc-600
          resize-none leading-relaxed
          focus:outline-none focus:border-zinc-700 focus:ring-1 focus:ring-zinc-700/50
          transition-all duration-150
        "
      />
    </div>
  )
}

// ── Input ────────────────────────────────────────────────────────────────────
export function Input({ label, value, onChange, placeholder }) {
  return (
    <div>
      {label && <FieldLabel>{label}</FieldLabel>}
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="
          w-full bg-zinc-900/80 border border-zinc-800/80 rounded-xl
          px-4 py-3 text-[13px] text-zinc-200 placeholder-zinc-600
          focus:outline-none focus:border-zinc-700 focus:ring-1 focus:ring-zinc-700/50
          transition-all duration-150
        "
      />
    </div>
  )
}

// ── Primary Button ───────────────────────────────────────────────────────────
export function PrimaryBtn({ children, onClick, disabled, icon: Icon }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="
        flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-semibold
        bg-zinc-100 text-zinc-900 hover:bg-white
        disabled:bg-zinc-800 disabled:text-zinc-600 disabled:cursor-not-allowed
        transition-all duration-150 hover:-translate-y-px
        shadow-[0_1px_0_0_rgba(255,255,255,0.1)_inset]
        active:translate-y-0
      "
    >
      {Icon && <Icon size={14} className={disabled ? 'text-zinc-600' : 'text-zinc-700'} />}
      {children}
    </button>
  )
}

// ── Ghost Button ─────────────────────────────────────────────────────────────
export function GhostBtn({ children, onClick, icon: Icon }) {
  return (
    <button
      onClick={onClick}
      className="
        flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-medium
        text-zinc-500 hover:text-zinc-300 bg-transparent
        border border-zinc-800 hover:border-zinc-700
        transition-all duration-150
      "
    >
      {Icon && <Icon size={13} />}
      {children}
    </button>
  )
}

// ── Score Ring ───────────────────────────────────────────────────────────────
export function ScoreRing({ score, label }) {
  const r = 28
  const circ = 2 * Math.PI * r
  const pct = Math.min(Math.max(score, 0), 100)
  const dash = (pct / 100) * circ
  const color = pct >= 80 ? '#34d399' : pct >= 60 ? '#fbbf24' : '#f87171'
  const textColor = pct >= 80 ? 'text-emerald-400' : pct >= 60 ? 'text-amber-400' : 'text-red-400'
  const statusText = pct >= 80 ? 'Strong match' : pct >= 60 ? 'Moderate fit' : 'Weak match'

  return (
    <div className="flex items-center gap-4 px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl ml-auto">
      {/* SVG ring */}
      <div className="relative w-16 h-16 shrink-0">
        <svg className="w-16 h-16 -rotate-90" viewBox="0 0 72 72">
          <circle cx="36" cy="36" r={r} fill="none" stroke="#27272a" strokeWidth="3.5" />
          <circle
            cx="36" cy="36" r={r} fill="none"
            stroke={color} strokeWidth="3.5"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${circ}`}
            style={{ filter: `drop-shadow(0 0 4px ${color}66)`, transition: 'stroke-dasharray 0.6s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-base font-bold ${textColor}`}>{score}</span>
        </div>
      </div>

      {/* Label block */}
      <div>
        <p className="text-[10px] text-zinc-600 uppercase tracking-widest font-semibold mb-0.5">
          {label || 'ATS Match'}
        </p>
        <p className={`text-sm font-semibold ${textColor}`}>{statusText}</p>
        <div className="flex items-center gap-1 mt-1">
          <div className="h-1 w-16 rounded-full bg-zinc-800 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${pct}%`, background: color }}
            />
          </div>
          <span className="text-[10px] text-zinc-600">{pct}%</span>
        </div>
      </div>
    </div>
  )
}

// ── Error message ─────────────────────────────────────────────────────────────
export function ErrorMsg({ message }) {
  if (!message) return null
  return (
    <p className="text-[12px] text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-2 rounded-lg">
      {message}
    </p>
  )
}

// ── Tone Selector ─────────────────────────────────────────────────────────────
export function ToneSelector({ tones, active, onSelect }) {
  return (
    <div className="flex gap-2 flex-wrap">
      {tones.map(({ id, label, desc }) => (
        <button
          key={id}
          onClick={() => onSelect(id)}
          className={`
            flex flex-col gap-0.5 px-3.5 py-2.5 rounded-xl border text-left text-[12px]
            transition-all duration-150
            ${active === id
              ? 'border-indigo-500/40 bg-indigo-500/10 text-indigo-300'
              : 'border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300'
            }
          `}
        >
          <span className="font-medium">{label}</span>
          <span className="text-[10px] opacity-60">{desc}</span>
        </button>
      ))}
    </div>
  )
}

// ── Section card ──────────────────────────────────────────────────────────────
export function SectionCard({ children, className = '' }) {
  return (
    <div className={`bg-zinc-900/50 border border-zinc-800/80 rounded-2xl p-6 ${className}`}>
      {children}
    </div>
  )
}