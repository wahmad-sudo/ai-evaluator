"use client";
import { useState, useCallback } from "react";
import type { OsirisDetail, MatchedObject } from "@/lib/intent-workflow/types";

export function useOsirisRating() {
  const [osiris, setOsiris] = useState<OsirisDetail | null>(null);

  const loadFromMatch = useCallback((match: MatchedObject) => {
    setOsiris({
      entity_match: 0,
      intent_relevance: 0,
      source_trust: 0,
      evidence_strength: 0,
      freshness: 0,
      contact_path: 0,
      duplicate_risk: 0,
      persona_fit: 0,
      overall_rating: match.osiris_rating,
      verdict: match.osiris_verdict ?? "OSIRIS_REJECT",
    });
  }, []);

  return { osiris, setOsiris, loadFromMatch };
}
