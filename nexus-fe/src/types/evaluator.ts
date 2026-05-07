export interface EvaluatorRun {
  id: string;
  org_id?: string;
  name: string;
  cadence: "daily" | "weekly" | "custom";
  run_type?: string;
  start_date: string;
  end_date?: string;
  status: "active" | "completed" | "archived";
  created_at?: string;
}

export interface EvaluatorItem {
  id: string;
  run_id: string;
  title?: string;
  input?: string;
  ai_output?: string;
  description?: string;
  priority?: "low" | "medium" | "high";
  task_status?: "pending" | "in_progress" | "completed";
  score?: number;
  position?: number;
  started_at?: string;
  ended_at?: string;
  open_count?: number;
  reopen_count?: number;
}

export interface EvaluatorResponse {
  id?: string;
  run_id: string;
  item_id: string;
  score: number;
  evaluator_name?: string;
  organization_name?: string;
  created_at?: string;
}
