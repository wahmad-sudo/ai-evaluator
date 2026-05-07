"use client";
import { useState, useCallback } from "react";
import type { WorkflowActionResponse } from "@/lib/intent-workflow/types";
import { executeSniperAction } from "@/lib/intent-workflow/api";

export function useWorkflowActions(runId: number | null) {
  const [loading, setLoading] = useState(false);
  const [lastResult, setLastResult] = useState<WorkflowActionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(
    async (actionType: string, matchId?: number, payload?: Record<string, unknown>) => {
      if (!runId) return;
      setLoading(true);
      setError(null);
      try {
        const result = await executeSniperAction(runId, {
          action_type: actionType,
          match_id: matchId,
          payload,
        });
        setLastResult(result);
        return result;
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Action failed";
        setError(msg);
      } finally {
        setLoading(false);
      }
    },
    [runId]
  );

  return { execute, loading, lastResult, error };
}
