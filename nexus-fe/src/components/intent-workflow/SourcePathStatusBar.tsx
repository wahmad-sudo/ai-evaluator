"use client";

const ALL_PATHS = [
  "Lead Service",
  "Harvester Service",
  "Google Places",
  "Email Collector",
  "Audit Service",
  "CoreAI / OpenAI",
  "RingCentral",
];

interface Props {
  activePaths?: string[];
}

export function SourcePathStatusBar({ activePaths = [] }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {ALL_PATHS.map((path) => {
        const active = activePaths.includes(path);
        return (
          <div
            key={path}
            className={`flex items-center gap-1.5 text-xs px-2 py-1 rounded border ${
              active
                ? "border-blue-700 bg-blue-950/40 text-blue-300"
                : "border-zinc-800 bg-zinc-900 text-zinc-600"
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${active ? "bg-blue-400" : "bg-zinc-700"}`} />
            {path}
          </div>
        );
      })}
    </div>
  );
}
