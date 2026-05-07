"use client";
import type { SourceObject, TargetObjectType, WorkflowStatus } from "@/lib/intent-workflow/types";
import { TargetObjectSelector } from "./TargetObjectSelector";
import { workflowStatusLabel } from "@/lib/intent-workflow/status";
import { clsx } from "clsx";

interface Props {
  source: SourceObject;
  targetType: TargetObjectType;
  geo: string;
  timeframe: string;
  intentMode: string;
  status: WorkflowStatus;
  isRunning: boolean;
  onTargetChange: (v: TargetObjectType) => void;
  onGeoChange: (v: string) => void;
  onTimeframeChange: (v: string) => void;
  onIntentModeChange: (v: string) => void;
  onRun: () => void;
  onRerun: () => void;
  onClose: () => void;
}

export function UniversalIntentWorkflowHeader({
  source, targetType, geo, timeframe, intentMode, status, isRunning,
  onTargetChange, onGeoChange, onTimeframeChange, onIntentModeChange,
  onRun, onRerun, onClose,
}: Props) {
  const name = source.name ?? (source.company_name as string | undefined) ?? "Unknown";
  const hasRun = status !== "idle";

  return (
    <div className="flex flex-col gap-3 border-b border-zinc-800 pb-4">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-semibold text-zinc-100">Universal Intent Sniper</h2>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded uppercase tracking-wide">
              {source.object_type}
            </span>
            <span className="text-sm text-zinc-300 font-medium">{name}</span>
            <StatusPill status={status} />
          </div>
        </div>
        <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300 text-xl leading-none">×</button>
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        <TargetObjectSelector value={targetType} onChange={onTargetChange} disabled={isRunning} />

        <input
          placeholder="Geo (city, state)"
          value={geo}
          onChange={(e) => onGeoChange(e.target.value)}
          disabled={isRunning}
          className="text-sm bg-zinc-800 border border-zinc-700 text-zinc-200 rounded px-3 py-1.5 w-40 disabled:opacity-50"
        />

        <select
          value={timeframe}
          onChange={(e) => onTimeframeChange(e.target.value)}
          disabled={isRunning}
          className="bg-zinc-800 border border-zinc-700 text-zinc-200 text-sm rounded px-3 py-1.5 disabled:opacity-50"
        >
          {["7d","14d","30d","60d","90d"].map((t) => <option key={t} value={t}>{t}</option>)}
        </select>

        <select
          value={intentMode}
          onChange={(e) => onIntentModeChange(e.target.value)}
          disabled={isRunning}
          className="bg-zinc-800 border border-zinc-700 text-zinc-200 text-sm rounded px-3 py-1.5 disabled:opacity-50"
        >
          {["auto","fiber","sales","hiring","vendor","consumer"].map((m) => <option key={m} value={m}>{m}</option>)}
        </select>

        {!hasRun && (
          <button
            onClick={onRun}
            disabled={isRunning}
            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-medium px-4 py-1.5 rounded"
          >
            Run Sniper
          </button>
        )}
        {hasRun && (
          <button
            onClick={onRerun}
            disabled={isRunning}
            className="bg-zinc-700 hover:bg-zinc-600 disabled:opacity-50 text-white text-sm px-4 py-1.5 rounded"
          >
            Rerun
          </button>
        )}
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: WorkflowStatus }) {
  return (
    <span className={clsx(
      "text-xs px-2 py-0.5 rounded-full font-medium",
      status === "completed" ? "bg-emerald-900 text-emerald-300" :
      status === "running" || status === "pending" ? "bg-blue-900 text-blue-300" :
      status === "failed" ? "bg-red-900 text-red-300" :
      "bg-zinc-800 text-zinc-500"
    )}>
      {workflowStatusLabel(status)}
    </span>
  );
}
