import type { Requirement } from '@/engine/types';
import { Badge } from '@/components/ui';
import { REQ_CATEGORY_TONE } from './labels';

export function RequirementChips({ requirements, limit }: { requirements: Requirement[]; limit?: number }) {
  const list = limit ? requirements.slice(0, limit) : requirements;
  if (!list.length) return <p className="text-[13px] text-ink-muted">No structured requirements were extracted.</p>;
  return (
    <div className="flex flex-wrap gap-1.5">
      {list.map((r) => (
        <Badge key={r.id} tone={REQ_CATEGORY_TONE[r.category]} className="normal-case font-medium" title={`${r.category} · confidence ${Math.round(r.confidence * 100)}%${r.sourceSpan ? ` · from "${r.sourceSpan}"` : ''}`}>
          <span className="opacity-60">{r.category}</span>
          <span>·</span>
          <span>{r.text.replace(/^[A-Z][a-z]+: /, '')}</span>
        </Badge>
      ))}
      {limit && requirements.length > limit && <Badge tone="slate">+{requirements.length - limit} more</Badge>}
    </div>
  );
}
