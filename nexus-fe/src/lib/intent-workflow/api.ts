import type {
  CreateSniperRunRequest,
  SniperRunResponse,
  WorkflowTimelineStep,
  MatchedObject,
  MagicScriptOutput,
  ManualOverride,
  WorkflowActionRequest,
  WorkflowActionResponse,
  RerunSniperRequest,
} from "./types";

// Aligns with nexus constants.ts — NEXT_PUBLIC_API_URL is the canonical var
const _apiUrl =
  typeof process !== "undefined"
    ? (process.env.NEXT_PUBLIC_API_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL)
    : undefined;
// Strip trailing /api/v1 if present so we can build paths cleanly
const BASE_URL = (_apiUrl?.replace(/\/api\/v1\/?$/, "") ?? "http://localhost:8000");

function getAuthHeaders(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}/api/v1${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
      ...init?.headers,
    },
    ...init,
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`${res.status} ${res.statusText}: ${body}`);
  }
  return res.json() as Promise<T>;
}

export async function createSniperRun(payload: CreateSniperRunRequest): Promise<SniperRunResponse> {
  return apiFetch<SniperRunResponse>("/sniper/runs", { method: "POST", body: JSON.stringify(payload) });
}

export async function getSniperRun(runId: number | string): Promise<SniperRunResponse> {
  return apiFetch<SniperRunResponse>(`/sniper/runs/${runId}`);
}

export async function getSniperTimeline(runId: number | string): Promise<WorkflowTimelineStep[]> {
  return apiFetch<WorkflowTimelineStep[]>(`/sniper/runs/${runId}/timeline`);
}

export async function getSniperResults(runId: number | string): Promise<MatchedObject[]> {
  return apiFetch<MatchedObject[]>(`/sniper/runs/${runId}/results`);
}

export async function regenerateSniperScript(
  runId: number | string,
  matchId: string,
  manualOverride?: ManualOverride
): Promise<MagicScriptOutput> {
  return apiFetch<MagicScriptOutput>(`/sniper/runs/${runId}/script`, {
    method: "POST",
    body: JSON.stringify({ match_id: matchId, manual_override: manualOverride }),
  });
}

export async function executeSniperAction(
  runId: number | string,
  action: WorkflowActionRequest
): Promise<WorkflowActionResponse> {
  return apiFetch<WorkflowActionResponse>(`/sniper/runs/${runId}/actions`, {
    method: "POST",
    body: JSON.stringify(action),
  });
}

export async function rerunSniper(
  runId: number | string,
  payload: RerunSniperRequest
): Promise<SniperRunResponse> {
  return apiFetch<SniperRunResponse>(`/sniper/runs/${runId}/rerun`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
