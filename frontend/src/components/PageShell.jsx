export default function PageShell({ icon: Icon, title, badge, description, children }) {
  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0">
            {Icon && <Icon size={17} className="text-indigo-400" />}
          </div>
          <h1 className="text-xl font-semibold text-gradient tracking-tight">{title}</h1>
          {badge && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              {badge}
            </span>
          )}
        </div>
        <p className="text-sm text-zinc-500 ml-12 leading-relaxed">{description}</p>
        <div className="mt-5 h-px bg-gradient-to-r from-indigo-500/30 via-zinc-800 to-transparent" />
      </div>

      {children}
    </div>
  )
}