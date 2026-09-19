import { useState } from 'react';
import { Link } from 'react-router';
import { ArrowUpRight, BookOpenText, Braces, Clock3, Database, FileSearch, GitFork, Network, ShieldAlert, Sparkles, Wand2 } from 'lucide-react';
import type { HistoryEntry } from '@/engine/types';
import { useApp } from '@/context/AppContext';
import { historyStore } from '@/services/history';
import { SearchHero } from '@/components/analysis/SearchHero';
import { Badge, Card } from '@/components/ui';
import { formatDate } from '@/components/analysis/labels';

const PIPELINE = [
  { icon: FileSearch, label: 'Requirement extraction', text: 'Entities, ratings, references and ambiguous wording pulled from text or PDF.' },
  { icon: Braces, label: 'Semantic retrieval', text: 'Embeddings + pgvector nearest-neighbour search with metadata filtering.' },
  { icon: Wand2, label: 'LLM reranking', text: 'Candidates re-scored against your requirements with a transparent confidence model.' },
  { icon: Network, label: 'Relationship expansion', text: 'Normative references, test methods, safety, installation and allied standards.' },
  { icon: ShieldAlert, label: 'Gap & outdated detection', text: 'Missing clauses, superseded editions and certification mappings surfaced with evidence.' },
];

export function DashboardPage() {
  const { status, statusError } = useApp();
  const [recent] = useState<HistoryEntry[]>(() => historyStore.listLocal().slice(0, 5));
  const gapsTotal = historyStore.listLocal().reduce((n, e) => n + e.gapCount, 0);

  return (
    <div className="space-y-8">
      <section className="animate-fade-up">
        <div className="mb-5 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-navy-50 px-3 py-1 text-[12px] font-medium text-navy-700 ring-1 ring-navy-100">
            <Sparkles className="size-3.5" /> Smart India Hackathon 2026 · SIH26108
          </div>
          <h1 className="mt-3 text-3xl font-bold tracking-tight md:text-[34px] md:leading-tight">
            Find the right Indian Standards for any procurement specification.
          </h1>
          <p className="mt-2 text-[15px] text-ink-muted">
            IS Copilot reads a product description or tender, understands it semantically, and connects it to primary, allied and normative standards — with confidence scores, evidence, gap analysis and a standards-ready specification draft.
          </p>
        </div>
        <SearchHero />
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat icon={<Database className="size-4" />} label="Standards indexed" value={status ? String(status.dataset.standardCount) : '—'} hint={status?.dataset.name ?? 'Loading…'} />
        <Stat icon={<Clock3 className="size-4" />} label="Recent analyses" value={String(historyStore.listLocal().length)} hint="Stored in this browser" />
        <Stat icon={<ShieldAlert className="size-4" />} label="Potential gaps identified" value={String(gapsTotal)} hint="Across saved analyses" />
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <span className="label-caps">System status</span>
            <Badge tone={statusError ? 'rose' : status?.mode === 'live' ? 'emerald' : 'amber'}>{statusError ? 'API offline' : status ? (status.mode === 'live' ? 'Live AI' : 'Demo mode') : 'Connecting'}</Badge>
          </div>
          <dl className="mt-2 space-y-1 text-[12.5px]">
            <div className="flex justify-between gap-2"><dt className="text-ink-muted">LLM</dt><dd className="font-mono truncate">{status?.llm ?? '—'}</dd></div>
            <div className="flex justify-between gap-2"><dt className="text-ink-muted">Embeddings</dt><dd className="font-mono truncate">{status?.embeddings ?? '—'}</dd></div>
            <div className="flex justify-between gap-2"><dt className="text-ink-muted">Repository</dt><dd className="font-mono truncate">{status?.repository ?? '—'}</dd></div>
          </dl>
          {status?.warnings.length ? <p className="mt-2 text-[11px] text-amber-700">{status.warnings[0]}</p> : null}
        </Card>
      </section>

      <div className="grid gap-6 lg:grid-cols-5">
        <section className="lg:col-span-3">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-semibold">Recent analyses</h2>
            <Link to="/history" className="text-[13px] font-medium text-navy-700 hover:underline">
              View all
            </Link>
          </div>
          {recent.length ? (
            <ul className="space-y-2">
              {recent.map((e) => (
                <li key={e.id}>
                  <Link to={`/results/${e.id}`} className="card card-hover flex items-center gap-4 p-4">
                    <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-navy-50 text-navy-700">
                      <FileSearch className="size-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[13.5px] font-medium">{e.query}</div>
                      <div className="mt-0.5 flex flex-wrap gap-x-3 text-[12px] text-ink-muted">
                        <span>{formatDate(e.createdAt)}</span>
                        <span>{e.recommendationCount} recommendations</span>
                        <span>{e.gapCount} gaps</span>
                        {e.topStandard && <span className="font-mono">{e.topStandard}</span>}
                      </div>
                    </div>
                    <ArrowUpRight className="size-4 text-ink-muted" />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <Card className="p-6 text-[13px] text-ink-muted">No analyses yet. Try an example above — results appear here and in Search History.</Card>
          )}
        </section>

        <section className="lg:col-span-2">
          <h2 className="mb-3 text-base font-semibold">How it works</h2>
          <Card className="divide-y divide-line">
            {PIPELINE.map((p, i) => (
              <div key={p.label} className="flex gap-3 p-4">
                <div className="grid size-8 shrink-0 place-items-center rounded-lg bg-navy-800 text-white">
                  <p.icon className="size-4" />
                </div>
                <div>
                  <div className="text-[13px] font-semibold">
                    <span className="mr-1.5 font-mono text-ink-muted">{i + 1}.</span>
                    {p.label}
                  </div>
                  <div className="text-[12.5px] text-ink-muted">{p.text}</div>
                </div>
              </div>
            ))}
          </Card>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Link to="/explorer" className="card card-hover flex items-center gap-2 p-3 text-[13px] font-medium">
              <BookOpenText className="size-4 text-navy-600" /> Standards Explorer
            </Link>
            <Link to="/graph" className="card card-hover flex items-center gap-2 p-3 text-[13px] font-medium">
              <GitFork className="size-4 text-navy-600" /> Relationship Graph
            </Link>
          </div>
        </section>
      </div>

      {status && (
        <p className="text-[11.5px] text-ink-muted">
          <strong className="text-ink">Demo data notice:</strong> {status.dataset.disclaimer}
        </p>
      )}
    </div>
  );
}

function Stat({ icon, label, value, hint }: { icon: React.ReactNode; label: string; value: string; hint: string }) {
  return (
    <Card className="p-4 animate-fade-up">
      <div className="flex items-center justify-between">
        <span className="label-caps">{label}</span>
        <span className="grid size-7 place-items-center rounded-md bg-navy-50 text-navy-700">{icon}</span>
      </div>
      <div className="mt-2 text-2xl font-bold tracking-tight">{value}</div>
      <div className="text-[12px] text-ink-muted">{hint}</div>
    </Card>
  );
}
