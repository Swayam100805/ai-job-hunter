export default function PageShell({ icon, title, description, children }) {
  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h2 className="text-2xl font-bold flex items-center gap-3">
          <span>{icon}</span> {title}
        </h2>
        <p className="text-gray-400 mt-1 text-sm">{description}</p>
      </div>
      {children}
    </div>
  )
}