import { Routes, Route, NavLink, useLocation } from 'react-router-dom'
import { useState } from 'react'
import {
  FileText, Linkedin, FolderOpen, Target,
  PenLine, Mic, ChevronLeft, ChevronRight,
  Zap, Circle
} from 'lucide-react'
import ResumeOptimizer from './pages/ResumeOptimizer'
import LinkedInReview from './pages/LinkedInReview'
import PortfolioReview from './pages/PortfolioReview'
import JobMatcher from './pages/JobMatcher'
import CoverLetter from './pages/CoverLetter'
import InterviewPrep from './pages/InterviewPrep'

const NAV = [
  { path: '/',          label: 'Resume',       sub: 'ATS optimizer',    icon: FileText  },
  { path: '/linkedin',  label: 'LinkedIn',     sub: 'Profile audit',    icon: Linkedin  },
  { path: '/portfolio', label: 'Portfolio',    sub: 'Project coach',    icon: FolderOpen},
  { path: '/jobs',      label: 'Job Match',    sub: 'Fit analysis',     icon: Target    },
  { path: '/cover',     label: 'Cover Letter', sub: 'Auto-generate',    icon: PenLine   },
  { path: '/interview', label: 'Interview',    sub: 'Prep and score',   icon: Mic       },
]

export default function App() {
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()
  const current = NAV.find(n => n.path === location.pathname) || NAV[0]

  return (
    <div className="flex min-h-screen radial-bg">

      {/* ── Sidebar ── */}
      <aside className={`
        relative flex flex-col shrink-0 transition-all duration-300 ease-in-out
        bg-zinc-900/50 backdrop-blur-md border-r border-zinc-800/80
        ${collapsed ? 'w-16' : 'w-56'}
      `} style={{ height: '100vh', position: 'sticky', top: 0 }}>

        {/* Logo */}
        <div className={`
          flex items-center border-b border-zinc-800/80 h-14 shrink-0
          ${collapsed ? 'justify-center px-0' : 'px-4 gap-3'}
        `}>
          {!collapsed && (
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shrink-0">
                <Zap size={14} className="text-indigo-400" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-zinc-100 leading-none tracking-tight">Job Ready</p>
                <p className="text-[10px] text-zinc-500 mt-0.5">AI Career Suite</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-6 h-6 rounded-md flex items-center justify-center text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-all shrink-0"
          >
            {collapsed
              ? <ChevronRight size={13} />
              : <ChevronLeft size={13} />
            }
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 p-2 flex flex-col gap-0.5 overflow-hidden">
          {NAV.map(({ path, label, sub, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              end={path === '/'}
              title={collapsed ? label : undefined}
              className={({ isActive }) => `
                flex items-center rounded-lg transition-all duration-150 group
                ${collapsed ? 'justify-center p-2.5' : 'gap-3 px-3 py-2.5'}
                ${isActive
                  ? 'bg-zinc-800 border border-zinc-700/60 text-zinc-100'
                  : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50 border border-transparent'
                }
              `}
            >
              {({ isActive }) => (
                <>
                  <Icon
                    size={16}
                    className={`shrink-0 transition-colors ${isActive ? 'text-indigo-400' : 'text-zinc-500 group-hover:text-zinc-400'}`}
                  />
                  {!collapsed && (
                    <div className="min-w-0 flex-1">
                      <p className={`text-[13px] font-medium leading-none ${isActive ? 'text-zinc-100' : 'text-zinc-400'}`}>
                        {label}
                      </p>
                      <p className="text-[10px] text-zinc-600 mt-0.5">{sub}</p>
                    </div>
                  )}
                  {!collapsed && isActive && (
                    <div className="w-1 h-1 rounded-full bg-indigo-400 shrink-0" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer pill */}
        {!collapsed && (
          <div className="p-3 border-t border-zinc-800/80 shrink-0">
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-2.5">
              <div className="flex items-center gap-1.5 mb-1">
                <Circle size={6} className="text-emerald-400 fill-emerald-400" />
                <span className="text-[11px] font-medium text-emerald-400">AI Online</span>
              </div>
              <p className="text-[10px] text-zinc-600 leading-relaxed">
                llama-3.3-70b via Groq<br/>
                Fast inference · Free tier
              </p>
            </div>
          </div>
        )}
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Topbar */}
        <header className="h-14 glass border-b border-zinc-800/80 flex items-center px-6 gap-4 sticky top-0 z-40">
          <div className="flex items-center gap-2">
            <current.icon size={15} className="text-indigo-400" />
            <span className="text-sm font-medium text-zinc-200">{current.label}</span>
            <span className="text-zinc-700">/</span>
            <span className="text-xs text-zinc-500">{current.sub}</span>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-500">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-slow" />
              Upload docs in any section
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-8 overflow-y-auto animate-fade-in">
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
    </div>
  )
}