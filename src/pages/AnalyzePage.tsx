import { Languages, ListChecks, Ruler, ShieldAlert } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { SearchHero } from '@/components/analysis/SearchHero';
import { Card } from '@/components/ui';

export function AnalyzePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Analyze"
        title="Analyze a specification"
        description="Enter a natural-language description or paste technical specifications / tender clauses. The engine extracts requirements, retrieves standards semantically, expands relationships and flags gaps."
      />
      <SearchHero />
      <div className="grid gap-4 md:grid-cols-3">
        <Tip icon={<Ruler className="size-4" />} title="Include ratings and conditions" text="Wattage, voltage, IP/IK, material, grade, environment and quantity improve requirement coverage and confidence." />
        <Tip icon={<ListChecks className="size-4" />} title="Paste existing clauses" text="If your draft already cites standards (e.g. “as per IS 694:1990”), the outdated-reference detector compares editions with the index." />
        <Tip icon={<Languages className="size-4" />} title="Hindi and Hinglish work too" text="Queries are normalised to English concepts for retrieval while the original wording is preserved in the report." />
      </div>
      <Card className="flex items-start gap-3 p-4 text-[12.5px] text-ink-muted">
        <ShieldAlert className="mt-0.5 size-4 shrink-0 text-amber-600" />
        <span>IS Copilot is an AI assistance system, not a legal or regulatory authority. Recommendations are based on indexed metadata and must be verified against the authoritative BIS sources before procurement use.</span>
      </Card>
    </div>
  );
}

function Tip({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 text-[13px] font-semibold">
        <span className="grid size-7 place-items-center rounded-md bg-navy-50 text-navy-700">{icon}</span> {title}
      </div>
      <p className="mt-1.5 text-[12.5px] text-ink-muted">{text}</p>
    </Card>
  );
}
