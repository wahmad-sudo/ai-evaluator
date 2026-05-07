"use client";

interface QueryPlan {
  google_places_queries?: string[];
  google_dorks?: string[];
  company_site_queries?: string[];
  linkedin_queries?: string[];
  exclusions?: string[];
}

interface Props {
  queryPlan?: QueryPlan | null;
  nexusPaths?: string[];
}

export function IntentSniperPanel({ queryPlan, nexusPaths }: Props) {
  if (!queryPlan) {
    return <div className="text-xs text-zinc-500">Intent queries not yet generated.</div>;
  }

  const sections: { label: string; items: string[] | undefined }[] = [
    { label: "Google Places Queries", items: queryPlan.google_places_queries },
    { label: "Google Dorks", items: queryPlan.google_dorks },
    { label: "LinkedIn Queries", items: queryPlan.linkedin_queries },
    { label: "Exclusions", items: queryPlan.exclusions },
  ];

  return (
    <div className="space-y-3">
      <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Intent Sniper</span>

      {nexusPaths && nexusPaths.length > 0 && (
        <div>
          <p className="text-xs text-zinc-500 mb-1">Active NEXUS Paths</p>
          <div className="flex flex-wrap gap-1">
            {nexusPaths.map((p) => (
              <span key={p} className="text-xs bg-blue-900/50 text-blue-300 px-1.5 py-0.5 rounded">{p}</span>
            ))}
          </div>
        </div>
      )}

      {sections.map(({ label, items }) =>
        items && items.length > 0 ? (
          <div key={label}>
            <p className="text-xs text-zinc-500 mb-1">{label}</p>
            <ul className="space-y-0.5">
              {items.map((item, i) => (
                <li key={i} className="text-xs text-zinc-300 bg-zinc-900 rounded px-2 py-1 font-mono truncate">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ) : null
      )}
    </div>
  );
}
