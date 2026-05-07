"use client";
import { useState } from "react";
import type { MagicScriptOutput, ManualOverride } from "@/lib/intent-workflow/types";

interface Props {
  script: MagicScriptOutput | null;
  loading?: boolean;
  onRegenerate?: (override?: ManualOverride) => void;
}

const SCRIPT_TABS = [
  { key: "hook", label: "Hook" },
  { key: "pain_summary", label: "Pain" },
  { key: "email_script", label: "Email" },
  { key: "linkedin_script", label: "LinkedIn" },
  { key: "call_script", label: "Call Script" },
  { key: "ringcentral_call_opener", label: "RC Opener" },
  { key: "cta", label: "CTA" },
  { key: "follow_up", label: "Follow-Up" },
] as const;

type ScriptTab = (typeof SCRIPT_TABS)[number]["key"];

export function MagicScriptingPanel({ script, loading, onRegenerate }: Props) {
  const [activeTab, setActiveTab] = useState<ScriptTab>("hook");
  const [tone, setTone] = useState("professional");
  const [painFocus, setPainFocus] = useState("");
  const [customHook, setCustomHook] = useState("");

  const handleRegenerate = () => {
    onRegenerate?.({ tone, pain_focus: painFocus || undefined, custom_hook: customHook || undefined });
  };

  const content = script?.[activeTab];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Magic Scripting</span>
        {script?.mock && (
          <span className="text-xs bg-yellow-900/50 text-yellow-400 px-2 py-0.5 rounded">Template Mode</span>
        )}
      </div>

      {onRegenerate && (
        <div className="flex gap-2 flex-wrap">
          <select
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            className="text-xs bg-zinc-800 border border-zinc-700 text-zinc-300 rounded px-2 py-1"
          >
            {["professional", "casual", "urgent", "consultative"].map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <input
            placeholder="Pain focus..."
            value={painFocus}
            onChange={(e) => setPainFocus(e.target.value)}
            className="text-xs bg-zinc-800 border border-zinc-700 text-zinc-300 rounded px-2 py-1 flex-1 min-w-[120px]"
          />
          <button
            onClick={handleRegenerate}
            disabled={loading}
            className="text-xs bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-3 py-1 rounded"
          >
            {loading ? "..." : "Regenerate"}
          </button>
        </div>
      )}

      {!script ? (
        <div className="text-center py-6 text-zinc-500 text-sm">
          {loading ? "Generating script..." : "Select a match to view scripts."}
        </div>
      ) : (
        <>
          <div className="flex gap-1 flex-wrap border-b border-zinc-800 pb-2">
            {SCRIPT_TABS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`text-xs px-2 py-1 rounded ${activeTab === key ? "bg-blue-600 text-white" : "text-zinc-400 hover:text-zinc-200"}`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="relative">
            <pre className="text-xs text-zinc-300 whitespace-pre-wrap bg-zinc-900 rounded-lg p-3 max-h-48 overflow-y-auto">
              {content || "—"}
            </pre>
            {content && (
              <button
                onClick={() => navigator.clipboard.writeText(content)}
                className="absolute top-2 right-2 text-xs text-zinc-500 hover:text-zinc-300"
              >
                Copy
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
