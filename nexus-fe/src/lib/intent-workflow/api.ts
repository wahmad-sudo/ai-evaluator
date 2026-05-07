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

const BASE_URL =
  (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_API_BASE_URL) ||
  "https://nexus-api.cai-sol.com";

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...init?.headers },
    ...init,
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`${res.status} ${res.statusText}: ${body}`);
  }
  return res.json() as Promise<T>;
}

export async function createSniperRun(
  payload: CreateSniperRunRequest
): Promise<SniperRunResponse> {
  return apiFetch<SniperRunResponse>("/api/v1/sniper/runs", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getSniperRun(
  runId: number | string
): Promise<SniperRunResponse> {
  return apiFetch<SniperRunResponse>(`/api/v1/sniper/runs/${runId}`);
}

export async function getSniperTimeline(
  runId: number | string
): Promise<WorkflowTimelineStep[]> {
  return apiFetch<WorkflowTimelineStep[]>(
    `/api/v1/sniper/runs/${runId}/timeline`
  );
}

export async function getSniperResults(
  runId: number | string
): Promise<MatchedObject[]> {
  return apiFetch<MatchedObject[]>(`/api/v1/sniper/runs/${runId}/results`);
}

export async function regenerateSniperScript(
  runId: number | string,
  matchId: string,
  manualOverride?: ManualOverride
): Promise<MagicScriptOutput> {
  return apiFetch<MagicScriptOutput>(`/api/v1/sniper/runs/${runId}/script`, {
    method: "POST",
    body: JSON.stringify({ match_id: matchId, manual_override: manualOverride }),
  });
}

export async function executeSniperAction(
  runId: number | string,
  action: WorkflowActionRequest
): Promise<WorkflowActionResponse> {
  return apiFetch<WorkflowActionResponse>(
    `/api/v1/sniper/runs/${runId}/actions`,
    { method: "POST", body: JSON.stringify(action) }
  );
}

export async function rerunSniper(
  runId: number | string,
  payload: RerunSniperRequest
): Promise<SniperRunResponse> {
  return apiFetch<SniperRunResponse>(
    `/api/v1/sniper/runs/${runId}/rerun`,
    { method: "POST", body: JSON.stringify(payload) }
  );
}
