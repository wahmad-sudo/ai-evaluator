"use client";
import { useState } from "react";
import type { ManualOverride } from "@/lib/intent-workflow/types";

interface Props {
  onApply: (override: ManualOverride) => void;
}

export function ManualOverridePanel({ onApply }: Props) {
  const [tone, setTone] = useState("professional");
  const [persona, setPersona] = useState("");
  const [painFocus, setPainFocus] = useState("");
  const [customHook, setCustomHook] = useState("");

  return (
    <div className="space-y-3">
      <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Manual Override</span>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs text-zinc-500 block mb-1">Tone</label>
          <select
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            className="w-full text-xs bg-zinc-800 border border-zinc-700 text-zinc-300 rounded px-2 py-1"
          >
            {["professional", "casual", "urgent", "consultative"].map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs text-zinc-500 block mb-1">Persona</label>
          <input
            value={persona}
            onChange={(e) => setPersona(e.target.value)}
            placeholder="e.g. IT Director"
            className="w-full text-xs bg-zinc-800 border border-zinc-700 text-zinc-300 rounded px-2 py-1"
          />
        </div>
        <div>
          <label className="text-xs text-zinc-500 block mb-1">Pain Focus</label>
          <input
            value={painFocus}
            onChange={(e) => setPainFocus(e.target.value)}
            placeholder="e.g. bandwidth costs"
            className="w-full text-xs bg-zinc-800 border border-zinc-700 text-zinc-300 rounded px-2 py-1"
          />
        </div>
        <div>
          <label className="text-xs text-zinc-500 block mb-1">Custom Hook</label>
          <input
            value={customHook}
            onChange={(e) => setCustomHook(e.target.value)}
            placeholder="Override first line"
            className="w-full text-xs bg-zinc-800 border border-zinc-700 text-zinc-300 rounded px-2 py-1"
          />
        </div>
      </div>
      <button
        onClick={() => onApply({ tone, persona: persona || undefined, pain_focus: painFocus || undefined, custom_hook: customHook || undefined })}
        className="text-xs bg-zinc-700 hover:bg-zinc-600 text-white px-3 py-1.5 rounded"
      >
        Apply Override
      </button>
    </div>
  );
}
