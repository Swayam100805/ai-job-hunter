export default function StreamBox({ text, loading }) {
  if (!text && !loading) return null
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-xl p-5 mt-4 min-h-20">
      {loading && !text && (
        <p className="text-gray-500 text-sm animate-pulse">Analyzing…</p>
      )}
      <pre className="whitespace-pre-wrap text-gray-200 text-sm leading-relaxed font-sans">
        {text}
        {loading && <span className="text-indigo-400 animate-pulse">▋</span>}
      </pre>
    </div>
  )
}