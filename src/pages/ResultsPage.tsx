import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { FileSearch, FileText, GitFork, Languages, ShieldAlert, Sparkles, Timer } from 'lucide-react';
import type { AnalysisResult, Recommendation } from '@/engine/types';
import { useAnalysisRoute } from '@/hooks/useAnalysisRoute';
import { useStandardDrawer } from '@/hooks/useStandardDrawer';
import { PageHeader } from '@/components/PageHeader';
import { Badge, Button, Card, CardSkeleton, DisclaimerBar, EmptyState, Tabs } from '@/components/ui';
import { RecommendationCard } from '@/components/analysis/RecommendationCard';
import { RequirementChips } from '@/components/analysis/RequirementChips';
import { GapList } from '@/components/analysis/GapList';
import { OutdatedTable } from '@/components/analysis/OutdatedTable';
import { CertificationPanel } from '@/components/analysis/CertificationPanel';
import { EvidenceList } from '@/components/analysis/EvidenceList';
import { StandardDetailDrawer } from '@/components/analysis/StandardDetailDrawer';
import { StandardsGraph, GraphLegend } from '@/components/graph/StandardsGraph';
import { ConfidencePill } from '@/components/analysis/ConfidenceMeter';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { formatDate } from '@/components/analysis/labels';

type Tab = 'recommended' | 'related' | 'certification' | 'gaps' | 'outdated' | 'evidence' | 'graph';

export function ResultsPage() {
  const { analysis, loading, notFound } = useAnalysisRoute();
  const drawer = useStandardDrawer();
  const [tab, setTab] = useState<Tab>('recommended');
  const navigate = useNavigate();

  const lookup = useMemo(() => {
    const m = new Map<string, Recommendation>();
    for (const r of [...(analysis?.recommendations ?? []), ...(analysis?.related ?? [])]) m.set(r.standard.id, r);
    return m;
  }, [analysis]);

  if (loading) {
    return (
      <div className="space-y-4">
        <CardSkeleton lines={2} />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    );
  }
  if (notFound || !analysis) {
    return (
      <EmptyState
        icon={<FileSearch className="size-5" />}
        title={notFound ? 'Analysis not found' : 'No analysis yet'}
        description={notFound ? 'This analysis is not stored in your browser or on the server.' : 'Describe a product or upload a tender to see recommendations, related standards, certification, gaps and the knowledge graph.'}
        action={
          <Button onClick={() => navigate('/analyze')}>
            <Sparkles className="size-4" /> Analyze a specification
          </Button>
        }
      />
    );
  }

  const a = analysis;
  const primaryIds = new Set(a.recommendations.map((r) => r.standard.id));
  const outdatedFlagged = a.outdated.filter((o) => o.status === 'potentially-outdated' || o.status === 'superseded').length;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Recommendations"
        title="Analysis results"
        description={a.summary.headline}
        actions={
          <>
            <Link to={`/graph/${a.id}`}>
              <Button variant="secondary">
                <GitFork className="size-4" /> Open graph
              </Button>
            </Link>
            <Link to={`/spec/${a.id}`}>
              <Button variant="accent">
                <FileText className="size-4" /> Generate Standards-Ready Specification
              </Button>
            </Link>
          </>
        }
      />

      <div className="results-bento">
        <SummaryCard a={a} />
        <div className="results-metrics">
          <Kpi label="Primary standards" value={a.summary.primaryCount} />
          <Kpi label="Related standards" value={a.summary.relatedCount} />
          <Kpi label="Certification mappings" value={a.summary.certificationCount} />
          <Kpi label="Potential gaps" value={a.summary.gapCount} tone={a.summary.gapCount ? 'amber' : 'emerald'} />
          <Kpi label="Outdated references" value={outdatedFlagged} tone={outdatedFlagged ? 'rose' : 'emerald'} />
        </div>
      </div>

      <div className="surface-strip px-2">
        <Tabs
          value={tab}
          onChange={setTab}
          tabs={[
            { id: 'recommended', label: 'Top Recommended', count: a.recommendations.length },
            { id: 'related', label: 'Related Standards', count: a.related.length },
            { id: 'certification', label: 'Certification', count: a.summary.certificationCount },
            { id: 'gaps', label: 'Potential Gaps', count: a.gaps.length },
            { id: 'outdated', label: 'Outdated References', count: a.outdated.length },
            { id: 'evidence', label: 'Evidence' },
            { id: 'graph', label: 'Knowledge Graph' },
          ]}
        />
      </div>

      <ErrorBoundary label="Results panel">
        {tab === 'recommended' &&
          (a.recommendations.length ? (
            <div className="space-y-3">
              {a.recommendations.map((r, i) => (
                <RecommendationCard key={r.standard.id} rec={r} rank={i} requirements={a.requirements} onOpenStandard={drawer.open} defaultOpen={i === 0} />
              ))}
            </div>
          ) : (
            <EmptyState icon={<ShieldAlert className="size-5" />} title="No confident match in the indexed dataset" description="Try adding the product type, sector and key ratings, or browse the Standards Explorer. The demo index covers lighting, cables, electrical, civil, water, solar, IT and metering." />
          ))}

        {tab === 'related' &&
          (a.related.length ? (
            <div className="space-y-3">
              {a.related.map((r) => (
                <RecommendationCard key={r.standard.id} rec={r} requirements={a.requirements} onOpenStandard={drawer.open} />
              ))}
            </div>
          ) : (
            <EmptyState title="No related standards" description="No relationship links are indexed for the primary recommendations." />
          ))}

        {tab === 'certification' && <CertificationPanel items={a.certifications} primaryIds={primaryIds} onOpenStandard={drawer.open} />}

        {tab === 'gaps' && (
          <div className="space-y-4">
            <DisclaimerBar text="Gap findings are potential issues detected by rules against indexed metadata. They do not establish legal obligations — review each item before acting." />
            <GapList gaps={a.gaps} lookup={lookup} onOpenStandard={drawer.open} />
          </div>
        )}

        {tab === 'outdated' && <OutdatedTable items={a.outdated} onOpenStandard={drawer.open} />}

        {tab === 'evidence' && (
          <div className="space-y-3">
            {a.recommendations.map((r) => (
              <Card key={r.standard.id} className="p-5">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className="font-mono font-semibold text-ink">{r.standard.number}</span>
                  <ConfidencePill c={r.confidence} />
                  <span className="text-[13px] text-ink-muted">{r.standard.title}</span>
                </div>
                <EvidenceList evidence={r.evidence} source={r.standard.source} />
              </Card>
            ))}
            {!a.recommendations.length && <EmptyState title="No evidence to show" />}
          </div>
        )}

        {tab === 'graph' && (
          <div className="space-y-3">
            <StandardsGraph graph={a.graph} height={520} onSelect={(n) => n.standardId && drawer.open(n.standardId)} />
            <GraphLegend />
          </div>
        )}
      </ErrorBoundary>

      <DisclaimerBar text={a.disclaimer} />
      <StandardDetailDrawer id={drawer.id} onClose={drawer.close} onNavigate={drawer.open} />
    </div>
  );
}

function SummaryCard({ a }: { a: AnalysisResult }) {
  return (
    <Card className="depth-card p-5 animate-fade-up">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="label-caps mb-1">Analysis summary</div>
          <div className="text-[17px] font-semibold">{a.summary.productDescription}</div>
          <p className="mt-1 text-[13px] text-ink-muted line-clamp-3">{a.input.original}</p>
          {a.input.translationNote && (
            <p className="mt-1.5 inline-flex items-center gap-1.5 rounded-md bg-muted px-2 py-1 text-[12px] text-ink">
              <Languages className="size-3.5" /> {a.input.translationNote} <span className="text-ink-muted">→ “{a.input.normalized.slice(0, 100)}{a.input.normalized.length > 100 ? '…' : ''}”</span>
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-1.5 text-[11.5px]">
          <Badge tone={a.provider.mode === 'live' ? 'emerald' : 'amber'}>{a.provider.mode === 'live' ? 'Live AI' : 'Demo mode'}</Badge>
          <Badge tone="slate">{a.input.source.toUpperCase()}</Badge>
          <Badge tone="slate">{a.input.language === 'en' ? 'English' : a.input.language === 'hi' ? 'Hindi' : a.input.language === 'hinglish' ? 'Hinglish' : 'Unknown'}</Badge>
          <Badge tone="slate">
            <Timer className="size-3" /> {Object.values(a.timingsMs).reduce((x, y) => x + y, 0)} ms
          </Badge>
          <Badge tone="slate">{formatDate(a.createdAt)}</Badge>
        </div>
      </div>
      <div className="mt-4">
        <div className="label-caps mb-1.5">Extracted requirements ({a.requirements.length})</div>
        <RequirementChips requirements={a.requirements} limit={14} />
      </div>
    </Card>
  );
}

function Kpi({ label, value, tone = 'navy' }: { label: string; value: number; tone?: 'navy' | 'amber' | 'rose' | 'emerald' }) {
  const color = { navy: 'text-ink', amber: 'text-amber-700', rose: 'text-rose-700', emerald: 'text-emerald-700' }[tone];
  return (
    <Card className="depth-card p-4 animate-fade-up">
      <div className="label-caps">{label}</div>
      <div className={`mt-1 text-2xl font-bold ${color}`}>{value}</div>
    </Card>
  );
}
