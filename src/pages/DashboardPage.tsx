import { Link } from 'react-router';
import { useEffect, useState } from 'react';
import { ArrowRight, BookOpenText, CheckCircle2, ChevronRight, Clock3, FileSearch, FileText, GitFork, LayoutDashboard, ScanSearch, ShieldCheck, Sparkles, Upload } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { HistoryEntry } from '@/engine/types';
import { historyStore } from '@/services/history';
import { useApp } from '@/context/AppContext';
import { Badge, Button, Card, CardSkeleton, EmptyState } from '@/components/ui';
import { formatDate } from '@/components/analysis/labels';

const CAPABILITIES: Array<{ icon: LucideIcon; title: string; description: string; tone: string }> = [
  { icon: ScanSearch, title: 'Semantic discovery', description: 'Translate a product brief into the standards that actually apply.', tone: 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300' },
  { icon: GitFork, title: 'Standards relationships', description: 'Trace normative, testing, safety and allied references in context.', tone: 'bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300' },
  { icon: ShieldCheck, title: 'Compliance readiness', description: 'Surface certification signals and procurement risks before release.', tone: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300' },
  { icon: FileText, title: 'Tender acceleration', description: 'Turn recommendations into a review-ready specification draft.', tone: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300' },
];

const PIPELINE = [
  { label: 'Requirement', icon: FileSearch },
  { label: 'Standards', icon: BookOpenText },
  { label: 'Compliance', icon: ShieldCheck },
  { label: 'Tender', icon: FileText },
];

export function DashboardPage() {
  const { status } = useApp();
  const [entries, setEntries] = useState<HistoryEntry[] | null>(null);

  useEffect(() => {
    let active = true;
    void historyStore.listMerged().then(({ entries: merged }) => {
      if (active) setEntries(merged.slice(0, 4));
    });
    return () => { active = false; };
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Scrolling Ticker */}
      <div className="relative flex items-center overflow-hidden rounded-xl border border-line bg-surface-raised py-2.5 px-4 shadow-sm dark:bg-surface-sunken">
        <div className="absolute left-0 top-0 z-10 flex h-full items-center bg-gradient-to-r from-surface-raised via-surface-raised to-transparent px-4 pr-12 font-semibold tracking-tight text-primary dark:from-surface-sunken dark:via-surface-sunken dark:text-primary-fg">
          <span className="flex items-center gap-2">
            <span className="relative flex size-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex size-2.5 rounded-full bg-accent"></span>
            </span>
            <span className="text-[12px] uppercase tracking-wider">Updates</span>
          </span>
        </div>
        
        <div className="flex w-full whitespace-nowrap pl-32">
          <div className="animate-marquee inline-block w-full">
             <span className="mx-4 text-[13px] font-medium"><strong className="text-primary dark:text-primary-fg">Amended IS Report:</strong> IS 16102 (Part 1):2012 — Performance Requirements updated.</span>
             <span className="mx-4 text-line-strong">•</span>
             <span className="mx-4 text-[13px] font-medium"><strong className="text-emerald-600 dark:text-emerald-400">Newly Published:</strong> IS 10322:2012 latest version available.</span>
             <span className="mx-4 text-line-strong">•</span>
             <span className="mx-4 text-[13px] font-medium">Highlight: Review your recommended standards for recent compliance gaps.</span>
             <span className="mx-4 text-line-strong">•</span>
             <span className="mx-4 text-[13px] font-medium"><strong className="text-primary dark:text-primary-fg">Amended IS Report:</strong> IS 15885 (Part 2):2010 — Electrical control gear requirements changed.</span>
             <span className="mx-4 text-line-strong">•</span>
             <span className="mx-4 text-[13px] font-medium"><strong className="text-primary dark:text-primary-fg">Alert:</strong> Mandatory certification for smart meters extending next quarter.</span>
             <span className="mx-4 text-line-strong">•</span>
             <span className="mx-4 text-[13px] font-medium"><strong className="text-emerald-600 dark:text-emerald-400">Newly Published:</strong> IS 13703 (Part 1) — Low-voltage fuses standard updated.</span>
             <span className="mx-4 text-line-strong">•</span>
             <span className="mx-4 text-[13px] font-medium">Highlight: Ensure latest QCO (Quality Control Order) adherence for cable tenders.</span>
          </div>
        </div>
      </div>

      <section className="procurement-hero relative overflow-hidden rounded-2xl border border-primary/20 px-6 py-7 text-white shadow-[0_18px_50px_rgba(11,37,69,0.18)] sm:px-10 sm:py-9 lg:px-12">
        <div className="pointer-events-none absolute -right-20 -top-24 size-72 rounded-full border border-white/10 bg-white/5 blur-2xl" />
        
        {/* Ashoka Pillar Watermark */}
        <div className="pointer-events-none absolute inset-y-0 right-0 py-6 opacity-40 lg:right-6">
          <img src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg" alt="" className="h-full w-auto object-contain object-right invert mix-blend-screen" aria-hidden="true" />
        </div>

        <div className="relative z-10 max-w-2xl lg:max-w-3xl">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[11px] font-semibold tracking-wide text-blue-100"><Sparkles className="size-3.5" /> IS COPILOT · PROCUREMENT INTELLIGENCE</div>
            <h1 className="max-w-3xl !text-white text-3xl font-semibold leading-tight tracking-[-0.03em] sm:text-4xl lg:text-[42px]">Make every tender easier to defend.</h1>
            <p className="mt-4 max-w-2xl text-[15px] leading-7 text-blue-100/85 sm:text-base">Identify the Indian Standards behind a procurement requirement, understand the evidence, and move from first brief to review-ready specification with confidence.</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/analyze"><Button size="lg" className="!border-white/10 !bg-white !text-primary hover:!bg-blue-50"><FileSearch className="size-4" /> Start an analysis <ArrowRight className="size-4" /></Button></Link>
              <Link to="/upload"><Button size="lg" variant="ghost" className="border border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white"><Upload className="size-4" /> Upload tender</Button></Link>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-3">
        <SignalCard label="Knowledge base" value={status ? `${status.dataset.standardCount}` : '—'} detail="indexed standards" icon={BookOpenText} />
        <SignalCard label="Operating mode" value={status?.mode === 'live' ? 'Live AI' : 'Demo'} detail={status?.repository ?? 'Connecting to dataset'} icon={LayoutDashboard} />
        <SignalCard label="Workspace" value={entries ? `${entries.length}` : '—'} detail="recent analyses" icon={Clock3} />
      </div>

      <section>
        <div className="mb-4 flex items-end justify-between gap-4"><div><div className="label-caps mb-1">Built for the full decision</div><h2 className="text-xl font-semibold tracking-tight">From requirement to tender-ready evidence</h2></div><Link to="/about" className="hidden items-center gap-1 text-[13px] font-medium text-primary hover:underline sm:flex">How it works <ArrowRight className="size-3.5" /></Link></div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{CAPABILITIES.map(({ icon: Icon, title, description, tone }) => <Card key={title} className="depth-card group p-4 transition-transform duration-200 hover:-translate-y-0.5" hover><div className={`mb-4 grid size-9 place-items-center rounded-lg ${tone}`}><Icon className="size-[17px]" /></div><h3 className="text-[14px] font-semibold">{title}</h3><p className="mt-1.5 text-[12.5px] leading-5 text-ink-muted">{description}</p></Card>)}</div>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between"><div><div className="label-caps mb-1">Workspace activity</div><h2 className="text-xl font-semibold tracking-tight">Recent analyses</h2></div>{entries && entries.length > 0 && <Link to="/history" className="flex items-center gap-1 text-[13px] font-medium text-primary hover:underline">View history <ArrowRight className="size-3.5" /></Link>}</div>
        {!entries ? <CardSkeleton lines={2} /> : entries.length === 0 ? <EmptyState icon={<FileSearch className="size-5" />} title="No analyses yet" description="Start with a product description or upload a tender document." action={<Link to="/analyze"><Button><FileSearch className="size-4" /> Start analysis</Button></Link>} /> : <div className="overflow-hidden rounded-xl border border-line bg-surface-raised">{entries.map((entry, index) => <Link key={entry.id} to={`/results/${entry.id}`} className="group flex flex-col gap-3 border-b border-line px-4 py-4 transition-colors last:border-0 hover:bg-surface-sunken sm:flex-row sm:items-center sm:justify-between sm:px-5"><div className="flex min-w-0 items-center gap-3"><span className="grid size-8 shrink-0 place-items-center rounded-lg bg-soft text-soft-fg text-[11px] font-semibold">{String(index + 1).padStart(2, '0')}</span><div className="min-w-0"><div className="truncate text-[13.5px] font-semibold group-hover:text-primary">{entry.query}</div><div className="mt-1 flex flex-wrap items-center gap-2 text-[11.5px] text-ink-muted"><span>{formatDate(entry.createdAt)}</span><Badge tone={entry.mode === 'live' ? 'emerald' : 'amber'}>{entry.mode}</Badge><Badge tone="slate">{entry.source}</Badge></div></div></div><div className="flex items-center gap-4 pl-11 text-[12px] sm:pl-0"><span><strong className="text-ink">{entry.recommendationCount}</strong> standards</span><span className={entry.gapCount ? 'text-tone-amber-fg' : 'text-tone-emerald-fg'}><strong>{entry.gapCount}</strong> gaps</span><ArrowRight className="size-4 text-ink-subtle transition-transform group-hover:translate-x-0.5" /></div></Link>)}</div>}
      </section>
    </div>
  );
}

function SignalCard({ label, value, detail, icon: Icon }: { label: string; value: string; detail: string; icon: LucideIcon }) {
  return <Card className="depth-card flex items-center gap-3 p-4"><div className="grid size-9 place-items-center rounded-lg bg-soft text-soft-fg"><Icon className="size-4" /></div><div className="min-w-0"><div className="label-caps">{label}</div><div className="mt-0.5 flex items-baseline gap-1.5"><span className="text-lg font-semibold tracking-tight">{value}</span><span className="truncate text-[11px] text-ink-muted">{detail}</span></div></div></Card>;
}
