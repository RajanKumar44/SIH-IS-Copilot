import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router';
import { ArrowRight, Languages, Sparkles, Upload } from 'lucide-react';
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
    <form onSubmit={submit} className={cx('card p-4 md:p-5 animate-fade-up', !compact && 'shadow-card-hover')}>
      <label htmlFor="hero-input" className="sr-only">
        Describe the product or paste a tender specification
      </label>
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
          className="w-full resize-y rounded-xl border border-line bg-surface px-4 py-3 text-[14.5px] leading-relaxed outline-none transition-colors placeholder:text-slate-400 focus:border-navy-400 focus:bg-white"
        />
        {lang !== 'unknown' && (
          <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-md bg-white/90 px-2 py-0.5 text-[11px] font-medium text-ink-muted ring-1 ring-line">
            <Languages className="size-3" /> {lang === 'en' ? 'English' : lang === 'hi' ? 'Hindi' : 'Hinglish'}
          </span>
        )}
      </div>
      {analysisError && (
        <p className="mt-2 rounded-lg bg-rose-50 px-3 py-2 text-[12.5px] text-rose-700" role="alert">
          {analysisError}
        </p>
      )}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Button type="submit" variant="accent" size={compact ? 'md' : 'lg'} loading={analysing} disabled={!text.trim()}>
          <Sparkles className="size-4" /> {analysing ? 'Analysing…' : 'Analyze Standards'}
        </Button>
        <Button type="button" variant="secondary" size={compact ? 'md' : 'lg'} onClick={() => navigate('/upload')}>
          <Upload className="size-4" /> Upload Tender
        </Button>
        <span className="ml-auto hidden text-[11.5px] text-ink-muted sm:inline">Ctrl/⌘ + Enter to analyse · English, Hindi and Hinglish supported</span>
      </div>
      {!compact && (
        <div className="mt-4 flex flex-wrap items-center gap-1.5">
          <span className="text-[11.5px] text-ink-muted mr-1">Try:</span>
          {EXAMPLE_QUERIES.map((q) => (
            <button
              key={q.label}
              type="button"
              onClick={() => setText(q.text)}
              className="inline-flex items-center gap-1 rounded-full border border-line bg-white px-3 py-1 text-[12px] text-ink-muted transition-colors hover:border-navy-300 hover:text-navy-800"
            >
              {q.label} <ArrowRight className="size-3 opacity-60" />
            </button>
          ))}
        </div>
      )}
    </form>
  );
}
