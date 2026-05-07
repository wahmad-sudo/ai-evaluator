"use client";
import { useState, useCallback } from "react";
import type { MagicScriptOutput, ManualOverride } from "@/lib/intent-workflow/types";
import { regenerateSniperScript } from "@/lib/intent-workflow/api";

export function useMagicScripting(runId: number | null) {
  const [script, setScript] = useState<MagicScriptOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(
    async (matchId: string, override?: ManualOverride) => {
      if (!runId) return;
      setLoading(true);
      setError(null);
      try {
        const result = await regenerateSniperScript(runId, matchId, override);
        setScript(result);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Script generation failed");
      } finally {
        setLoading(false);
      }
    },
    [runId]
  );

  return { script, loading, error, generate, setScript };
}
