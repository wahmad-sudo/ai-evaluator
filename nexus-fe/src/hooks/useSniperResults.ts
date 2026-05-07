"use client";
import { useState, useCallback } from "react";
import type { MatchedObject } from "@/lib/intent-workflow/types";
import { getSniperResults } from "@/lib/intent-workflow/api";

export function useSniperResults(runId: number | null) {
  const [results, setResults] = useState<MatchedObject[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchResults = useCallback(async () => {
    if (!runId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getSniperResults(runId);
      setResults(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load results");
    } finally {
      setLoading(false);
    }
  }, [runId]);

  return { results, loading, error, fetchResults };
}
