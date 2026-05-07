"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import type { WorkflowTimelineStep, WorkflowStatus } from "@/lib/intent-workflow/types";
import { getSniperTimeline } from "@/lib/intent-workflow/api";

export function useWorkflowTimeline(runId: number | null, runStatus: WorkflowStatus) {
  const [timeline, setTimeline] = useState<WorkflowTimelineStep[]>([]);
  const [isPolling, setIsPolling] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchTimeline = useCallback(async () => {
    if (!runId) return;
    try {
      const steps = await getSniperTimeline(runId);
      setTimeline(steps);
    } catch {
      // silent
    }
  }, [runId]);

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsPolling(false);
  }, []);

  useEffect(() => {
    if (!runId) return;

    if (runStatus === "running" || runStatus === "pending") {
      setIsPolling(true);
      fetchTimeline();
      intervalRef.current = setInterval(fetchTimeline, 2500);
    } else {
      stopPolling();
      fetchTimeline();
    }

    return stopPolling;
  }, [runId, runStatus, fetchTimeline, stopPolling]);

  return { timeline, isPolling, refetch: fetchTimeline };
}
