import { AlertTriangle, Inbox, Loader2, RefreshCw, X } from 'lucide-react';
import { useEffect, type ButtonHTMLAttributes, type HTMLAttributes, type ReactNode } from 'react';

export { cx } from './cx';
import { cx } from './cx';

// ───────────────────────────── Button ────────────────────────────────────────

type Variant = 'primary' | 'secondary' | 'ghost' | 'accent' | 'danger';
type Size = 'sm' | 'md' | 'lg';

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-navy-800 text-white hover:bg-navy-700 shadow-sm disabled:bg-navy-300',
  accent: 'bg-saffron-500 text-white hover:bg-saffron-600 shadow-sm disabled:bg-saffron-200',
  secondary: 'bg-white text-navy-800 border border-line hover:border-navy-300 hover:bg-navy-50',
  ghost: 'text-ink-muted hover:bg-navy-50 hover:text-navy-800',
  danger: 'bg-rose-600 text-white hover:bg-rose-700',
};
const SIZES: Record<Size, string> = {
  sm: 'h-8 px-3 text-[13px] gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
  lg: 'h-12 px-6 text-[15px] gap-2',
};

export function Button({ variant = 'primary', size = 'md', loading, className, children, disabled, ...rest }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size; loading?: boolean }) {
  return (
    <button
      className={cx('inline-flex items-center justify-center rounded-lg font-medium transition-colors disabled:cursor-not-allowed', VARIANTS[variant], SIZES[size], className)}
      disabled={disabled || loading}
      {...rest}
    >
      {loading && <Loader2 className="size-4 animate-spin" aria-hidden />}
      {children}
    </button>
  );
}

// ───────────────────────────── Badge ─────────────────────────────────────────

type Tone = 'navy' | 'saffron' | 'emerald' | 'amber' | 'rose' | 'slate' | 'sky' | 'violet';
const TONES: Record<Tone, string> = {
  navy: 'bg-navy-50 text-navy-700 ring-navy-200',
  saffron: 'bg-saffron-50 text-saffron-700 ring-saffron-200',
  emerald: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  amber: 'bg-amber-50 text-amber-800 ring-amber-200',
  rose: 'bg-rose-50 text-rose-700 ring-rose-200',
  slate: 'bg-slate-100 text-slate-700 ring-slate-200',
  sky: 'bg-sky-50 text-sky-700 ring-sky-200',
  violet: 'bg-violet-50 text-violet-700 ring-violet-200',
};

export function Badge({ tone = 'slate', className, children, ...rest }: HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) {
  return (
    <span className={cx('inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-semibold ring-1 ring-inset whitespace-nowrap', TONES[tone], className)} {...rest}>
      {children}
    </span>
  );
}

// ───────────────────────────── Card ──────────────────────────────────────────

export function Card({ className, children, hover, ...rest }: HTMLAttributes<HTMLDivElement> & { hover?: boolean }) {
  return (
    <div className={cx('card', hover && 'card-hover', className)} {...rest}>
      {children}
    </div>
  );
}

export function SectionHeader({ title, subtitle, action, icon }: { title: string; subtitle?: string; action?: ReactNode; icon?: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 mb-4">
      <div className="flex items-start gap-3">
        {icon && <div className="mt-0.5 grid size-9 place-items-center rounded-lg bg-navy-50 text-navy-700">{icon}</div>}
        <div>
          <h2 className="text-base font-semibold">{title}</h2>
          {subtitle && <p className="text-[13px] text-ink-muted mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {action}
    </div>
  );
}

// ───────────────────────────── States ────────────────────────────────────────

export function Skeleton({ className }: { className?: string }) {
  return <div className={cx('skeleton', className)} aria-hidden />;
}

export function CardSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="card p-5 space-y-3">
      <Skeleton className="h-4 w-1/3" />
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className={cx('h-3', i % 2 ? 'w-5/6' : 'w-full')} />
      ))}
    </div>
  );
}

export function EmptyState({ icon, title, description, action }: { icon?: ReactNode; title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="card p-10 text-center animate-fade-in">
      <div className="mx-auto mb-3 grid size-12 place-items-center rounded-full bg-navy-50 text-navy-500">{icon ?? <Inbox className="size-5" />}</div>
      <h3 className="text-[15px] font-semibold">{title}</h3>
      {description && <p className="mt-1 text-[13px] text-ink-muted max-w-md mx-auto">{description}</p>}
      {action && <div className="mt-4 flex justify-center">{action}</div>}
    </div>
  );
}

export function ErrorState({ title = 'Something went wrong', message, onRetry }: { title?: string; message: string; onRetry?: () => void }) {
  return (
    <div className="card p-6 border-rose-200 bg-rose-50/40 animate-fade-in" role="alert">
      <div className="flex gap-3">
        <AlertTriangle className="size-5 text-rose-600 shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-semibold text-rose-800">{title}</h3>
          <p className="text-[13px] text-rose-700 mt-0.5">{message}</p>
          {onRetry && (
            <Button variant="secondary" size="sm" className="mt-3" onClick={onRetry}>
              <RefreshCw className="size-3.5" /> Retry
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export function Spinner({ label }: { label?: string }) {
  return (
    <div className="flex items-center gap-2 text-ink-muted text-[13px]">
      <Loader2 className="size-4 animate-spin" /> {label}
    </div>
  );
}

// ───────────────────────────── Drawer ────────────────────────────────────────

export function Drawer({ open, onClose, title, children, width = 'max-w-xl' }: { open: boolean; onClose: () => void; title: ReactNode; children: ReactNode; width?: string }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true">
      <button aria-label="Close" className="absolute inset-0 bg-navy-900/40 backdrop-blur-[2px] animate-fade-in" onClick={onClose} />
      <div className={cx('relative h-full w-full bg-white shadow-pop flex flex-col animate-[fade-up_0.25s_ease-out]', width)}>
        <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-4">
          <div className="min-w-0 flex-1">{title}</div>
          <button onClick={onClose} className="grid size-8 place-items-center rounded-md text-ink-muted hover:bg-navy-50" aria-label="Close panel">
            <X className="size-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
      </div>
    </div>
  );
}

// ───────────────────────────── Tabs ──────────────────────────────────────────

export function Tabs<T extends string>({ tabs, value, onChange }: { tabs: { id: T; label: string; count?: number }[]; value: T; onChange: (v: T) => void }) {
  return (
    <div className="flex gap-1 border-b border-line overflow-x-auto" role="tablist">
      {tabs.map((t) => (
        <button
          key={t.id}
          role="tab"
          aria-selected={value === t.id}
          onClick={() => onChange(t.id)}
          className={cx(
            'relative px-3.5 py-2.5 text-[13px] font-medium whitespace-nowrap transition-colors',
            value === t.id ? 'text-navy-800' : 'text-ink-muted hover:text-ink',
          )}
        >
          {t.label}
          {t.count !== undefined && <span className={cx('ml-1.5 rounded-full px-1.5 py-px text-[10px] font-semibold', value === t.id ? 'bg-navy-800 text-white' : 'bg-slate-100 text-slate-600')}>{t.count}</span>}
          {value === t.id && <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-navy-800" />}
        </button>
      ))}
    </div>
  );
}

// ───────────────────────────── Disclaimer ────────────────────────────────────

export function DisclaimerBar({ text }: { text: string }) {
  return (
    <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-[12px] text-amber-900 flex gap-2">
      <AlertTriangle className="size-3.5 mt-0.5 shrink-0" />
      <span>{text}</span>
    </p>
  );
}
