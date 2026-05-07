export type SourceObjectType =
  | "lead" | "business" | "job" | "candidate" | "student"
  | "college" | "vendor" | "permit" | "rfp" | "post"
  | "property" | "consumer_request";

export type TargetObjectType = "any" | SourceObjectType;

export type WorkflowStatus = "idle" | "pending" | "running" | "completed" | "failed";

export type TimelineStepStatus = "pending" | "running" | "completed" | "hold" | "failed";

export type OsirisVerdict =
  | "OSIRIS_A_LOCKED" | "OSIRIS_B_STRONG" | "OSIRIS_C_REVIEW"
  | "OSIRIS_D_WEAK" | "OSIRIS_REJECT";

export type BANTDecision = "APPROVED" | "HOLD" | "REJECT";

export type EvidenceStatus = "VERIFIED" | "HOLD" | "REJECT" | "MISSING_EVIDENCE";

export interface SourceObject {
  object_type: SourceObjectType;
  name?: string;
  title?: string;
  company_name?: string;
  location?: string;
  website?: string;
  source_url?: string;
  tags?: string[];
  signals?: string[];
  [key: string]: unknown;
}

export interface SniperRunResponse {
  id: number;
  run_uuid: string;
  source_object_type: SourceObjectType;
  source_object_id?: string;
  source_name?: string;
  target_object_type?: TargetObjectType;
  geo?: string;
  timeframe?: string;
  intent_mode?: string;
  status: WorkflowStatus;
  current_step?: string;
  mock_mode: boolean;
  created_at: string;
  updated_at: string;
  completed_at?: string;
  error_message?: string;
}

export interface WorkflowTimelineStep {
  id: number;
  run_id: number;
  step_key: string;
  step_label: string;
  status: TimelineStepStatus;
  started_at?: string;
  completed_at?: string;
  duration_ms?: number;
  message?: string;
  sort_order: number;
}

export interface OsirisDetail {
  entity_match: number;
  intent_relevance: number;
  source_trust: number;
  evidence_strength: number;
  freshness: number;
  contact_path: number;
  duplicate_risk: number;
  persona_fit: number;
  overall_rating: number;
  verdict: OsirisVerdict;
}

export interface BANTDetail {
  icp_fit: number;
  authority: number;
  intent_strength: number;
  timing: number;
  contactability: number;
  composite_score: number;
  decision: BANTDecision;
}

export interface MatchedObject {
  id: number;
  run_id: number;
  match_uuid: string;
  match_type?: string;
  name?: string;
  title?: string;
  company?: string;
  location?: string;
  website?: string;
  source_url?: string;
  intent?: string;
  score: number;
  evidence_status?: EvidenceStatus;
  osiris_rating: number;
  osiris_verdict?: OsirisVerdict;
  bant_score: number;
  bant_decision?: BANTDecision;
  spend_gate_decision?: string;
  source_type?: string;
  created_at: string;
}

export interface MagicScriptOutput {
  hook?: string;
  pain_summary?: string;
  email_script?: string;
  linkedin_script?: string;
  call_script?: string;
  ringcentral_call_opener?: string;
  cta?: string;
  follow_up?: string;
  mock?: boolean;
}

export interface ManualOverride {
  tone?: string;
  persona?: string;
  pain_focus?: string;
  custom_hook?: string;
}

export interface CreateSniperRunRequest {
  source_object_type: SourceObjectType;
  source_object_id?: string;
  source_name?: string;
  source_payload?: Record<string, unknown>;
  target_object_type?: TargetObjectType;
  geo?: string;
  timeframe?: string;
  intent_mode?: string;
  mock_mode?: boolean;
  created_by?: string;
}

export interface RerunSniperRequest {
  target_object_type?: TargetObjectType;
  geo?: string;
  intent_mode?: string;
  mock_mode?: boolean;
}

export interface WorkflowActionRequest {
  action_type: string;
  match_id?: number;
  payload?: Record<string, unknown>;
}

export interface WorkflowActionResponse {
  id: number;
  run_id: number;
  match_id?: number;
  action_type: string;
  action_status: string;
  result?: Record<string, unknown>;
  created_at: string;
}

export interface WorkflowState {
  run?: SniperRunResponse;
  timeline: WorkflowTimelineStep[];
  results: MatchedObject[];
  selectedMatch?: MatchedObject;
  script?: MagicScriptOutput;
  status: WorkflowStatus;
  isPolling: boolean;
  error?: string;
}
