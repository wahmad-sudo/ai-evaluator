"use client";
import type { SourceObject } from "@/lib/intent-workflow/types";

interface Props {
  source: SourceObject;
}

export function SourceObjectSummary({ source }: Props) {
  const name = source.name ?? (source.company_name as string | undefined) ?? "Unknown";
  const signals = (source.signals ?? []) as string[];
  const tags = (source.tags ?? []) as string[];

  const rows: { label: string; value: string | undefined }[] = [
    { label: "Type", value: source.object_type },
    { label: "Name", value: name },
    { label: "Location", value: source.location },
    { label: "Website", value: source.website },
    { label: "Source URL", value: source.source_url },
    { label: "Confidence", value: source.source_confidence ? `${source.source_confidence}%` : undefined },
  ];

  return (
    <div className="space-y-3">
      <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Source Object</span>

      <dl className="space-y-1">
        {rows.map(({ label, value }) => value && (
          <div key={label} className="flex gap-2 text-xs">
            <dt className="text-zinc-500 w-20 shrink-0">{label}</dt>
            <dd className="text-zinc-200 break-all">{value}</dd>
          </div>
        ))}
      </dl>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {tags.map((t) => (
            <span key={t} className="text-xs bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded">{t}</span>
          ))}
        </div>
      )}

      {signals.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {signals.map((s) => (
            <span key={s} className="text-xs bg-blue-900/50 text-blue-300 px-1.5 py-0.5 rounded">{s}</span>
          ))}
        </div>
      )}
    </div>
  );
}
