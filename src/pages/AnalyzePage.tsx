import { lazy, Suspense, useState } from 'react';
import { ArrowRight, FileSearch, FileText, ShieldCheck, Sparkles, Type } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { SearchHero } from '@/components/analysis/SearchHero';
import { CardSkeleton, cx } from '@/components/ui';

// PDF.js is sizeable. Keep the document workspace out of the text-analysis
// route until the user explicitly chooses the upload tab.
const UploadPage = lazy(() => import('./UploadPage').then((m) => ({ default: m.UploadPage })));

export function AnalyzePage() {
  const [activeTab, setActiveTab] = useState<'text' | 'document'>('text');

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-in">
      <PageHeader
        eyebrow="Analysis"
        title="Turn a procurement brief into standards-ready evidence"
        description="Describe a product requirement or upload a tender document to identify applicable Indian Standards, related references, certification signals, and procurement gaps."
      />

      <section className="depth-card overflow-hidden rounded-xl border border-line bg-surface-raised">
        <div className="flex items-center gap-2 border-b border-line bg-surface-sunken px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-muted"><Sparkles className="size-3.5 text-primary" /> Procurement intelligence workflow</div>
        <div className="grid divide-y divide-line sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          <WorkflowStep number="01" icon={Type} title="Describe" detail="Product, technical requirement, or tender scope" />
          <WorkflowStep number="02" icon={FileSearch} title="Inspect" detail="Relevant IS, relationships, and requirements" />
          <WorkflowStep number="03" icon={ShieldCheck} title="Prepare" detail="Compliance review and tender-ready draft" terminal />
        </div>
      </section>

      <div className="surface-strip flex border-b-0 px-2">
        <TabButton 
          active={activeTab === 'text'} 
          onClick={() => setActiveTab('text')} 
          icon={Type} 
          label="Text Input" 
        />
        <TabButton 
          active={activeTab === 'document'} 
          onClick={() => setActiveTab('document')} 
          icon={FileText} 
          label="Upload Document" 
        />
      </div>

      <div className={cx("transition-opacity duration-300", activeTab === 'text' ? 'block' : 'hidden')}>
        <SearchHero />
      </div>

      <div className={cx("transition-opacity duration-300", activeTab === 'document' ? 'block' : 'hidden')}>
        {activeTab === 'document' && (
          <Suspense fallback={<CardSkeleton lines={3} />}>
            <UploadPage inline />
          </Suspense>
        )}
      </div>
    </div>
  );
}

function WorkflowStep({ number, icon: Icon, title, detail, terminal = false }: { number: string; icon: LucideIcon; title: string; detail: string; terminal?: boolean }) {
  return <div className="relative flex gap-3 p-4 sm:min-h-28"><span className="grid size-9 shrink-0 place-items-center rounded-lg bg-soft text-soft-fg"><Icon className="size-4" /></span><div><div className="mb-1 flex items-center gap-2"><span className="text-[10px] font-semibold tracking-[0.12em] text-primary">{number}</span><h2 className="text-[14px] font-semibold">{title}</h2></div><p className="max-w-48 text-[12px] leading-5 text-ink-muted">{detail}</p></div>{!terminal && <ArrowRight className="absolute right-3 top-1/2 hidden size-3.5 -translate-y-1/2 text-ink-subtle lg:block" />}</div>;
}

function TabButton({ active, onClick, icon: Icon, label }: { active: boolean; onClick: () => void; icon: LucideIcon; label: string }) {
  return (
    <button
      onClick={onClick}
      className={cx(
        "flex items-center gap-2 px-4 py-3 text-[14px] font-medium border-b-2 transition-colors",
          active 
          ? "border-primary text-primary" 
          : "border-transparent text-ink-muted hover:text-ink hover:border-line-strong"
      )}
    >
      <Icon className="size-4" />
      {label}
    </button>
  );
}
