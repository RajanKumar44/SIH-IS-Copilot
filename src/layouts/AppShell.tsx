import { NavLink, Outlet, useLocation } from 'react-router';
import { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  BookOpenText,
  ChevronLeft,
  Clock3,
  FileSearch,
  FileText,
  GitFork,
  Info,
  LayoutDashboard,
  ListChecks,
  Menu,
  Monitor,
  Moon,
  PanelLeft,
  Search,
  ShieldAlert,
  Sparkles,
  Sun,
  Upload,
  X,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useTheme, type ThemePreference } from '@/context/ThemeContext';
import { Badge, Button, cx } from '@/components/ui';
import { CopilotPanel } from '@/components/analysis/CopilotPanel';
import { CommandMenu } from '@/components/CommandMenu';

interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  end?: boolean;
}

const WORKFLOW: NavItem[] = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/analyze', label: 'Analyze Specification', icon: FileSearch },
  { to: '/upload', label: 'Upload Tender', icon: Upload },
  { to: '/results', label: 'Recommendations', icon: ListChecks },
  { to: '/gaps', label: 'Gap Analysis', icon: ShieldAlert },
  { to: '/spec', label: 'Tender Specification', icon: FileText },
];

const KNOWLEDGE: NavItem[] = [
  { to: '/explorer', label: 'Standards Explorer', icon: BookOpenText },
  { to: '/graph', label: 'Relationship Graph', icon: GitFork },
  { to: '/history', label: 'Search History', icon: Clock3 },
];

const SECONDARY: NavItem[] = [{ to: '/about', label: 'About', icon: Info }];

/** Page titles for the header breadcrumb, keyed by route prefix. */
const TITLES: Array<[string, string]> = [
  ['/analyze', 'Analyze Specification'],
  ['/upload', 'Upload Tender'],
  ['/results', 'Recommendations'],
  ['/explorer', 'Standards Explorer'],
  ['/graph', 'Relationship Graph'],
  ['/gaps', 'Gap Analysis'],
  ['/spec', 'Tender Specification'],
  ['/history', 'Search History'],
  ['/about', 'About'],
];

const COLLAPSE_KEY = 'iscopilot.sidebar.collapsed';

export function AppShell() {
  const { status, statusError, analysis } = useApp();
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem(COLLAPSE_KEY) === '1';
    } catch {
      return false;
    }
  });
  const [copilot, setCopilot] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);

  const pageTitle = useMemo(() => TITLES.find(([prefix]) => pathname.startsWith(prefix))?.[1] ?? 'Dashboard', [pathname]);

  // Close the mobile drawer whenever the route changes.
  useEffect(() => setMobileOpen(false), [pathname]);

  // Ctrl/⌘ + K opens the command menu from anywhere.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandOpen((o) => !o);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const toggleCollapsed = () => {
    setCollapsed((c) => {
      const next = !c;
      try {
        localStorage.setItem(COLLAPSE_KEY, next ? '1' : '0');
      } catch {
        /* ignore */
      }
      return next;
    });
  };

  const sidebar = (mini: boolean) => (
    <nav className="flex h-full flex-col bg-sidebar text-sidebar-fg" aria-label="Main navigation">
      <div className={cx('flex items-center gap-2.5 border-b border-sidebar-border px-4 h-14', mini && 'justify-center px-0')}>
        <div className="grid size-8 shrink-0 place-items-center rounded-lg bg-white/10 ring-1 ring-white/15">
          <span className="font-mono text-[12px] font-bold text-white">IS</span>
        </div>
        {!mini && (
          <div className="min-w-0">
            <div className="truncate text-[14px] font-semibold leading-tight">IS Copilot</div>
            <div className="truncate text-[10.5px] leading-tight text-sidebar-muted">Indian Standards. Smarter Procurement.</div>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-2.5 py-3">
        <NavGroup label="Workflow" items={WORKFLOW} mini={mini} analysisReady={Boolean(analysis)} />
        <NavGroup label="Knowledge Base" items={KNOWLEDGE} mini={mini} className="mt-4" />
      </div>

      <div className="border-t border-sidebar-border px-2.5 py-3">
        <NavGroup items={SECONDARY} mini={mini} />
        {!mini && (
          <div className="mt-3 px-2.5 text-[10.5px] leading-relaxed text-sidebar-muted">
            <div className="font-semibold text-white/80">SIH 2026 · PS 26108</div>
            <div className="mt-0.5">AI assistance — not a legal authority. Verify with BIS.</div>
          </div>
        )}
      </div>
    </nav>
  );

  return (
    <div className={cx('min-h-screen lg:grid', collapsed ? 'lg:grid-cols-[68px_1fr]' : 'lg:grid-cols-[248px_1fr]')}>
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen lg:block">{sidebar(collapsed)}</aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button aria-label="Close navigation" className="absolute inset-0 bg-black/50 animate-fade-in" onClick={() => setMobileOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-[264px] shadow-pop animate-[fade-in_0.2s_ease-out]">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute right-2 top-3.5 z-10 grid size-8 place-items-center rounded-md text-sidebar-muted hover:bg-white/10 hover:text-white"
              aria-label="Close navigation"
            >
              <X className="size-4" />
            </button>
            {sidebar(false)}
          </aside>
        </div>
      )}

      <div className="flex min-h-screen min-w-0 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-line bg-surface-raised/85 px-3 backdrop-blur md:px-6 print:hidden">
          <button
            className="grid size-9 place-items-center rounded-lg text-ink-muted hover:bg-soft hover:text-ink lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation"
          >
            <Menu className="size-5" />
          </button>
          <button
            className="hidden size-9 place-items-center rounded-lg text-ink-muted hover:bg-soft hover:text-ink lg:grid"
            onClick={toggleCollapsed}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <PanelLeft className="size-4.5" /> : <ChevronLeft className="size-4.5" />}
          </button>

          {/* Breadcrumb. Deliberately not a heading (each page owns its <h1>) and
              not a <nav> landmark, so the sidebar stays the single navigation region. */}
          <div className="flex min-w-0 items-center gap-2">
            <span className="hidden text-[13px] text-ink-subtle sm:inline">IS Copilot</span>
            <span className="hidden text-ink-subtle sm:inline" aria-hidden>
              /
            </span>
            <span className="truncate text-[13.5px] font-semibold text-ink" aria-current="page">
              {pageTitle}
            </span>
          </div>

          <div className="ml-auto flex items-center gap-1.5">
            <button
              onClick={() => setCommandOpen(true)}
              className="hidden h-9 items-center gap-2 rounded-lg border border-line bg-surface-sunken px-2.5 text-[12.5px] text-ink-muted transition-colors hover:border-line-strong hover:text-ink md:flex"
              aria-label="Open command menu"
            >
              <Search className="size-3.5" />
              <span>Search…</span>
              <kbd className="rounded border border-line bg-surface-raised px-1 font-mono text-[10px]">⌘K</kbd>
            </button>
            <button
              onClick={() => setCommandOpen(true)}
              className="grid size-9 place-items-center rounded-lg text-ink-muted hover:bg-soft hover:text-ink md:hidden"
              aria-label="Open command menu"
            >
              <Search className="size-4.5" />
            </button>

            <StatusPill status={status} error={statusError} />
            <ThemeToggle />

            <Button size="sm" onClick={() => setCopilot(true)} className="ml-0.5">
              <Sparkles className="size-4" /> <span className="hidden sm:inline">Ask Copilot</span>
            </Button>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1400px] flex-1 px-4 py-6 md:px-8 md:py-8">
          <Outlet />
        </main>
      </div>

      <CopilotPanel open={copilot} onClose={() => setCopilot(false)} />
      <CommandMenu open={commandOpen} onClose={() => setCommandOpen(false)} />
    </div>
  );
}

function NavGroup({
  label,
  items,
  mini,
  className,
  analysisReady,
}: {
  label?: string;
  items: NavItem[];
  mini: boolean;
  className?: string;
  analysisReady?: boolean;
}) {
  return (
    <div className={className}>
      {label && !mini && <div className="px-2.5 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-sidebar-muted">{label}</div>}
      {label && mini && <div className="mx-auto mb-2 h-px w-6 bg-sidebar-border" />}
      <ul className="space-y-0.5">
        {items.map((n) => (
          <li key={n.to}>
            <NavLink
              to={n.to}
              end={n.end}
              title={mini ? n.label : undefined}
              className={({ isActive }) =>
                cx(
                  'group relative flex items-center gap-2.5 rounded-lg text-[13px] font-medium transition-colors',
                  mini ? 'justify-center px-0 py-2.5' : 'px-2.5 py-2',
                  isActive ? 'bg-white/[0.14] text-white' : 'text-sidebar-muted hover:bg-white/[0.07] hover:text-white',
                )
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && <span className="absolute inset-y-1.5 left-0 w-0.5 rounded-full bg-accent" aria-hidden />}
                  <n.icon className="size-4 shrink-0" />
                  {!mini && <span className="truncate">{n.label}</span>}
                  {!mini && n.to === '/results' && analysisReady && <span className="ml-auto size-1.5 rounded-full bg-accent" aria-hidden title="Analysis loaded" />}
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ThemeToggle() {
  const { preference, theme, setPreference } = useTheme();
  const [open, setOpen] = useState(false);

  // Close the menu on outside click or Escape.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest('[data-theme-menu]')) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const options: Array<{ value: ThemePreference; label: string; icon: LucideIcon }> = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor },
  ];

  return (
    <div className="relative" data-theme-menu>
      <button
        onClick={() => setOpen((o) => !o)}
        className="grid size-9 place-items-center rounded-lg text-ink-muted transition-colors hover:bg-soft hover:text-ink"
        aria-label="Change theme"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {theme === 'dark' ? <Moon className="size-4.5" /> : <Sun className="size-4.5" />}
      </button>
      {open && (
        <div className="absolute right-0 top-full z-40 mt-1.5 w-36 overflow-hidden rounded-lg border border-line bg-surface-overlay p-1 shadow-pop animate-fade-in" role="menu">
          {options.map((o) => (
            <button
              key={o.value}
              role="menuitemradio"
              aria-checked={preference === o.value}
              onClick={() => {
                setPreference(o.value);
                setOpen(false);
              }}
              className={cx(
                'flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-[13px] transition-colors',
                preference === o.value ? 'bg-soft font-medium text-soft-fg' : 'text-ink-muted hover:bg-soft/60 hover:text-ink',
              )}
            >
              <o.icon className="size-4" /> {o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function StatusPill({ status, error }: { status: ReturnType<typeof useApp>['status']; error: string | null }) {
  if (error) {
    return (
      <Badge tone="rose" className="hidden sm:inline-flex" title={error}>
        API offline
      </Badge>
    );
  }
  if (!status) {
    return (
      <Badge tone="slate" className="hidden sm:inline-flex">
        Connecting…
      </Badge>
    );
  }
  return (
    <Badge
      tone={status.mode === 'live' ? 'emerald' : 'amber'}
      className="hidden sm:inline-flex"
      title={`LLM: ${status.llm} · Embeddings: ${status.embeddings} · Repository: ${status.repository} · ${status.dataset.standardCount} standards indexed`}
    >
      <Activity className="size-3" /> {status.mode === 'live' ? 'Live AI' : 'Demo mode'}
    </Badge>
  );
}
