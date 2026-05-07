from __future__ import annotations
from typing import Any, Optional
from datetime import datetime
from pydantic import BaseModel


class SniperRunCreate(BaseModel):
    source_object_type: str
    source_object_id: Optional[str] = None
    source_name: Optional[str] = None
    source_payload: Optional[dict[str, Any]] = None
    target_object_type: Optional[str] = "any"
    geo: Optional[str] = None
    timeframe: Optional[str] = "30d"
    intent_mode: Optional[str] = "auto"
    mock_mode: Optional[bool] = False
    created_by: Optional[str] = None


class SniperRunResponse(BaseModel):
    id: int
    run_uuid: str
    source_object_type: str
    source_object_id: Optional[str]
    source_name: Optional[str]
    target_object_type: Optional[str]
    geo: Optional[str]
    timeframe: Optional[str]
    intent_mode: Optional[str]
    status: str
    current_step: Optional[str]
    mock_mode: bool
    created_at: datetime
    updated_at: datetime
    completed_at: Optional[datetime]
    error_message: Optional[str]

    model_config = {"from_attributes": True}


class WorkflowTimelineStep(BaseModel):
    id: int
    run_id: int
    step_key: str
    step_label: str
    status: str
    started_at: Optional[datetime]
    completed_at: Optional[datetime]
    duration_ms: Optional[int]
    message: Optional[str]
    sort_order: int

    model_config = {"from_attributes": True}


class OsirisDetail(BaseModel):
    entity_match: float = 0.0
    intent_relevance: float = 0.0
    source_trust: float = 0.0
    evidence_strength: float = 0.0
    freshness: float = 0.0
    contact_path: float = 0.0
    duplicate_risk: float = 0.0
    persona_fit: float = 0.0
    overall_rating: float = 0.0
    verdict: str = "OSIRIS_REJECT"


class BANTDetail(BaseModel):
    icp_fit: float = 0.0
    authority: float = 0.0
    intent_strength: float = 0.0
    timing: float = 0.0
    contactability: float = 0.0
    composite_score: float = 0.0
    decision: str = "REJECT"


class MatchedObject(BaseModel):
    id: int
    run_id: int
    match_uuid: str
    match_type: Optional[str]
    name: Optional[str]
    title: Optional[str]
    company: Optional[str]
    location: Optional[str]
    website: Optional[str]
    source_url: Optional[str]
    intent: Optional[str]
    score: float
    evidence_status: Optional[str]
    osiris_rating: float
    osiris_verdict: Optional[str]
    bant_score: float
    bant_decision: Optional[str]
    spend_gate_decision: Optional[str]
    source_type: Optional[str]
    created_at: datetime

    model_config = {"from_attributes": True}


class MagicScriptOutput(BaseModel):
    hook: Optional[str] = None
    pain_summary: Optional[str] = None
    email_script: Optional[str] = None
    linkedin_script: Optional[str] = None
    call_script: Optional[str] = None
    ringcentral_call_opener: Optional[str] = None
    cta: Optional[str] = None
    follow_up: Optional[str] = None
    mock: bool = False


class ManualOverride(BaseModel):
    tone: Optional[str] = None
    persona: Optional[str] = None
    pain_focus: Optional[str] = None
    custom_hook: Optional[str] = None


class ScriptRegenerateRequest(BaseModel):
    match_id: str
    manual_override: Optional[ManualOverride] = None


class RerunSniperRequest(BaseModel):
    target_object_type: Optional[str] = None
    geo: Optional[str] = None
    intent_mode: Optional[str] = None
    mock_mode: Optional[bool] = None


class OsirisRatingRequest(BaseModel):
    source_object: dict[str, Any]
    matched_object: dict[str, Any]
    evidence: Optional[list[dict[str, Any]]] = None
    source_classification: Optional[dict[str, Any]] = None
    duplicate_risk: Optional[float] = 0.0


class SniperDefaultsResponse(BaseModel):
    target_object_types: list[str]
    intent_modes: list[str]
    timeframes: list[str]
    source_types: list[str]
    osiris_verdicts: list[str]
    bant_decisions: list[str]
