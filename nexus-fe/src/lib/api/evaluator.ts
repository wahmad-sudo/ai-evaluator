import type { EvaluatorRun, EvaluatorItem, EvaluatorResponse } from "@/types/evaluator";

const BASE =
  (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_API_BASE_URL) ||
  "https://nexus-api.cai-sol.com";

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...init?.headers },
    ...init,
  });
  if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
  return res.json() as Promise<T>;
}

export function listRuns(orgId?: string): Promise<EvaluatorRun[]> {
  const q = orgId ? `?org_id=${encodeURIComponent(orgId)}` : "";
  return apiFetch(`/api/v1/evaluator/runs${q}`);
}

export function createRun(data: {
  name: string;
  cadence: "daily" | "weekly" | "custom";
  start_date: string;
  end_date?: string;
  org_id?: string;
  status?: string;
}): Promise<EvaluatorRun> {
  return apiFetch("/api/v1/evaluator/runs", { method: "POST", body: JSON.stringify(data) });
}

export function listItems(runId: string): Promise<EvaluatorItem[]> {
  return apiFetch(`/api/v1/evaluator/runs/${runId}/items`);
}

export function createItem(runId: string, data: {
  title?: string;
  description?: string;
  priority?: "low" | "medium" | "high";
  input?: string;
  ai_output?: string;
}): Promise<EvaluatorItem> {
  return apiFetch(`/api/v1/evaluator/runs/${runId}/items`, {
    method: "POST",
    body: JSON.stringify({ ...data, run_id: runId, task_status: "pending" }),
  });
}

export function listResponses(runId: string): Promise<EvaluatorResponse[]> {
  return apiFetch(`/api/v1/evaluator/runs/${runId}/responses`);
}

export function submitResponse(data: {
  run_id: string;
  item_id: string;
  score: number;
  evaluator_name?: string;
  organization_name?: string;
}): Promise<EvaluatorResponse> {
  return apiFetch("/api/v1/evaluator/responses", { method: "POST", body: JSON.stringify(data) });
}
