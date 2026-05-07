"use client";

interface TargetingPlan {
  target_type?: string;
  recommended_target?: string;
  buyer_persona?: string;
  icp_summary?: string;
  authority_clues?: string[];
  contact_path?: string;
  best_targeting_route?: string;
  targeting_confidence?: number;
  nexus_paths_activated?: string[];
}

interface Props {
  plan?: TargetingPlan | null;
}

export function TargetingSniperPanel({ plan }: Props) {
  if (!plan) {
    return <div className="text-xs text-zinc-500">Targeting plan not yet generated.</div>;
  }

  const rows = [
    { label: "Target Type", value: plan.target_type },
    { label: "Buyer Persona", value: plan.buyer_persona },
    { label: "ICP Summary", value: plan.icp_summary },
    { label: "Contact Path", value: plan.contact_path },
    { label: "Targeting Route", value: plan.best_targeting_route },
    { label: "Confidence", value: plan.targeting_confidence ? `${plan.targeting_confidence}%` : undefined },
  ];

  return (
    <div className="space-y-3">
      <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Targeting Sniper</span>

      <dl className="space-y-1.5">
        {rows.map(({ label, value }) => value && (
          <div key={label} className="flex gap-2 text-xs">
            <dt className="text-zinc-500 w-28 shrink-0">{label}</dt>
            <dd className="text-zinc-200">{value}</dd>
          </div>
        ))}
      </dl>

      {(plan.authority_clues ?? []).length > 0 && (
        <div>
          <p className="text-xs text-zinc-500 mb-1">Authority Clues</p>
          <div className="flex flex-wrap gap-1">
            {plan.authority_clues!.map((c) => (
              <span key={c} className="text-xs bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded">{c}</span>
            ))}
          </div>
        </div>
      )}

      {(plan.nexus_paths_activated ?? []).length > 0 && (
        <div>
          <p className="text-xs text-zinc-500 mb-1">NEXUS Paths</p>
          <div className="flex flex-wrap gap-1">
            {plan.nexus_paths_activated!.map((p) => (
              <span key={p} className="text-xs bg-blue-900/50 text-blue-300 px-1.5 py-0.5 rounded">{p}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
