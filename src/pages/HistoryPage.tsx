import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { Clock3, Cloud, HardDrive, Trash2 } from 'lucide-react';
import type { HistoryEntry } from '@/engine/types';
import { historyStore } from '@/services/history';
import { PageHeader } from '@/components/PageHeader';
import { Badge, Button, CardSkeleton, EmptyState } from '@/components/ui';
import { formatDate } from '@/components/analysis/labels';

export function HistoryPage() {
  const [entries, setEntries] = useState<HistoryEntry[] | null>(null);
  const [persisted, setPersisted] = useState(false);

  const load = () =>
    historyStore.listMerged().then((r) => {
      setEntries(r.entries);
      setPersisted(r.persisted);
    });
  useEffect(() => {
    void load();
  }, []);

  const remove = (id: string) => {
    historyStore.remove(id);
    setEntries((e) => e?.filter((x) => x.id !== id) ?? null);
  };

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="History"
        title="Search History"
        description="Previous analyses with their top standard and gap count. Reopen any analysis to review recommendations, the graph or the generated specification."
        actions={
          <>
            <Badge tone={persisted ? 'emerald' : 'slate'}>{persisted ? <Cloud className="size-3" /> : <HardDrive className="size-3" />} {persisted ? 'Synced with Supabase' : 'Stored in this browser'}</Badge>
            {entries?.length ? (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  if (confirm('Clear local search history?')) {
                    historyStore.clear();
                    void load();
                  }
                }}
              >
                <Trash2 className="size-3.5" /> Clear local
              </Button>
            ) : null}
          </>
        }
      />
      {!entries && <CardSkeleton lines={4} />}
      {entries && !entries.length && <EmptyState icon={<Clock3 className="size-5" />} title="No searches yet" description="Analyses you run will appear here." action={<Link to="/analyze"><Button>Analyze a specification</Button></Link>} />}
      {entries && entries.length > 0 && (
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[760px] text-[13px]">
            <thead className="bg-surface text-left">
              <tr className="[&>th]:px-4 [&>th]:py-2.5 [&>th]:label-caps">
                <th>Query</th>
                <th>Date / time</th>
                <th>Recommendations</th>
                <th>Top standard</th>
                <th>Gaps</th>
                <th>Mode</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((e) => (
                <tr key={e.id} className="border-t border-line align-middle [&>td]:px-4 [&>td]:py-3 hover:bg-surface/70">
                  <td className="max-w-sm">
                    <Link to={`/results/${e.id}`} className="line-clamp-2 font-medium hover:text-navy-700">
                      {e.query}
                    </Link>
                    <div className="mt-0.5 flex gap-1.5">
                      <Badge tone="slate">{e.source}</Badge>
                      <Badge tone="slate">{e.language}</Badge>
                    </div>
                  </td>
                  <td className="whitespace-nowrap text-ink-muted">{formatDate(e.createdAt)}</td>
                  <td className="font-mono">{e.recommendationCount}</td>
                  <td className="font-mono">{e.topStandard ?? '—'}</td>
                  <td>
                    <Badge tone={e.gapCount ? 'amber' : 'emerald'}>{e.gapCount}</Badge>
                  </td>
                  <td>
                    <Badge tone={e.mode === 'live' ? 'emerald' : 'amber'}>{e.mode}</Badge>
                  </td>
                  <td className="text-right whitespace-nowrap">
                    <Link to={`/results/${e.id}`} className="mr-2 text-[12.5px] font-medium text-navy-700 hover:underline">
                      Reopen
                    </Link>
                    <button onClick={() => remove(e.id)} className="text-[12.5px] text-ink-muted hover:text-rose-600" aria-label="Delete entry">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
