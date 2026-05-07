"use client";
import { useState, useCallback, useEffect, useRef } from "react";
import type {
  SourceObject,
  TargetObjectType,
  SniperRunResponse,
  MatchedObject,
  WorkflowStatus,
} from "@/lib/intent-workflow/types";
import {
  createSniperRun,
  getSniperRun,
  getSniperResults,
  rerunSniper,
} from "@/lib/intent-workflow/api";
import { useWorkflowTimeline } from "./useWorkflowTimeline";
import { useSniperResults } from "./useSniperResults";
import { useMagicScripting } from "./useMagicScripting";
import { useWorkflowActions } from "./useWorkflowActions";

export function useUniversalIntentWorkflow() {
  const [run, setRun] = useState<SniperRunResponse | null>(null);
  const [status, setStatus] = useState<WorkflowStatus>("idle");
  const [selectedMatch, setSelectedMatch] = useState<MatchedObject | null>(null);
  const [error, setError] = useState<string | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { timeline, isPolling } = useWorkflowTimeline(run?.id ?? null, status);
  const { results, fetchResults } = useSniperResults(run?.id ?? null);
  const { script, loading: scriptLoading, generate: generateScript } = useMagicScripting(run?.id ?? null);
  const { execute: executeAction, loading: actionLoading } = useWorkflowActions(run?.id ?? null);

  useEffect(() => {
    if (results.length > 0 && !selectedMatch) setSelectedMatch(results[0]);
  }, [results, selectedMatch]);

  // Clean up poll on unmount
  useEffect(() => () => { if (pollRef.current) clearInterval(pollRef.current); }, []);

  const startRun = useCallback(
    async (
      sourceObject: SourceObject,
      targetType: TargetObjectType = "any",
      opts: { geo?: string; mockMode?: boolean } = {}
    ) => {
      if (pollRef.current) clearInterval(pollRef.current);
      setError(null);
      setStatus("pending");
      setRun(null);
      setSelectedMatch(null);

      try {
        const created = await createSniperRun({
          source_object_type: sourceObject.object_type,
          source_name:
            (sourceObject.name as string | undefined) ??
            (sourceObject.company_name as string | undefined),
          source_payload: sourceObject as Record<string, unknown>,
          target_object_type: targetType,
          geo: opts.geo,
          mock_mode: opts.mockMode ?? false,
        });
        setRun(created);
        setStatus(created.status as WorkflowStatus);

        pollRef.current = setInterval(async () => {
          try {
            const fresh = await getSniperRun(created.id);
            setRun(fresh);
            if (fresh.status === "completed" || fresh.status === "failed") {
              clearInterval(pollRef.current!);
              pollRef.current = null;
              setStatus(fresh.status as WorkflowStatus);
              if (fresh.status === "completed") {
                const matches = await getSniperResults(fresh.id);
                if (matches.length > 0) setSelectedMatch(matches[0]);
                fetchResults();
              }
            }
          } catch {
            clearInterval(pollRef.current!);
            pollRef.current = null;
          }
        }, 2000);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to start sniper run");
        setStatus("failed");
      }
    },
    [fetchResults]
  );

  const rerun = useCallback(
    async (targetType?: TargetObjectType) => {
      if (!run?.id) return;
      setStatus("pending");
      try {
        const newRun = await rerunSniper(run.id, { target_object_type: targetType });
        setRun(newRun);
        setStatus(newRun.status as WorkflowStatus);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Rerun failed");
        setStatus("failed");
      }
    },
    [run?.id]
  );

  return {
    run, status, timeline, results, selectedMatch, script,
    scriptLoading, actionLoading, isPolling, error,
    setSelectedMatch, startRun, rerun, generateScript, executeAction,
  };
}
