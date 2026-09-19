import { NavLink, Outlet } from 'react-router';
import { useState } from 'react';
import { Activity, BookOpenText, Clock3, FileSearch, FileText, GitFork, LayoutDashboard, ListChecks, Menu, ShieldAlert, Sparkles, Upload, X } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Badge, cx } from '@/components/ui';
import { CopilotPanel } from '@/components/analysis/CopilotPanel';

const NAV = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/analyze', label: 'Analyze Specification', icon: FileSearch },
  { to: '/upload', label: 'Upload Tender', icon: Upload },
  { to: '/results', label: 'Recommendations', icon: ListChecks },
  { to: '/explorer', label: 'Standards Explorer', icon: BookOpenText },
  { to: '/graph', label: 'Relationship Graph', icon: GitFork },
  { to: '/gaps', label: 'Gap Analysis', icon: ShieldAlert },
  { to: '/spec', label: 'Tender Specification', icon: FileText },
  { to: '/history', label: 'Search History', icon: Clock3 },
];

export function AppShell() {
  const { status, statusError, analysis } = useApp();
  const [open, setOpen] = useState(false);
  const [copilot, setCopilot] = useState(false);

  const sidebar = (
    <nav className="flex h-full flex-col">
      <div className="flex items-center gap-3 px-5 py-5">
        <div className="grid size-9 place-items-center rounded-xl bg-white/10 ring-1 ring-white/15">
          <span className="font-mono text-[13px] font-semibold text-white">IS</span>
        </div>
        <div>
          <div className="text-[15px] font-semibold text-white leading-tight">IS Copilot</div>
          <div className="text-[11px] text-navy-200 leading-tight">Standards Intelligence</div>
        </div>
      </div>
      <ul className="flex-1 space-y-0.5 px-3 py-2">
        {NAV.map((n) => (
          <li key={n.to}>
            <NavLink
              to={n.to}
              end={n.end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                cx(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors',
                  isActive ? 'bg-white/12 text-white shadow-inner' : 'text-navy-100 hover:bg-white/8 hover:text-white',
                )
              }
            >
              <n.icon className="size-4 shrink-0 opacity-90" />
              <span className="truncate">{n.label}</span>
              {n.to === '/results' && analysis && <span className="ml-auto size-1.5 rounded-full bg-saffron-400" aria-hidden />}
            </NavLink>
          </li>
        ))}
      </ul>
      <div className="border-t border-white/10 px-5 py-4 text-[11px] text-navy-200">
        <div className="font-semibold text-navy-100">SIH 2026 · PS 26108</div>
        <div className="mt-0.5">AI assistance — not a legal authority. Verify with BIS.</div>
      </div>
    </nav>
  );

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[256px_1fr]">
      <aside className="hidden lg:block bg-navy-900 sticky top-0 h-screen">{sidebar}</aside>

      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button aria-label="Close menu" className="absolute inset-0 bg-navy-900/50" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 bg-navy-900 shadow-pop animate-fade-in">{sidebar}</aside>
        </div>
      )}

      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-line bg-white/85 px-4 backdrop-blur md:px-6">
          <button className="grid size-9 place-items-center rounded-lg text-ink-muted hover:bg-navy-50 lg:hidden" onClick={() => setOpen((o) => !o)} aria-label="Toggle navigation">
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
          <div className="hidden md:block text-[13px] text-ink-muted">AI-Powered Indian Standards Intelligence for Procurement</div>
          <div className="ml-auto flex items-center gap-2">
            <StatusPill status={status} error={statusError} />
            <button
              onClick={() => setCopilot(true)}
              className="inline-flex h-9 items-center gap-2 rounded-lg bg-navy-800 px-3 text-[13px] font-medium text-white hover:bg-navy-700"
            >
              <Sparkles className="size-4" /> <span className="hidden sm:inline">Ask Copilot</span>
            </button>
          </div>
        </header>
        <main className="flex-1 px-4 py-6 md:px-8 md:py-8 max-w-[1440px] w-full mx-auto">
          <Outlet />
        </main>
      </div>

      <CopilotPanel open={copilot} onClose={() => setCopilot(false)} />
    </div>
  );
}

function StatusPill({ status, error }: { status: ReturnType<typeof useApp>['status']; error: string | null }) {
  if (error) return <Badge tone="rose">API offline</Badge>;
  if (!status) return <Badge tone="slate">Connecting…</Badge>;
  return (
    <div className="flex items-center gap-2">
      <Badge tone={status.mode === 'live' ? 'emerald' : 'amber'} title={`LLM: ${status.llm} · Embeddings: ${status.embeddings} · Repository: ${status.repository}`}>
        <Activity className="size-3" /> {status.mode === 'live' ? 'Live AI' : 'Demo mode'}
      </Badge>
      <Badge tone="navy" className="hidden sm:inline-flex" title={status.dataset.disclaimer}>
        {status.dataset.standardCount} standards indexed
      </Badge>
    </div>
  );
}
