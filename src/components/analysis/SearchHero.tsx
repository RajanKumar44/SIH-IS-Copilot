import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router';
import { ArrowRight, Languages, Sparkles } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Button, cx } from '@/components/ui';
import { detectLanguage } from '@/engine/language/detect';
import { EXAMPLE_QUERIES } from './exampleQueries';


export function SearchHero({ compact = false, initial = '' }: { compact?: boolean; initial?: string }) {
  const [text, setText] = useState(initial);
  const { runAnalysis, analysing, analysisError, clearError } = useApp();
  const navigate = useNavigate();
  const lang = text.trim().length > 6 ? detectLanguage(text) : 'unknown';

  const submit = async (e?: FormEvent) => {
    e?.preventDefault();
    if (!text.trim() || analysing) return;
    try {
      const result = await runAnalysis(text.trim(), text.length > 600 ? 'paste' : 'text');
      navigate(`/results/${result.id}`);
    } catch {
      /* error shown inline */
    }
  };

  return (
    <form onSubmit={submit} className={cx('analysis-input-stage card p-4 md:p-5 animate-fade-up', !compact && 'shadow-card-hover')}>
      <label htmlFor="hero-input" className="sr-only">
        Describe the product or paste a tender specification
      </label>
      {!compact && (
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <div className="label-caps mb-1">Requirement workspace</div>
            <p className="text-[13px] text-ink-muted">Include the product, intended environment, ratings, materials or any cited standard.</p>
          </div>
          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-soft text-soft-fg"><Sparkles className="size-4" /></span>
        </div>
      )}
      <div className="relative">
        <textarea
          id="hero-input"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            if (analysisError) clearError();
          }}
          onKeyDown={(e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') void submit();
          }}
          rows={compact ? 3 : 4}
          placeholder="Describe the product or upload a tender… e.g. LED street lighting system for municipal roads, 120W, IP66, outdoor installation"
          className="w-full resize-y rounded-xl border border-line bg-surface-sunken px-4 py-3 text-[14.5px] leading-relaxed outline-none transition-colors placeholder:text-slate-400 focus:border-primary focus:bg-surface-raised"
        />
        {lang !== 'unknown' && (
          <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-md bg-surface-raised px-2 py-0.5 text-[11px] font-medium text-ink-muted ring-1 ring-line shadow-sm">
            <Languages className="size-3" /> {lang === 'en' ? 'English' : lang === 'hi' ? 'Hindi' : 'Hinglish'}
          </span>
        )}
        <span className="absolute right-3 bottom-3 text-[11px] font-mono text-ink-muted">
          {text.length} chars
        </span>
      </div>
      {analysisError && (
        <p className="mt-2 rounded-lg bg-rose-50 px-3 py-2 text-[12.5px] text-rose-700" role="alert">
          {analysisError}
        </p>
      )}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Button type="submit" variant="accent" size={compact ? 'md' : 'lg'} loading={analysing} disabled={!text.trim() || analysing}>
          <Sparkles className="size-4" /> {analysing ? 'Analysing…' : 'Analyze Standards'}
        </Button>
        {!compact && (
          <span className="ml-auto hidden text-[11.5px] text-ink-muted sm:inline">Ctrl/⌘ + Enter to analyse</span>
        )}
      </div>
      {!compact && (
        <div className="mt-4 flex flex-wrap items-center gap-1.5">
          <span className="text-[11.5px] text-ink-muted mr-1">Try:</span>
          {EXAMPLE_QUERIES.map((q) => (
            <button
              key={q.label}
              type="button"
              onClick={() => setText(q.text)}
              className="inline-flex items-center gap-1 rounded-full border border-line bg-surface-raised px-3 py-1 text-[12px] text-ink-muted shadow-sm transition-all hover:border-primary hover:text-ink"
            >
              {q.label} <ArrowRight className="size-3 opacity-60" />
            </button>
          ))}
        </div>
      )}
    </form>
  );
}
