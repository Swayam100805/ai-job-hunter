import { Routes, Route, NavLink } from 'react-router-dom'
import ResumeOptimizer from './pages/ResumeOptimizer'
import LinkedInReview from './pages/LinkedInReview'
import PortfolioReview from './pages/PortfolioReview'
import JobMatcher from './pages/JobMatcher'
import CoverLetter from './pages/CoverLetter'
import InterviewPrep from './pages/InterviewPrep'

const NAV = [
  { path: '/',           label: '📄 Resume Optimizer' },
  { path: '/linkedin',   label: '💼 LinkedIn Review' },
  { path: '/portfolio',  label: '🗂️ Portfolio Review' },
  { path: '/jobs',       label: '🧲 Job Matcher' },
  { path: '/cover',      label: '✍️ Cover Letter' },
  { path: '/interview',  label: '🎤 Interview Prep' },
]

export default function App() {
  return (
    <div className="flex min-h-screen bg-gray-950 text-gray-100 font-sans">

      {/* Sidebar */}
      <aside className="w-56 bg-gray-900 border-r border-gray-800 flex flex-col p-4 gap-1 shrink-0">
        <div className="mb-6">
          <h1 className="text-indigo-400 font-bold text-lg">🚀 AI Job Hunter</h1>
          <p className="text-gray-500 text-xs mt-1">Powered by Claude</p>
        </div>
        {NAV.map(({ path, label }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/'}
            className={({ isActive }) =>
              `px-3 py-2 rounded-lg text-sm font-medium transition-all ` +
              (isActive
                ? 'bg-indigo-600/20 text-indigo-300 border-l-2 border-indigo-500'
                : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800')
            }
          >
            {label}
          </NavLink>
        ))}
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <Routes>
          <Route path="/"          element={<ResumeOptimizer />} />
          <Route path="/linkedin"  element={<LinkedInReview />} />
          <Route path="/portfolio" element={<PortfolioReview />} />
          <Route path="/jobs"      element={<JobMatcher />} />
          <Route path="/cover"     element={<CoverLetter />} />
          <Route path="/interview" element={<InterviewPrep />} />
        </Routes>
      </main>

    </div>
  )
}