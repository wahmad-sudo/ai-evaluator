"use client";
import type { MatchedObject, MagicScriptOutput, ManualOverride } from "@/lib/intent-workflow/types";
import { OsirisRatingPanel } from "./OsirisRatingPanel";
import { QualificationScorePanel } from "./QualificationScorePanel";
import { MagicScriptingPanel } from "./MagicScriptingPanel";

interface Props {
  match: MatchedObject;
  script: MagicScriptOutput | null;
  scriptLoading?: boolean;
  onClose: () => void;
  onRegenerate?: (override?: ManualOverride) => void;
}

export function MatchDetailDrawer({ match, script, scriptLoading, onClose, onRegenerate }: Props) {
  return (
    <div className="fixed inset-y-0 right-0 w-[420px] bg-zinc-950 border-l border-zinc-800 shadow-2xl flex flex-col z-50">
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
        <h3 className="text-sm font-semibold text-zinc-200">{match.name ?? "Match Detail"}</h3>
        <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300 text-xl leading-none">×</button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <div className="space-y-2 text-xs text-zinc-400">
          {[
            { label: "Type", value: match.match_type ?? match.source_type },
            { label: "Company", value: match.company },
            { label: "Location", value: match.location },
            { label: "Website", value: match.website },
            { label: "Source URL", value: match.source_url },
            { label: "Intent", value: match.intent },
          ].map(({ label, value }) => value && (
            <div key={label} className="flex gap-2">
              <span className="w-20 shrink-0 text-zinc-600">{label}</span>
              <span className="text-zinc-300 break-all">{value}</span>
            </div>
          ))}
        </div>

        <OsirisRatingPanel match={match} />
        <QualificationScorePanel match={match} />
        <MagicScriptingPanel script={script} loading={scriptLoading} onRegenerate={onRegenerate} />
      </div>
    </div>
  );
}
