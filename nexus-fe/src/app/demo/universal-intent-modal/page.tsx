"use client";
import { useState } from "react";
import { UniversalIntentWorkflowModal } from "@/components/intent-workflow";
import type { SourceObject } from "@/lib/intent-workflow/types";
import { MOCK_OBJECTS } from "@/lib/intent-workflow/mockObjects";

const DEMO_BUTTONS: { label: string; key: keyof typeof MOCK_OBJECTS; description: string }[] = [
  { label: "Open with Existing Nexus Lead", key: "lead", description: "Commercial property with fiber signals" },
  { label: "Open with Business Object", key: "business", description: "Tech company in Austin, TX" },
  { label: "Open with Job Object", key: "job", description: "Senior Software Engineer posting" },
  { label: "Open with Candidate Object", key: "candidate", description: "Full stack developer profile" },
  { label: "Open with Student Object", key: "student", description: "CS student at Texas A&M" },
  { label: "Open with College Object", key: "college", description: "Rice University" },
  { label: "Open with Consumer Request", key: "consumer_request", description: "Residential ISP switch request" },
];

export default function UniversalIntentModalDemoPage() {
  const [open, setOpen] = useState(false);
  const [source, setSource] = useState<SourceObject | null>(null);

  const openWith = (key: keyof typeof MOCK_OBJECTS) => {
    setSource(MOCK_OBJECTS[key]);
    setOpen(true);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-1">Universal Intent Sniper Modal</h1>
          <p className="text-zinc-400 text-sm">
            Launch the NEXUS Sniper from any source object type. Each run normalizes the object,
            extracts signals, queries NEXUS services, and returns scored matches with Osiris rating,
            BANT qualification, and magic scripts.
          </p>
        </div>

        <div className="grid gap-3">
          {DEMO_BUTTONS.map(({ label, key, description }) => (
            <button
              key={key}
              onClick={() => openWith(key)}
              className="flex items-center justify-between w-full px-4 py-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 rounded-lg transition-all text-left group"
            >
              <div>
                <div className="text-sm font-medium text-zinc-200 group-hover:text-white">{label}</div>
                <div className="text-xs text-zinc-500 mt-0.5">{description}</div>
              </div>
              <span className="text-xs bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded uppercase tracking-wide shrink-0 ml-3">
                {key}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-8 p-4 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-zinc-500 space-y-1">
          <p className="text-zinc-400 font-medium">API Configuration</p>
          <p>Backend: <code className="text-blue-400">NEXT_PUBLIC_API_BASE_URL</code> → <code>https://nexus-api.cai-sol.com</code></p>
          <p>Mock mode is enabled by default. Set <code className="text-blue-400">COREAI_API_KEY</code> on the backend for live AI scripting.</p>
        </div>
      </div>

      {source && (
        <UniversalIntentWorkflowModal
          open={open}
          source={source}
          onClose={() => { setOpen(false); setSource(null); }}
        />
      )}
    </div>
  );
}
