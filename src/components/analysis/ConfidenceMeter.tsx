import type { ConfidenceBreakdown } from '@/engine/types';
import { BAND_LABELS, CONFIDENCE_WEIGHTS } from '@/engine/ranking/confidence';
import { cx } from '@/components/ui';

const BAND_STYLE = {
  'very-high': { bar: 'bg-emerald-500', text: 'text-emerald-700', ring: 'ring-emerald-200 bg-emerald-50' },
  high: { bar: 'bg-primary', text: 'text-ink', ring: 'ring-primary/20 bg-primary/5' },
  medium: { bar: 'bg-amber-500', text: 'text-amber-800', ring: 'ring-amber-200 bg-amber-50' },
  low: { bar: 'bg-slate-400', text: 'text-slate-600', ring: 'ring-slate-200 bg-slate-100' },
} as const;

const COMPONENTS: Array<{ key: keyof typeof CONFIDENCE_WEIGHTS; label: string }> = [
  { key: 'semantic', label: 'Semantic similarity' },
  { key: 'metadata', label: 'Metadata relevance' },
  { key: 'category', label: 'Product category match' },
  { key: 'coverage', label: 'Requirement coverage' },
  { key: 'relationship', label: 'Relationship relevance' },
  { key: 'evidence', label: 'Evidence strength' },
];

export function ConfidencePill({ c, compact }: { c: ConfidenceBreakdown; compact?: boolean }) {
  const s = BAND_STYLE[c.band];
  return (
    <span className={cx('inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[11px] font-semibold ring-1 ring-inset', s.ring, s.text)} title="AI Recommendation Confidence — not an official BIS score">
      <span className={cx('size-1.5 rounded-full', s.bar)} />
      {compact ? c.total : `${BAND_LABELS[c.band]} · ${c.total}`}
    </span>
  );
}

export function ConfidenceMeter({ c, showBreakdown = false }: { c: ConfidenceBreakdown; showBreakdown?: boolean }) {
  const s = BAND_STYLE[c.band];
  return (
    <div>
      <div className="flex items-center justify-between text-[11px] mb-1">
        <span className="label-caps">AI Recommendation Confidence</span>
        <span className={cx('font-semibold', s.text)}>
          {BAND_LABELS[c.band]} · {c.total}/100
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100" role="meter" aria-valuenow={c.total} aria-valuemin={0} aria-valuemax={100}>
        <div className={cx('h-full rounded-full transition-[width] duration-700', s.bar)} style={{ width: `${c.total}%` }} />
      </div>
      {showBreakdown && (
        <ul className="mt-3 grid grid-cols-1 gap-x-6 gap-y-1.5 sm:grid-cols-2">
          {COMPONENTS.map(({ key, label }) => (
            <li key={key} className="text-[12px]">
              <div className="flex justify-between text-ink-muted">
                <span>
                  {label} <span className="opacity-60">× {CONFIDENCE_WEIGHTS[key]}</span>
                </span>
                <span className="font-mono">{Math.round(c[key] * 100)}%</span>
              </div>
              <div className="mt-0.5 h-1 rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-primary/60" style={{ width: `${c[key] * 100}%` }} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
