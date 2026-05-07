"use client";
import { useState, useEffect } from "react";
import type { SourceObject, TargetObjectType, ManualOverride } from "@/lib/intent-workflow/types";
import { useUniversalIntentWorkflow } from "@/hooks/useUniversalIntentWorkflow";
import { UniversalIntentWorkflowHeader } from "./UniversalIntentWorkflowHeader";
import { SourceObjectSummary } from "./SourceObjectSummary";
import { UniversalMatchFlow } from "./UniversalMatchFlow";
import { FulfillmentTimeline } from "./FulfillmentTimeline";
import { MatchedTargetsTable } from "./MatchedTargetsTable";
import { MatchDetailDrawer } from "./MatchDetailDrawer";
import { WorkflowActionsBar } from "./WorkflowActionsBar";
import { SourcePathStatusBar } from "./SourcePathStatusBar";

interface Props {
  open: boolean;
  source: SourceObject;
  onClose: () => void;
}

const DEFAULT_PATHS = ["Lead Service", "Harvester Service", "Google Places", "Email Collector", "Audit Service"];

export function UniversalIntentWorkflowModal({ open, source, onClose }: Props) {
  const [targetType, setTargetType] = useState<TargetObjectType>("any");
  const [geo, setGeo] = useState(source.location ?? "");
  const [timeframe, setTimeframe] = useState("30d");
  const [intentMode, setIntentMode] = useState("auto");
  const [drawerOpen, setDrawerOpen] = useState(false);

  const {
    run, status, timeline, results, selectedMatch, script, scriptLoading,
    actionLoading, isPolling, error,
    setSelectedMatch, startRun, rerun, generateScript, executeAction,
  } = useUniversalIntentWorkflow();

  useEffect(() => {
    if (!open) return;
    setGeo((source.location as string | undefined) ?? "");
  }, [open, source]);

  const handleRun = () => {
    startRun(source, targetType, { geo, mockMode: false });
  };

  const handleRerun = () => {
    rerun(targetType);
  };

  const handleSelectMatch = (match: typeof results[0]) => {
    setSelectedMatch(match);
    setDrawerOpen(true);
    generateScript(match.match_uuid);
  };

  const handleRegenerate = (override?: ManualOverride) => {
    if (!selectedMatch) return;
    generateScript(selectedMatch.match_uuid, override);
  };

  const handleAction = (type: string, matchId?: number) => {
    executeAction(type, matchId);
  };

  const isRunning = status === "running" || status === "pending";

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 m-auto w-full max-w-6xl max-h-[92vh] bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl flex flex-col overflow-hidden">
        <div className="p-4 shrink-0">
          <UniversalIntentWorkflowHeader
            source={source}
            targetType={targetType}
            geo={geo}
            timeframe={timeframe}
            intentMode={intentMode}
            status={status}
            isRunning={isRunning}
            onTargetChange={setTargetType}
            onGeoChange={setGeo}
            onTimeframeChange={setTimeframe}
            onIntentModeChange={setIntentMode}
            onRun={handleRun}
            onRerun={handleRerun}
            onClose={onClose}
          />
        </div>

        {error && (
          <div className="px-4 py-2 bg-red-950/40 border-b border-red-900 text-red-400 text-xs shrink-0">
            {error}
          </div>
        )}

        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-6">
            <UniversalMatchFlow status={status} currentStep={run?.current_step} />

            <div className="grid grid-cols-[280px_1fr] gap-4">
              <div className="space-y-6">
                <SourceObjectSummary source={source} />
                <SourcePathStatusBar activePaths={DEFAULT_PATHS} />
              </div>

              <div>
                <FulfillmentTimeline steps={timeline} isPolling={isPolling} />
              </div>
            </div>

            {results.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Matched Results ({results.length})
                </h3>
                <MatchedTargetsTable
                  matches={results}
                  selected={selectedMatch}
                  onSelect={handleSelectMatch}
                />
              </div>
            )}

            {run && (
              <div className="space-y-2">
                <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Actions</h3>
                <WorkflowActionsBar
                  run={run}
                  selectedMatch={selectedMatch}
                  onAction={handleAction}
                  loading={actionLoading}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {drawerOpen && selectedMatch && (
        <MatchDetailDrawer
          match={selectedMatch}
          script={script ?? null}
          scriptLoading={scriptLoading}
          onClose={() => setDrawerOpen(false)}
          onRegenerate={handleRegenerate}
        />
      )}
    </div>
  );
}
