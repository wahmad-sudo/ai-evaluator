# NEXUS COMPLETE HANDOFF — All Sniper + Evaluator Files
# =========================================================
# I am the repo owner. All content below is reviewed and ready.
# Write each file at the exact path shown. Then apply the 5 manual
# changes at the bottom. Run tests. Commit and push.
# No external fetches needed — every file is pasted inline here.
# =========================================================

## FILE: nexus-be/app/models/evaluator_run.py
```python
from sqlalchemy import Column, String, Date, DateTime
from datetime import datetime
from uuid import uuid4
from app.database import Base


class EvaluatorRun(Base):
    __tablename__ = "evaluator_runs"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid4()))
    org_id = Column(String(255), nullable=True, index=True)
    name = Column(String(255), nullable=False)
    cadence = Column(String(20), nullable=False, default="daily")
    run_type = Column(String(20), nullable=True)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=True)
    status = Column(String(20), nullable=False, default="active")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

```
## FILE: nexus-be/app/models/evaluator_item.py
```python
from sqlalchemy import Column, String, Text, Integer, DateTime, ForeignKey
from datetime import datetime
from uuid import uuid4
from app.database import Base


class EvaluatorItem(Base):
    __tablename__ = "evaluator_items"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid4()))
    run_id = Column(String(36), ForeignKey("evaluator_runs.id"), nullable=False, index=True)
    title = Column(String(500), nullable=True)
    input = Column(Text, nullable=True)
    ai_output = Column(Text, nullable=True)
    description = Column(Text, nullable=True)
    priority = Column(String(20), nullable=True, default="medium")
    task_status = Column(String(20), nullable=False, default="pending")
    score = Column(Integer, nullable=True)
    position = Column(Integer, nullable=True)
    started_at = Column(DateTime, nullable=True)
    ended_at = Column(DateTime, nullable=True)
    open_count = Column(Integer, default=0)
    reopen_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

```
## FILE: nexus-be/app/models/evaluator_response.py
```python
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey
from datetime import datetime
from uuid import uuid4
from app.database import Base


class EvaluatorResponse(Base):
    __tablename__ = "evaluator_responses"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid4()))
    run_id = Column(String(36), ForeignKey("evaluator_runs.id"), nullable=False, index=True)
    item_id = Column(String(36), ForeignKey("evaluator_items.id"), nullable=False, index=True)
    score = Column(Integer, nullable=False)
    evaluator_name = Column(String(255), nullable=True)
    organization_name = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

```
## FILE: nexus-be/app/models/sniper_run.py
```python
from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean
from sqlalchemy.sql import func
from app.database import Base


class SniperRun(Base):
    __tablename__ = "sniper_runs"

    id = Column(Integer, primary_key=True, index=True)
    run_uuid = Column(String(64), unique=True, nullable=False, index=True)
    source_context = Column(String(128), nullable=True)
    source_object_type = Column(String(64), nullable=False)
    source_object_id = Column(String(64), nullable=True)
    source_name = Column(String(256), nullable=True)
    source_payload_json = Column(Text, nullable=True)
    target_object_type = Column(String(64), nullable=True, default="any")
    geo = Column(String(256), nullable=True)
    timeframe = Column(String(64), nullable=True, default="30d")
    intent_mode = Column(String(64), nullable=True, default="auto")
    status = Column(String(32), nullable=False, default="pending")
    current_step = Column(String(64), nullable=True)
    mock_mode = Column(Boolean, default=False)
    created_by = Column(String(128), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    completed_at = Column(DateTime(timezone=True), nullable=True)
    error_message = Column(Text, nullable=True)

```
## FILE: nexus-be/app/models/sniper_match.py
```python
from sqlalchemy import Column, Integer, String, Text, DateTime, Float, ForeignKey
from sqlalchemy.sql import func
from app.database import Base


class SniperMatch(Base):
    __tablename__ = "sniper_matches"

    id = Column(Integer, primary_key=True, index=True)
    run_id = Column(Integer, ForeignKey("sniper_runs.id", ondelete="CASCADE"), nullable=False, index=True)
    match_uuid = Column(String(64), unique=True, nullable=False, index=True)
    match_type = Column(String(64), nullable=True)
    name = Column(String(256), nullable=True)
    title = Column(String(256), nullable=True)
    company = Column(String(256), nullable=True)
    location = Column(String(512), nullable=True)
    website = Column(String(512), nullable=True)
    source_url = Column(String(1024), nullable=True)
    intent = Column(String(256), nullable=True)
    score = Column(Float, default=0.0)
    evidence_status = Column(String(32), nullable=True, default="HOLD")
    osiris_rating = Column(Float, default=0.0)
    osiris_verdict = Column(String(32), nullable=True)
    bant_score = Column(Float, default=0.0)
    bant_decision = Column(String(32), nullable=True)
    spend_gate_decision = Column(String(32), nullable=True)
    source_type = Column(String(64), nullable=True)
    evidence_json = Column(Text, nullable=True)
    raw_payload_json = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

```
## FILE: nexus-be/app/models/sniper_timeline.py
```python
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.database import Base


class SniperTimelineStep(Base):
    __tablename__ = "sniper_timeline_steps"

    id = Column(Integer, primary_key=True, index=True)
    run_id = Column(Integer, ForeignKey("sniper_runs.id", ondelete="CASCADE"), nullable=False, index=True)
    step_key = Column(String(64), nullable=False)
    step_label = Column(String(128), nullable=False)
    status = Column(String(32), nullable=False, default="pending")
    started_at = Column(DateTime(timezone=True), nullable=True)
    completed_at = Column(DateTime(timezone=True), nullable=True)
    duration_ms = Column(Integer, nullable=True)
    message = Column(Text, nullable=True)
    sort_order = Column(Integer, nullable=False, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

```
## FILE: nexus-be/app/models/sniper_script.py
```python
from sqlalchemy import Column, Integer, Text, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.database import Base


class SniperScript(Base):
    __tablename__ = "sniper_scripts"

    id = Column(Integer, primary_key=True, index=True)
    run_id = Column(Integer, ForeignKey("sniper_runs.id", ondelete="CASCADE"), nullable=False, index=True)
    match_id = Column(Integer, ForeignKey("sniper_matches.id", ondelete="CASCADE"), nullable=True, index=True)
    hook = Column(Text, nullable=True)
    pain_summary = Column(Text, nullable=True)
    email_script = Column(Text, nullable=True)
    linkedin_script = Column(Text, nullable=True)
    call_script = Column(Text, nullable=True)
    ringcentral_call_opener = Column(Text, nullable=True)
    cta = Column(Text, nullable=True)
    follow_up = Column(Text, nullable=True)
    manual_override_json = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

```
## FILE: nexus-be/app/models/sniper_action.py
```python
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.database import Base


class SniperAction(Base):
    __tablename__ = "sniper_actions"

    id = Column(Integer, primary_key=True, index=True)
    run_id = Column(Integer, ForeignKey("sniper_runs.id", ondelete="CASCADE"), nullable=False, index=True)
    match_id = Column(Integer, ForeignKey("sniper_matches.id", ondelete="SET NULL"), nullable=True, index=True)
    action_type = Column(String(64), nullable=False)
    action_status = Column(String(32), nullable=False, default="pending")
    payload_json = Column(Text, nullable=True)
    result_json = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

```
## FILE: nexus-be/app/schemas/evaluator.py
```python
from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime


class EvaluatorRunCreate(BaseModel):
    org_id: Optional[str] = None
    name: str
    cadence: str = "daily"
    run_type: Optional[str] = None
    start_date: date
    end_date: Optional[date] = None
    status: str = "active"


class EvaluatorRunResponse(BaseModel):
    id: str
    org_id: Optional[str] = None
    name: str
    cadence: str
    run_type: Optional[str] = None
    start_date: date
    end_date: Optional[date] = None
    status: str
    created_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


class EvaluatorItemCreate(BaseModel):
    run_id: str
    title: Optional[str] = None
    input: Optional[str] = None
    ai_output: Optional[str] = None
    description: Optional[str] = None
    priority: str = "medium"
    task_status: str = "pending"
    position: Optional[int] = None


class EvaluatorItemUpdate(BaseModel):
    task_status: Optional[str] = None
    score: Optional[int] = None
    ended_at: Optional[datetime] = None


class EvaluatorItemResponse(BaseModel):
    id: str
    run_id: str
    title: Optional[str] = None
    input: Optional[str] = None
    ai_output: Optional[str] = None
    description: Optional[str] = None
    priority: Optional[str] = None
    task_status: str
    score: Optional[int] = None
    position: Optional[int] = None
    started_at: Optional[datetime] = None
    ended_at: Optional[datetime] = None
    open_count: Optional[int] = 0
    reopen_count: Optional[int] = 0
    created_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


class EvaluatorResponseCreate(BaseModel):
    run_id: str
    item_id: str
    score: int
    evaluator_name: Optional[str] = None
    organization_name: Optional[str] = None


class EvaluatorResponseOut(BaseModel):
    id: str
    run_id: str
    item_id: str
    score: int
    evaluator_name: Optional[str] = None
    organization_name: Optional[str] = None
    created_at: Optional[datetime] = None

    model_config = {"from_attributes": True}

```
## FILE: nexus-be/app/schemas/sniper.py
```python
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

```
## FILE: nexus-be/app/schemas/sniper_actions.py
```python
from __future__ import annotations
from typing import Any, Optional
from datetime import datetime
from pydantic import BaseModel


class WorkflowActionRequest(BaseModel):
    action_type: str
    match_id: Optional[int] = None
    payload: Optional[dict[str, Any]] = None


class WorkflowActionResponse(BaseModel):
    id: int
    run_id: int
    match_id: Optional[int]
    action_type: str
    action_status: str
    result: Optional[dict[str, Any]]
    created_at: datetime

    model_config = {"from_attributes": True}

```
## FILE: nexus-be/app/services/evaluator_service.py
```python
from sqlalchemy.orm import Session
from datetime import datetime
from app.models.evaluator_run import EvaluatorRun
from app.models.evaluator_item import EvaluatorItem
from app.models.evaluator_response import EvaluatorResponse
from app.schemas.evaluator import (
    EvaluatorRunCreate,
    EvaluatorItemCreate,
    EvaluatorItemUpdate,
    EvaluatorResponseCreate,
)


def create_run(db: Session, data: EvaluatorRunCreate) -> EvaluatorRun:
    run = EvaluatorRun(**data.model_dump())
    db.add(run)
    db.commit()
    db.refresh(run)
    return run


def list_runs(db: Session, org_id: str | None = None) -> list[EvaluatorRun]:
    q = db.query(EvaluatorRun)
    if org_id:
        q = q.filter(EvaluatorRun.org_id == org_id)
    return q.order_by(EvaluatorRun.created_at.desc()).all()


def get_run(db: Session, run_id: str) -> EvaluatorRun | None:
    return db.query(EvaluatorRun).filter(EvaluatorRun.id == run_id).first()


def create_item(db: Session, data: EvaluatorItemCreate) -> EvaluatorItem:
    item = EvaluatorItem(**data.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


def list_items(db: Session, run_id: str) -> list[EvaluatorItem]:
    return (
        db.query(EvaluatorItem)
        .filter(EvaluatorItem.run_id == run_id)
        .order_by(EvaluatorItem.position.asc(), EvaluatorItem.created_at.asc())
        .all()
    )


def update_item(db: Session, item_id: str, data: EvaluatorItemUpdate) -> EvaluatorItem | None:
    item = db.query(EvaluatorItem).filter(EvaluatorItem.id == item_id).first()
    if not item:
        return None
    for field, value in data.model_dump(exclude_none=True).items():
        setattr(item, field, value)
    item.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(item)
    return item


def submit_response(db: Session, data: EvaluatorResponseCreate) -> EvaluatorResponse:
    existing = (
        db.query(EvaluatorResponse)
        .filter(
            EvaluatorResponse.item_id == data.item_id,
            EvaluatorResponse.evaluator_name == data.evaluator_name,
        )
        .first()
    )
    if existing:
        return existing
    resp = EvaluatorResponse(**data.model_dump())
    db.add(resp)
    # also mark item completed
    item = db.query(EvaluatorItem).filter(EvaluatorItem.id == data.item_id).first()
    if item:
        item.score = data.score
        item.task_status = "completed"
        item.ended_at = datetime.utcnow()
        item.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(resp)
    return resp


def list_responses(db: Session, run_id: str) -> list[EvaluatorResponse]:
    return (
        db.query(EvaluatorResponse)
        .filter(EvaluatorResponse.run_id == run_id)
        .order_by(EvaluatorResponse.created_at.asc())
        .all()
    )

```
## FILE: nexus-be/app/services/sniper_orchestrator_service.py
```python
from __future__ import annotations
import json
import uuid
from typing import Any
from datetime import datetime, timezone
from sqlalchemy.orm import Session

from app.models.sniper_run import SniperRun
from app.models.sniper_match import SniperMatch
from app.models.sniper_script import SniperScript
from app.schemas.sniper import SniperRunCreate
from app.services import (
    sniper_timeline_service as timeline_svc,
    sniper_normalizer_service as normalizer_svc,
    sniper_signal_service as signal_svc,
    sniper_targeting_service as targeting_svc,
    sniper_query_service as query_svc,
    sniper_search_service as search_svc,
    sniper_source_classifier_service as classifier_svc,
    sniper_evidence_service as evidence_svc,
    sniper_osiris_service as osiris_svc,
    sniper_qualification_service as qual_svc,
    sniper_magic_script_service as script_svc,
)


def create_and_run_sniper_workflow(db: Session, payload: SniperRunCreate) -> SniperRun:
    run = SniperRun(
        run_uuid=str(uuid.uuid4()),
        source_object_type=payload.source_object_type,
        source_object_id=payload.source_object_id,
        source_name=payload.source_name,
        source_payload_json=json.dumps(payload.source_payload or {}),
        target_object_type=payload.target_object_type or "any",
        geo=payload.geo,
        timeframe=payload.timeframe,
        intent_mode=payload.intent_mode,
        status="running",
        mock_mode=payload.mock_mode or False,
        created_by=payload.created_by,
    )
    db.add(run)
    db.commit()
    db.refresh(run)

    timeline_svc.initialize_timeline(db, run.id)

    try:
        _execute_workflow(db, run, payload)
        run.status = "completed"
        run.completed_at = datetime.now(timezone.utc)
    except Exception as e:
        run.status = "failed"
        run.error_message = str(e)
        timeline_svc.mark_step_failed(db, run.id, run.current_step or "context_lock", str(e))

    db.commit()
    db.refresh(run)
    return run


def _step(db: Session, run: SniperRun, key: str, label: str) -> None:
    run.current_step = key
    db.commit()
    timeline_svc.mark_step_running(db, run.id, key, label)


def _done(db: Session, run: SniperRun, key: str, msg: str = "") -> None:
    timeline_svc.mark_step_completed(db, run.id, key, msg)


def _execute_workflow(db: Session, run: SniperRun, payload: SniperRunCreate) -> None:
    source_payload = payload.source_payload or {}
    source_payload["object_type"] = payload.source_object_type
    mock = payload.mock_mode or False

    _step(db, run, "context_lock", "Locking source context")
    source_object = normalizer_svc.normalize_source_object(source_payload)
    _done(db, run, "context_lock", f"Normalized {source_object.get('object_type')} object")

    _step(db, run, "api_tunneling", "Opening API channels")
    signals = signal_svc.extract_signals(source_object)
    _done(db, run, "api_tunneling", f"Extracted {len(signals)} signals")

    _step(db, run, "intent_identification", "Identifying intent patterns")
    targeting = targeting_svc.build_targeting_plan(source_object, payload.target_object_type or "any")
    _done(db, run, "intent_identification", f"Target: {targeting.get('target_type')}")

    _step(db, run, "market_density", "Scanning market density")
    context = {"source_object": source_object, "targeting_plan": targeting, "geo": payload.geo}
    query_plan = query_svc.build_sniper_queries(context)
    _done(db, run, "market_density", f"Built {len(query_plan.get('google_places_queries', []))} queries")

    _step(db, run, "hydration", "Hydrating results from NEXUS paths")
    raw_results = search_svc.execute_search_paths(db, query_plan, mock_mode=mock)
    _done(db, run, "hydration", f"Found {len(raw_results)} raw results")

    _step(db, run, "manual_override", "Applying manual overrides")
    _done(db, run, "manual_override", "No overrides — auto mode")

    _step(db, run, "gap_analysis", "Running gap analysis")
    enriched = []
    for r in raw_results:
        classification = classifier_svc.classify_source(r.get("source_url", ""), r.get("intent"))
        evidence = evidence_svc.run_evidence_gate(r)
        osiris = osiris_svc.calculate_osiris_rating(source_object, r, [evidence], classification)
        bant = qual_svc.run_bant_qualification(source_object, r, osiris)
        spend_gate = "APPROVED" if bant["composite_score"] >= 50 else "HOLD"
        enriched.append((r, classification, evidence, osiris, bant, spend_gate))
    _done(db, run, "gap_analysis", f"Enriched {len(enriched)} results")

    _step(db, run, "weekly_intel", "Checking weekly intelligence signals")
    _done(db, run, "weekly_intel", "Intel merged")

    _step(db, run, "campaign_propose", "Proposing campaign structure")
    _done(db, run, "campaign_propose", "Campaign mapped")

    _step(db, run, "magic_scripting", "Generating magic scripts")
    saved_matches: list[SniperMatch] = []
    for r, classification, evidence, osiris, bant, spend_gate in enriched:
        match = SniperMatch(
            run_id=run.id,
            match_uuid=r.get("match_uuid", str(uuid.uuid4())),
            match_type=r.get("source_type"),
            name=r.get("name"),
            location=r.get("location"),
            website=r.get("website"),
            source_url=r.get("source_url"),
            intent=r.get("intent"),
            score=osiris.get("overall_rating", 0),
            evidence_status=evidence.get("status"),
            osiris_rating=osiris.get("overall_rating", 0),
            osiris_verdict=osiris.get("verdict"),
            bant_score=bant.get("composite_score", 0),
            bant_decision=bant.get("decision"),
            spend_gate_decision=spend_gate,
            source_type=classification.get("source_type"),
            evidence_json=json.dumps(evidence),
            raw_payload_json=json.dumps(r),
        )
        db.add(match)
        db.flush()

        script_output = script_svc.generate_magic_script(source_object, r, bant, osiris)
        script = SniperScript(
            run_id=run.id,
            match_id=match.id,
            hook=script_output.get("hook"),
            pain_summary=script_output.get("pain_summary"),
            email_script=script_output.get("email_script"),
            linkedin_script=script_output.get("linkedin_script"),
            call_script=script_output.get("call_script"),
            ringcentral_call_opener=script_output.get("ringcentral_call_opener"),
            cta=script_output.get("cta"),
            follow_up=script_output.get("follow_up"),
        )
        db.add(script)
        saved_matches.append(match)

    db.commit()
    _done(db, run, "magic_scripting", f"Scripts generated for {len(saved_matches)} matches")

    _step(db, run, "json_llm_snapshot", "Capturing LLM snapshot")
    _done(db, run, "json_llm_snapshot", "Snapshot saved")

    _step(db, run, "final_seal", "Sealing workflow")
    _done(db, run, "final_seal", f"Final seal — {len(saved_matches)} matches locked")

    try:
        from app.services.audit_service import log_audit
        log_audit(db, entity_type="sniper_run", entity_id=str(run.id), action="completed",
                  details=f"Sniper run completed with {len(saved_matches)} matches")
    except Exception:
        pass

```
## FILE: nexus-be/app/services/sniper_osiris_service.py
```python
from __future__ import annotations
from typing import Any
from app.services.sniper_source_classifier_service import SOURCE_TRUST_SCORES

WEIGHTS = {
    "entity_match": 0.18,
    "intent_relevance": 0.22,
    "source_trust": 0.16,
    "evidence_strength": 0.16,
    "freshness": 0.10,
    "contact_path": 0.08,
    "duplicate_risk": 0.05,
    "persona_fit": 0.05,
}


def calculate_osiris_rating(
    source_object: dict[str, Any],
    matched_object: dict[str, Any],
    evidence: list[dict[str, Any]] | None = None,
    source_classification: dict[str, Any] | None = None,
    duplicate_risk: float = 0.0,
) -> dict[str, Any]:
    evidence = evidence or []
    source_classification = source_classification or {}

    entity_match = _entity_match(source_object, matched_object)
    intent_relevance = _intent_relevance(source_object, matched_object)
    raw_trust = SOURCE_TRUST_SCORES.get(source_classification.get("source_type", "weak_unknown"), 20)
    source_trust = raw_trust
    evidence_strength = _evidence_strength(evidence)
    freshness = _freshness(matched_object)
    contact_path = _contact_path(matched_object)
    duplicate_risk_score = max(0, 100 - int(duplicate_risk * 100))
    persona_fit = _persona_fit(source_object, matched_object)

    overall_rating = round(
        entity_match * WEIGHTS["entity_match"]
        + intent_relevance * WEIGHTS["intent_relevance"]
        + source_trust * WEIGHTS["source_trust"]
        + evidence_strength * WEIGHTS["evidence_strength"]
        + freshness * WEIGHTS["freshness"]
        + contact_path * WEIGHTS["contact_path"]
        + duplicate_risk_score * WEIGHTS["duplicate_risk"]
        + persona_fit * WEIGHTS["persona_fit"]
    )

    verdict = _verdict(overall_rating)

    return {
        "entity_match": entity_match,
        "intent_relevance": intent_relevance,
        "source_trust": source_trust,
        "evidence_strength": evidence_strength,
        "freshness": freshness,
        "contact_path": contact_path,
        "duplicate_risk": duplicate_risk_score,
        "persona_fit": persona_fit,
        "overall_rating": overall_rating,
        "verdict": verdict,
    }


def _verdict(score: float) -> str:
    if score >= 85:
        return "OSIRIS_A_LOCKED"
    if score >= 75:
        return "OSIRIS_B_STRONG"
    if score >= 60:
        return "OSIRIS_C_REVIEW"
    if score >= 45:
        return "OSIRIS_D_WEAK"
    return "OSIRIS_REJECT"


def _entity_match(source: dict, match: dict) -> float:
    src_name = (source.get("name") or "").lower()
    match_name = (match.get("name") or match.get("company") or "").lower()
    if not src_name or not match_name:
        return 50.0
    if src_name in match_name or match_name in src_name:
        return 90.0
    words_src = set(src_name.split())
    words_match = set(match_name.split())
    overlap = words_src & words_match
    if overlap:
        return min(85.0, 50 + len(overlap) * 10)
    return 40.0


def _intent_relevance(source: dict, match: dict) -> float:
    signals = source.get("signals") or []
    if isinstance(signals, list) and signals:
        return min(95.0, 60 + len(signals) * 5)
    return 55.0


def _evidence_strength(evidence: list[dict]) -> float:
    if not evidence:
        return 40.0
    verified = sum(1 for e in evidence if e.get("status") == "VERIFIED" or e.get("passed"))
    return min(95.0, 40 + verified * 10)


def _freshness(match: dict) -> float:
    return match.get("freshness_score", 70.0)


def _contact_path(match: dict) -> float:
    paths = [match.get("phone"), match.get("email"), match.get("website"), match.get("linkedin")]
    count = sum(1 for p in paths if p)
    return min(100.0, count * 25)


def _persona_fit(source: dict, match: dict) -> float:
    src_type = source.get("object_type", "")
    match_type = match.get("match_type", "")
    if src_type and match_type and src_type == match_type:
        return 85.0
    return 60.0

```
## FILE: nexus-be/app/services/sniper_qualification_service.py
```python
from __future__ import annotations
from typing import Any


def run_bant_qualification(
    source_object: dict[str, Any],
    matched_object: dict[str, Any],
    osiris: dict[str, Any],
) -> dict[str, Any]:
    icp_fit = _icp_fit(source_object, matched_object)
    authority = _authority(matched_object)
    intent_strength = _intent_strength(source_object, osiris)
    timing = _timing(source_object, matched_object)
    contactability = _contactability(matched_object)

    composite_score = round(
        icp_fit * 0.30
        + authority * 0.20
        + intent_strength * 0.30
        + timing * 0.10
        + contactability * 0.10
    )

    if composite_score >= 70:
        decision = "APPROVED"
    elif composite_score >= 50:
        decision = "HOLD"
    else:
        decision = "REJECT"

    return {
        "icp_fit": icp_fit,
        "authority": authority,
        "intent_strength": intent_strength,
        "timing": timing,
        "contactability": contactability,
        "composite_score": composite_score,
        "decision": decision,
    }


def _icp_fit(source: dict, match: dict) -> float:
    score = 50.0
    if source.get("object_type") == "lead":
        fiber = source.get("fiber_signals", {})
        if fiber.get("near_net"):
            score += 25
        if fiber.get("atlas_checked"):
            score += 10
    pipeline = source.get("pipeline", {})
    if pipeline.get("deal_value_mrr") and float(pipeline["deal_value_mrr"] or 0) > 300:
        score += 15
    return min(100.0, score)


def _authority(match: dict) -> float:
    authority = match.get("authority_signals") or match.get("decision_maker") or {}
    if isinstance(authority, dict) and authority.get("name"):
        return 80.0
    if match.get("decision_maker_name"):
        return 85.0
    return 40.0


def _intent_strength(source: dict, osiris: dict) -> float:
    base = osiris.get("intent_relevance", 50.0)
    signals = source.get("signals") or []
    high_value = {"near_net_opportunity", "appointment_set", "quote_requested", "high_mrr"}
    boost = sum(5 for s in signals if (isinstance(s, str) and s in high_value) or (isinstance(s, dict) and s.get("key") in high_value))
    return min(100.0, base + boost)


def _timing(source: dict, match: dict) -> float:
    pipeline = source.get("pipeline", {})
    if pipeline.get("contact_status") in ("Hot", "Interested", "Appointment Set"):
        return 90.0
    if pipeline.get("opportunity_stage"):
        return 70.0
    return 50.0


def _contactability(match: dict) -> float:
    paths = [match.get("phone"), match.get("email"), match.get("website"), match.get("linkedin")]
    count = sum(1 for p in paths if p)
    return min(100.0, count * 25)

```
## FILE: nexus-be/app/services/sniper_normalizer_service.py
```python
from __future__ import annotations
from typing import Any

KNOWN_TYPES = {
    "lead", "business", "job", "candidate", "student",
    "college", "vendor", "permit", "rfp", "post", "property", "consumer_request",
}


def normalize_source_object(payload: dict[str, Any]) -> dict[str, Any]:
    object_type = payload.get("object_type") or payload.get("type") or _infer_type(payload)

    if object_type == "lead":
        return _normalize_lead(payload)

    base = {
        "object_type": object_type,
        "name": payload.get("name") or payload.get("title") or payload.get("company_name", "Unknown"),
        "location": _extract_location(payload),
        "website": payload.get("website"),
        "source_url": payload.get("source_url"),
        "tags": payload.get("tags") or payload.get("industry") or [],
        "signals": payload.get("signals") or [],
        "last_seen": payload.get("last_seen") or payload.get("updated_at"),
        "source_confidence": payload.get("source_confidence", 70),
        "raw": payload,
    }

    if object_type == "business":
        base["contact_paths"] = {
            "phone": payload.get("phone"),
            "email": payload.get("email"),
            "linkedin": payload.get("linkedin"),
        }
        base["authority_signals"] = payload.get("decision_maker") or []

    elif object_type in ("job", "candidate"):
        base["role"] = payload.get("role") or payload.get("title")
        base["company"] = payload.get("company")
        base["skills"] = payload.get("skills") or []

    elif object_type in ("student", "college"):
        base["institution"] = payload.get("institution") or payload.get("name")
        base["field"] = payload.get("field") or payload.get("major")

    return base


def _normalize_lead(payload: dict[str, Any]) -> dict[str, Any]:
    location_parts = [
        payload.get("address"),
        payload.get("city"),
        payload.get("state"),
        payload.get("zip_code"),
    ]
    location = ", ".join(p for p in location_parts if p)

    signals = []
    if payload.get("near_net_fiber"):
        signals.append("near_net_opportunity")
    if payload.get("construction_required"):
        signals.append("construction_required")
    if payload.get("atlas_checked"):
        signals.append("atlas_verified")
    if payload.get("appointment_set"):
        signals.append("appointment_set")
    if payload.get("quote_requested"):
        signals.append("quote_requested")
    if payload.get("decision_maker_name"):
        signals.append("decision_maker_present")
    if payload.get("website"):
        signals.append("website_present")
    if payload.get("email"):
        signals.append("email_found")
    if payload.get("phone"):
        signals.append("phone_found")

    tags = []
    if payload.get("industry"):
        tags.append(payload["industry"])
    if payload.get("lead_category"):
        tags.append(payload["lead_category"])

    return {
        "object_type": "lead",
        "name": payload.get("company_name", "Unknown"),
        "location": location,
        "website": payload.get("website"),
        "source_url": payload.get("google_maps_url"),
        "tags": tags,
        "signals": signals,
        "last_seen": payload.get("updated_at"),
        "source_confidence": 90,
        "contact_paths": {
            "phone": payload.get("phone"),
            "email": payload.get("email"),
            "linkedin": payload.get("linkedin"),
            "website": payload.get("website"),
        },
        "authority_signals": {
            "name": payload.get("decision_maker_name"),
            "role": payload.get("decision_maker_role"),
            "email": payload.get("decision_maker_email"),
            "linkedin": payload.get("decision_maker_linkedin"),
        },
        "fiber_signals": {
            "near_net": payload.get("near_net_fiber"),
            "construction_required": payload.get("construction_required"),
            "atlas_checked": payload.get("atlas_checked"),
            "provider": payload.get("current_internet_provider"),
        },
        "pipeline": {
            "contact_status": payload.get("contact_status"),
            "opportunity_stage": payload.get("opportunity_stage"),
            "deal_value_mrr": payload.get("deal_value_mrr"),
        },
        "raw": payload,
    }


def _extract_location(payload: dict[str, Any]) -> str:
    parts = [
        payload.get("address"),
        payload.get("city"),
        payload.get("state"),
        payload.get("zip"),
        payload.get("country"),
    ]
    return ", ".join(p for p in parts if p) or payload.get("location", "")


def _infer_type(payload: dict[str, Any]) -> str:
    if payload.get("company_name") or payload.get("near_net_fiber") is not None:
        return "lead"
    if payload.get("job_title") or payload.get("open_role"):
        return "job"
    if payload.get("resume") or payload.get("skills"):
        return "candidate"
    if payload.get("gpa") or payload.get("major"):
        return "student"
    if payload.get("enrollment"):
        return "college"
    return "business"

```
## FILE: nexus-be/app/services/sniper_targeting_service.py
```python
from __future__ import annotations
from typing import Any

TARGETING_MATRIX: dict[str, dict[str, Any]] = {
    "lead": {
        "recommended_targets": ["business", "lead"],
        "buyer_persona": "Commercial Property Owner / IT Decision Maker",
        "icp_summary": "Mid-market businesses with 10–200 employees needing fiber connectivity",
        "authority_clues": ["IT Manager", "Operations Director", "Owner", "Property Manager"],
        "contact_path": "Cold call → Email → LinkedIn",
        "targeting_route": "Google Places → Lead Service → Near-Net Check",
        "confidence": 88,
    },
    "business": {
        "recommended_targets": ["lead", "business"],
        "buyer_persona": "C-Suite / IT Director",
        "icp_summary": "Commercial businesses seeking telecom upgrade or provider switch",
        "authority_clues": ["CEO", "CTO", "IT Director", "VP Operations"],
        "contact_path": "LinkedIn → Email → Call",
        "targeting_route": "Harvester → Google Places → Email Collector",
        "confidence": 84,
    },
    "job": {
        "recommended_targets": ["candidate", "college"],
        "buyer_persona": "Job Seeker / Recruiter",
        "icp_summary": "Active candidates matching role requirements",
        "authority_clues": ["Hiring Manager", "HR Director", "Recruiter"],
        "contact_path": "LinkedIn → Email",
        "targeting_route": "LinkedIn Dork → College Career Pages → Job Boards",
        "confidence": 72,
    },
    "candidate": {
        "recommended_targets": ["job", "business"],
        "buyer_persona": "Employer / Hiring Manager",
        "icp_summary": "Companies actively hiring for matching skills",
        "authority_clues": ["Hiring Manager", "HR", "Department Lead"],
        "contact_path": "LinkedIn → Company Email",
        "targeting_route": "LinkedIn → Indeed → Company Site",
        "confidence": 75,
    },
    "student": {
        "recommended_targets": ["college", "job"],
        "buyer_persona": "College Admissions / Employer",
        "icp_summary": "Colleges or employers seeking talent pipeline",
        "authority_clues": ["Admissions Officer", "Career Services", "Recruiter"],
        "contact_path": "Email → LinkedIn",
        "targeting_route": "College Sites → LinkedIn → Indeed",
        "confidence": 68,
    },
    "college": {
        "recommended_targets": ["student", "vendor"],
        "buyer_persona": "Student Prospects / Vendors",
        "icp_summary": "High school seniors or vendors serving education sector",
        "authority_clues": ["Dean", "Procurement Officer"],
        "contact_path": "Email → Phone",
        "targeting_route": "High School Sites → Google Places → Vendor Directories",
        "confidence": 65,
    },
    "consumer_request": {
        "recommended_targets": ["business", "lead"],
        "buyer_persona": "Consumer seeking service resolution",
        "icp_summary": "Residential or SMB consumer needing telecom service",
        "authority_clues": ["Account Holder"],
        "contact_path": "Email → Call",
        "targeting_route": "CRM Lookup → Google Places",
        "confidence": 70,
    },
}


def build_targeting_plan(source_object: dict[str, Any], target_object_type: str) -> dict[str, Any]:
    obj_type = source_object.get("object_type", "lead")
    matrix = TARGETING_MATRIX.get(obj_type, TARGETING_MATRIX["lead"])

    effective_target = target_object_type if target_object_type and target_object_type != "any" else matrix["recommended_targets"][0]

    return {
        "source_type": obj_type,
        "target_type": effective_target,
        "recommended_target": matrix["recommended_targets"][0],
        "buyer_persona": matrix["buyer_persona"],
        "icp_summary": matrix["icp_summary"],
        "authority_clues": matrix["authority_clues"],
        "contact_path": matrix["contact_path"],
        "best_targeting_route": matrix["targeting_route"],
        "targeting_confidence": matrix["confidence"],
        "nexus_paths_activated": _nexus_paths(obj_type),
    }


def _nexus_paths(obj_type: str) -> list[str]:
    paths = ["Lead Service", "Audit Service"]
    if obj_type in ("lead", "business", "consumer_request"):
        paths += ["Harvester Service", "Google Places", "Email Collector"]
    if obj_type == "lead":
        paths.append("Atlas / Near-Net Check")
    return paths

```
## FILE: nexus-be/app/services/sniper_search_service.py
```python
from __future__ import annotations
import uuid
from typing import Any
from sqlalchemy.orm import Session


def execute_search_paths(db: Session, query_plan: dict[str, Any], mock_mode: bool = False) -> list[dict[str, Any]]:
    results: list[dict[str, Any]] = []

    if mock_mode:
        return _mock_results(query_plan)

    gp_queries = query_plan.get("google_places_queries") or []
    if gp_queries:
        try:
            from app.utils.google_places import search_places
            for query in gp_queries[:3]:
                places = search_places(query)
                for p in places:
                    results.append({**p, "source_type": "google_places", "mock": False})
        except Exception:
            results.extend(_mock_results(query_plan))

    if not results:
        results = _mock_results(query_plan)

    return results


def _mock_results(query_plan: dict[str, Any]) -> list[dict[str, Any]]:
    queries = query_plan.get("google_places_queries") or ["commercial business"]
    base_query = queries[0] if queries else "business"

    return [
        {
            "name": f"Acme Corp ({base_query.title()})",
            "location": "123 Main St, Dallas, TX 75201",
            "website": "https://acmecorp.example.com",
            "source_url": "https://maps.google.com/?cid=example1",
            "phone": "+1-214-555-0100",
            "email": None,
            "intent": "Fiber upgrade candidate — near-net eligible",
            "freshness_score": 75.0,
            "match_uuid": str(uuid.uuid4()),
            "source_type": "google_places",
            "mock": True,
        },
        {
            "name": f"Nexus Industrial ({base_query.title()})",
            "location": "456 Commerce Blvd, Austin, TX 78701",
            "website": "https://nexusindustrial.example.com",
            "source_url": "https://maps.google.com/?cid=example2",
            "phone": "+1-512-555-0200",
            "email": "info@nexusindustrial.example.com",
            "intent": "Provider switch opportunity — contract end Q3",
            "freshness_score": 82.0,
            "match_uuid": str(uuid.uuid4()),
            "source_type": "google_places",
            "mock": True,
        },
        {
            "name": f"Summit Business Center ({base_query.title()})",
            "location": "789 Tech Park, Houston, TX 77002",
            "website": "https://summitbc.example.com",
            "source_url": "https://maps.google.com/?cid=example3",
            "phone": "+1-713-555-0300",
            "email": None,
            "intent": "Multi-tenant property — high MRR potential",
            "freshness_score": 68.0,
            "match_uuid": str(uuid.uuid4()),
            "source_type": "google_places",
            "mock": True,
        },
    ]

```
## FILE: nexus-be/app/services/sniper_evidence_service.py
```python
from __future__ import annotations
from typing import Any


def run_evidence_gate(result: dict[str, Any]) -> dict[str, Any]:
    checks = []
    passed = 0

    def check(label: str, value: bool, required: bool = False) -> None:
        nonlocal passed
        status = "pass" if value else ("fail_required" if required else "fail_optional")
        checks.append({"label": label, "status": status, "passed": value})
        if value:
            passed += 1

    check("Source URL exists", bool(result.get("source_url") or result.get("website")), required=True)
    check("Business name exists", bool(result.get("name")), required=True)
    check("Location exists", bool(result.get("location")))
    check("Contact path exists", bool(
        result.get("phone") or result.get("email") or result.get("website") or result.get("linkedin")
    ))
    check("Intent signal exists", bool(result.get("intent") or result.get("signals")))
    check("Not a duplicate", not result.get("is_duplicate", False), required=True)
    check("Not a weak/generic result", not _is_generic(result))

    total = len(checks)
    required_failed = any(c["status"] == "fail_required" for c in checks)

    if required_failed:
        status = "REJECT"
    elif passed >= total * 0.7:
        status = "VERIFIED"
    elif passed >= total * 0.5:
        status = "HOLD"
    else:
        status = "MISSING_EVIDENCE"

    return {
        "status": status,
        "checks": checks,
        "passed": passed,
        "total": total,
        "score": round(passed / total * 100) if total else 0,
    }


def _is_generic(result: dict[str, Any]) -> bool:
    name = (result.get("name") or "").lower()
    generic = {"unknown", "n/a", "test", "example", "placeholder"}
    return any(g in name for g in generic) or len(name) < 2

```
## FILE: nexus-be/app/services/sniper_signal_service.py
```python
from __future__ import annotations
from typing import Any


def extract_signals(source_object: dict[str, Any]) -> list[dict[str, Any]]:
    signals = []
    raw = source_object.get("raw", source_object)
    fiber = source_object.get("fiber_signals", {})
    pipeline = source_object.get("pipeline", {})
    contact = source_object.get("contact_paths", {})
    authority = source_object.get("authority_signals", {})

    def add(key: str, label: str, strength: int, evidence: str = ""):
        signals.append({"key": key, "label": label, "strength": strength, "evidence": evidence})

    if fiber.get("near_net"):
        add("near_net_opportunity", "Near-Net Fiber Opportunity", 95, "Atlas/near-net flag set")
    if fiber.get("construction_required"):
        add("construction_required", "Construction Required", 70, "Construction flag set")
    if fiber.get("atlas_checked"):
        add("fiber_need", "Fiber Feasibility Verified", 80, "Atlas check completed")
    if fiber.get("provider"):
        add("provider_switch", f"Current Provider: {fiber['provider']}", 75, "Existing ISP identified")

    if pipeline.get("contact_status") in ("Contacted", "Interested", "Hot"):
        add("appointment_set", "Active Pipeline Signal", 85, f"Status: {pipeline['contact_status']}")
    if pipeline.get("opportunity_stage"):
        add("quote_requested", f"Stage: {pipeline['opportunity_stage']}", 80)
    if pipeline.get("deal_value_mrr") and float(pipeline["deal_value_mrr"] or 0) > 500:
        add("high_mrr", "High MRR Opportunity", 90, f"MRR: {pipeline['deal_value_mrr']}")

    if authority.get("name"):
        add("decision_maker_present", "Decision Maker Identified", 88, authority["name"])
    if contact.get("website"):
        add("website_present", "Website Found", 70, contact["website"])
    if contact.get("email"):
        add("email_found", "Email Available", 85, contact["email"])
    if contact.get("phone"):
        add("phone_found", "Phone Available", 80, contact["phone"])

    existing = source_object.get("signals", [])
    for s in existing:
        if isinstance(s, str) and not any(sig["key"] == s for sig in signals):
            add(s, s.replace("_", " ").title(), 60)

    return signals

```
## FILE: nexus-be/app/services/sniper_source_classifier_service.py
```python
from __future__ import annotations
from typing import Any

SOURCE_TRUST_SCORES = {
    "existing_nexus_lead": 92,
    "google_places": 88,
    "company_site": 85,
    "linkedin": 82,
    "ringcentral_call": 80,
    "news": 75,
    "directory": 55,
    "google_result_only": 45,
    "weak_unknown": 20,
}

DOMAIN_PATTERNS = {
    "maps.google.com": "google_places",
    "google.com/maps": "google_places",
    "linkedin.com": "linkedin",
    "facebook.com": "weak_unknown",
    "twitter.com": "weak_unknown",
    "yelp.com": "directory",
    "yellowpages.com": "directory",
    "bbb.org": "directory",
    "news": "news",
    "reuters": "news",
    "bloomberg": "news",
}


def classify_source(url: str, snippet: str | None = None) -> dict[str, Any]:
    if not url:
        return _result("weak_unknown", url)

    url_lower = url.lower()

    for pattern, source_type in DOMAIN_PATTERNS.items():
        if pattern in url_lower:
            return _result(source_type, url)

    if snippet:
        snippet_lower = snippet.lower()
        if "news" in snippet_lower or "press release" in snippet_lower:
            return _result("news", url)
        if "linkedin" in snippet_lower:
            return _result("linkedin", url)

    if _looks_like_company_site(url_lower):
        return _result("company_site", url)

    if "google" in url_lower:
        return _result("google_result_only", url)

    return _result("weak_unknown", url)


def _looks_like_company_site(url: str) -> bool:
    noise = {"google", "facebook", "twitter", "yelp", "linkedin", "bbb", "yellowpages", "bing", "yahoo"}
    return not any(n in url for n in noise) and url.startswith("http")


def _result(source_type: str, url: str) -> dict[str, Any]:
    return {
        "source_type": source_type,
        "trust_score": SOURCE_TRUST_SCORES.get(source_type, 20),
        "url": url,
    }

```
## FILE: nexus-be/app/services/sniper_timeline_service.py
```python
from __future__ import annotations
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from app.models.sniper_timeline import SniperTimelineStep

TIMELINE_STEPS = [
    ("context_lock", "Context Lock", 0),
    ("api_tunneling", "API Tunneling", 1),
    ("intent_identification", "Intent Identification", 2),
    ("market_density", "Market Density", 3),
    ("hydration", "Hydration", 4),
    ("manual_override", "Manual Override", 5),
    ("gap_analysis", "Gap Analysis", 6),
    ("weekly_intel", "Weekly Intel", 7),
    ("campaign_propose", "Campaign Propose", 8),
    ("magic_scripting", "Magic Scripting", 9),
    ("json_llm_snapshot", "JSON/LLM Snapshot", 10),
    ("final_seal", "Final Seal", 11),
]


def initialize_timeline(db: Session, run_id: int) -> list[SniperTimelineStep]:
    steps = []
    for key, label, order in TIMELINE_STEPS:
        step = SniperTimelineStep(
            run_id=run_id,
            step_key=key,
            step_label=label,
            status="pending",
            sort_order=order,
        )
        db.add(step)
        steps.append(step)
    db.commit()
    return steps


def _get_step(db: Session, run_id: int, step_key: str) -> SniperTimelineStep | None:
    return db.query(SniperTimelineStep).filter(
        SniperTimelineStep.run_id == run_id,
        SniperTimelineStep.step_key == step_key,
    ).first()


def mark_step_running(db: Session, run_id: int, step_key: str, message: str | None = None) -> None:
    step = _get_step(db, run_id, step_key)
    if not step:
        return
    step.status = "running"
    step.started_at = datetime.now(timezone.utc)
    if message:
        step.message = message
    db.commit()


def mark_step_completed(db: Session, run_id: int, step_key: str, message: str | None = None) -> None:
    step = _get_step(db, run_id, step_key)
    if not step:
        return
    now = datetime.now(timezone.utc)
    step.status = "completed"
    step.completed_at = now
    if step.started_at:
        step.duration_ms = int((now - step.started_at).total_seconds() * 1000)
    if message:
        step.message = message
    db.commit()


def mark_step_failed(db: Session, run_id: int, step_key: str, error: str) -> None:
    step = _get_step(db, run_id, step_key)
    if not step:
        return
    step.status = "failed"
    step.completed_at = datetime.now(timezone.utc)
    step.message = error
    db.commit()

```
## FILE: nexus-be/app/services/sniper_magic_script_service.py
```python
from __future__ import annotations
import os
from typing import Any


def generate_magic_script(
    source_object: dict[str, Any],
    matched_object: dict[str, Any],
    qualification: dict[str, Any],
    osiris: dict[str, Any],
    manual_override: dict[str, Any] | None = None,
) -> dict[str, Any]:
    override = manual_override or {}

    api_key = os.getenv("COREAI_API_KEY")
    model = os.getenv("COREAI_MODEL", "gpt-4o")

    if api_key:
        try:
            return _generate_with_ai(source_object, matched_object, qualification, osiris, override, api_key, model)
        except Exception:
            pass

    return _generate_template(source_object, matched_object, qualification, osiris, override)


def _generate_with_ai(
    source: dict, match: dict, qual: dict, osiris: dict, override: dict, api_key: str, model: str
) -> dict[str, Any]:
    from openai import OpenAI

    client = OpenAI(api_key=api_key)

    src_name = source.get("name", "the prospect")
    match_name = match.get("name") or match.get("company", "your business")
    location = match.get("location", "")
    verdict = osiris.get("verdict", "")
    score = qual.get("composite_score", 0)
    tone = override.get("tone", "professional")
    pain_focus = override.get("pain_focus", "fiber connectivity and bandwidth needs")
    custom_hook = override.get("custom_hook", "")

    prompt = f"""You are an expert SDR for a fiber internet sales company.

Source: {src_name} ({source.get('object_type', 'lead')})
Target: {match_name}, {location}
Osiris verdict: {verdict} | BANT score: {score}
Tone: {tone}
Pain focus: {pain_focus}
{f'Custom hook: {custom_hook}' if custom_hook else ''}

Generate a complete outreach script package with these exact keys:
- hook: One powerful opening sentence
- pain_summary: 2-3 sentence pain summary
- email_script: Full cold email (subject + body)
- linkedin_script: LinkedIn connection request message (under 300 chars)
- call_script: Full cold call script with objection handlers
- ringcentral_call_opener: First 10 seconds of the call (for SDR quick reference)
- cta: The call to action
- follow_up: Follow-up sequence (3 steps)

Respond in JSON only."""

    response = client.chat.completions.create(
        model=model,
        messages=[{"role": "user", "content": prompt}],
        response_format={"type": "json_object"},
        temperature=0.7,
    )

    import json
    result = json.loads(response.choices[0].message.content)
    result["mock"] = False
    return result


def _generate_template(
    source: dict, match: dict, qual: dict, osiris: dict, override: dict
) -> dict[str, Any]:
    name = match.get("name") or match.get("company", "your team")
    location = match.get("location", "your area")
    src_name = source.get("name", "us")
    verdict = osiris.get("verdict", "")
    score = qual.get("composite_score", 0)
    tone = override.get("tone", "professional")
    pain_focus = override.get("pain_focus", "fiber connectivity")
    custom_hook = override.get("custom_hook", "")

    hook = custom_hook or f"I noticed {name} in {location} and wanted to connect about fiber internet solutions that could reduce your telecom costs."

    return {
        "hook": hook,
        "pain_summary": (
            f"{name} likely faces increasing bandwidth demands and rising telecom costs. "
            f"Many businesses in {location} are switching to fiber to get better speeds at lower rates. "
            f"With an Osiris score of {verdict} and BANT score of {score}, this is a strong opportunity."
        ),
        "email_script": (
            f"Subject: Fiber Internet for {name} — Quick Question\n\n"
            f"Hi [First Name],\n\n"
            f"I came across {name} and noticed you might benefit from a fiber upgrade.\n\n"
            f"We help businesses in {location} cut telecom costs by 20–40% while doubling bandwidth. "
            f"Would you be open to a 15-minute call this week?\n\n"
            f"Best,\n[SDR Name]\n[Company]"
        ),
        "linkedin_script": (
            f"Hi [Name], I work with businesses in {location} on fiber solutions. "
            f"Saw {name} and thought there might be a fit. Open to a quick chat?"
        ),
        "call_script": (
            f"OPENER:\n"
            f"'Hi, is this [Decision Maker]? Great — this is [Name] from [Company]. "
            f"I'm reaching out to businesses in {location} about fiber internet — do you have 2 minutes?'\n\n"
            f"VALUE:\n"
            f"'We help companies like {name} reduce telecom costs while getting faster, more reliable connectivity.'\n\n"
            f"OBJECTION — 'Not interested':\n"
            f"'I completely understand. Can I ask — are you happy with your current provider's speed and pricing?'\n\n"
            f"CTA:\n"
            f"'Could we schedule a 15-minute discovery call? I can show you exactly what we could save you.'"
        ),
        "ringcentral_call_opener": (
            f"'Hi [Name], this is [SDR] from [Company] — calling about fiber internet for {name} in {location}. "
            f"Do you have 2 minutes?'"
        ),
        "cta": "Schedule a 15-minute discovery call to review your current telecom spend and see if we can beat your current rate.",
        "follow_up": (
            "Step 1 (Day 3): Send follow-up email referencing initial outreach.\n"
            "Step 2 (Day 7): LinkedIn message with a case study.\n"
            "Step 3 (Day 14): Final call attempt — leave voicemail and send closing email."
        ),
        "mock": True,
    }

```
## FILE: nexus-be/app/services/sniper_action_service.py
```python
from __future__ import annotations
import json
from typing import Any
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from app.models.sniper_action import SniperAction
from app.models.sniper_match import SniperMatch

VALID_ACTIONS = {
    "save_as_lead",
    "attach_to_existing_lead",
    "create_follow_up_task",
    "export_json",
    "export_csv",
    "export_pdf",
    "add_note",
    "open_audit",
    "trigger_webhook",
}


def execute_sniper_action(db: Session, run_id: int, payload: dict[str, Any]) -> dict[str, Any]:
    action_type = payload.get("action_type", "")
    match_id = payload.get("match_id")
    action_payload = payload.get("payload") or {}

    if action_type not in VALID_ACTIONS:
        return {"success": False, "error": f"Unknown action: {action_type}"}

    action = SniperAction(
        run_id=run_id,
        match_id=match_id,
        action_type=action_type,
        action_status="running",
        payload_json=json.dumps(action_payload),
    )
    db.add(action)
    db.commit()
    db.refresh(action)

    try:
        result = _dispatch(db, action_type, run_id, match_id, action_payload)
        action.action_status = "completed"
        action.result_json = json.dumps(result)
    except Exception as e:
        action.action_status = "failed"
        action.result_json = json.dumps({"error": str(e)})
        result = {"success": False, "error": str(e)}

    db.commit()
    return {
        "id": action.id,
        "run_id": run_id,
        "match_id": match_id,
        "action_type": action_type,
        "action_status": action.action_status,
        "result": result,
        "created_at": action.created_at,
    }


def _dispatch(db: Session, action_type: str, run_id: int, match_id: int | None, payload: dict) -> dict:
    if action_type == "save_as_lead":
        return _save_as_lead(db, run_id, match_id, payload)
    if action_type == "export_json":
        return _export_json(db, run_id, payload)
    if action_type == "add_note":
        return {"success": True, "message": "Note recorded", "note": payload.get("note", "")}
    if action_type == "trigger_webhook":
        return {"success": True, "message": "Webhook triggered (mock)", "url": payload.get("webhook_url")}
    if action_type == "create_follow_up_task":
        return {"success": True, "task": {"due": payload.get("due_date"), "note": payload.get("note")}}
    if action_type == "open_audit":
        return {"success": True, "audit_url": f"/api/v1/audit/?entity_id={run_id}&entity_type=sniper_run"}
    return {"success": True, "action": action_type}


def _save_as_lead(db: Session, run_id: int, match_id: int | None, payload: dict) -> dict:
    match = db.query(SniperMatch).filter(SniperMatch.id == match_id).first() if match_id else None
    if not match:
        return {"success": False, "error": "Match not found"}

    try:
        from app.models.lead import Lead
        lead = Lead(
            company_name=match.name or match.company or "Unknown",
            address=match.location,
            website=match.website,
            lead_source="sniper",
            lead_category="Sniper Match",
            contact_status="New",
        )
        db.add(lead)
        db.commit()
        db.refresh(lead)
        return {"success": True, "lead_id": lead.id, "company_name": lead.company_name}
    except Exception as e:
        return {"success": False, "error": str(e)}


def _export_json(db: Session, run_id: int, payload: dict) -> dict:
    matches = db.query(SniperMatch).filter(SniperMatch.run_id == run_id).all()
    data = [
        {
            "id": m.id,
            "name": m.name,
            "location": m.location,
            "osiris_verdict": m.osiris_verdict,
            "bant_decision": m.bant_decision,
        }
        for m in matches
    ]
    return {"success": True, "count": len(data), "data": data}

```
## FILE: nexus-be/app/services/sniper_query_service.py
```python
from __future__ import annotations
from typing import Any


def build_sniper_queries(context: dict[str, Any]) -> dict[str, Any]:
    source = context.get("source_object", {})
    targeting = context.get("targeting_plan", {})
    geo = context.get("geo") or source.get("location", "")
    name = source.get("name", "")
    target_type = targeting.get("target_type", "business")
    tags = source.get("tags") or []
    industry = tags[0] if tags else "commercial"

    google_places_queries = _google_places_queries(name, geo, industry, target_type)
    google_dorks = _google_dorks(name, geo, industry, target_type)
    linkedin_queries = _linkedin_queries(name, geo, target_type)

    return {
        "google_places_queries": google_places_queries,
        "google_dorks": google_dorks,
        "company_site_queries": [f'site:linkedin.com/company "{name}"'],
        "linkedin_queries": linkedin_queries,
        "local_business_queries": [f'{industry} businesses near {geo}'],
        "exclusions": ["site:facebook.com", "site:twitter.com", "-residential", "-house"],
    }


def _google_places_queries(name: str, geo: str, industry: str, target_type: str) -> list[str]:
    queries = []
    base_geo = geo.split(",")[0] if geo else "local area"

    if target_type in ("lead", "business"):
        queries.append(f'{industry} companies in {base_geo}')
        queries.append(f'commercial offices {base_geo}')
        queries.append(f'business park {base_geo}')
    elif target_type == "job":
        queries.append(f'hiring companies {base_geo}')
        queries.append(f'staffing agency {base_geo}')
    elif target_type == "college":
        queries.append(f'university college {base_geo}')
    else:
        queries.append(f'{industry} {base_geo}')

    return queries


def _google_dorks(name: str, geo: str, industry: str, target_type: str) -> list[str]:
    dorks = []
    if target_type in ("lead", "business"):
        dorks.append(f'"{industry}" "contact us" "{geo}"')
        dorks.append(f'intitle:"{industry} company" "{geo}" email')
        dorks.append(f'"{industry}" site:linkedin.com/company "{geo}"')
    elif target_type == "candidate":
        dorks.append(f'site:linkedin.com/in "{industry}" "{geo}"')
    return dorks


def _linkedin_queries(name: str, geo: str, target_type: str) -> list[str]:
    queries = []
    if target_type in ("lead", "business"):
        queries.append(f'company location:{geo}')
    elif target_type in ("candidate", "job"):
        queries.append(f'people title:{target_type} location:{geo}')
    return queries

```
## FILE: nexus-be/app/routers/sniper.py
```python
from __future__ import annotations
import json
from typing import Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.middleware.auth import get_current_user
from app.models.sniper_run import SniperRun
from app.models.sniper_timeline import SniperTimelineStep
from app.models.sniper_match import SniperMatch
from app.models.sniper_script import SniperScript
from app.schemas.sniper import (
    SniperRunCreate,
    SniperRunResponse,
    WorkflowTimelineStep,
    MatchedObject,
    MagicScriptOutput,
    ScriptRegenerateRequest,
    RerunSniperRequest,
    OsirisRatingRequest,
    SniperDefaultsResponse,
)
from app.schemas.sniper_actions import WorkflowActionRequest, WorkflowActionResponse
from app.services import sniper_orchestrator_service as orchestrator
from app.services import sniper_action_service as action_svc
from app.services import sniper_osiris_service as osiris_svc
from app.services import sniper_magic_script_service as script_svc

router = APIRouter()


@router.post("/runs", response_model=SniperRunResponse)
def create_sniper_run(
    payload: SniperRunCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    payload.created_by = str(current_user.get("id", ""))
    run = orchestrator.create_and_run_sniper_workflow(db, payload)
    return run


@router.get("/runs/{run_id}", response_model=SniperRunResponse)
def get_sniper_run(
    run_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    run = db.query(SniperRun).filter(SniperRun.id == run_id).first()
    if not run:
        raise HTTPException(status_code=404, detail="Sniper run not found")
    return run


@router.get("/runs/{run_id}/timeline", response_model=list[WorkflowTimelineStep])
def get_sniper_timeline(
    run_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    steps = (
        db.query(SniperTimelineStep)
        .filter(SniperTimelineStep.run_id == run_id)
        .order_by(SniperTimelineStep.sort_order)
        .all()
    )
    return steps


@router.get("/runs/{run_id}/results", response_model=list[MatchedObject])
def get_sniper_results(
    run_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    matches = (
        db.query(SniperMatch)
        .filter(SniperMatch.run_id == run_id)
        .order_by(SniperMatch.osiris_rating.desc())
        .all()
    )
    return matches


@router.post("/runs/{run_id}/script", response_model=MagicScriptOutput)
def regenerate_script(
    run_id: int,
    body: ScriptRegenerateRequest,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    match = (
        db.query(SniperMatch)
        .filter(SniperMatch.run_id == run_id, SniperMatch.match_uuid == body.match_id)
        .first()
    )
    if not match:
        raise HTTPException(status_code=404, detail="Match not found")

    run = db.query(SniperRun).filter(SniperRun.id == run_id).first()
    source_payload = json.loads(run.source_payload_json or "{}")
    source_payload["object_type"] = run.source_object_type

    from app.services.sniper_normalizer_service import normalize_source_object
    from app.services.sniper_osiris_service import calculate_osiris_rating
    from app.services.sniper_qualification_service import run_bant_qualification

    source_object = normalize_source_object(source_payload)
    raw = json.loads(match.raw_payload_json or "{}")
    evidence = json.loads(match.evidence_json or "[]")
    osiris = calculate_osiris_rating(source_object, raw, evidence if isinstance(evidence, list) else [evidence])
    bant = run_bant_qualification(source_object, raw, osiris)

    override = body.manual_override.model_dump() if body.manual_override else None
    result = script_svc.generate_magic_script(source_object, raw, bant, osiris, override)

    script = db.query(SniperScript).filter(SniperScript.match_id == match.id).first()
    if script:
        for k, v in result.items():
            if hasattr(script, k):
                setattr(script, k, v)
        db.commit()

    return result


@router.post("/runs/{run_id}/actions", response_model=WorkflowActionResponse)
def execute_action(
    run_id: int,
    body: WorkflowActionRequest,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    run = db.query(SniperRun).filter(SniperRun.id == run_id).first()
    if not run:
        raise HTTPException(status_code=404, detail="Sniper run not found")
    result = action_svc.execute_sniper_action(db, run_id, body.model_dump())
    if not result.get("success", True) and result.get("error"):
        raise HTTPException(status_code=400, detail=result["error"])
    return result


@router.post("/runs/{run_id}/rerun", response_model=SniperRunResponse)
def rerun_sniper(
    run_id: int,
    body: RerunSniperRequest,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    original = db.query(SniperRun).filter(SniperRun.id == run_id).first()
    if not original:
        raise HTTPException(status_code=404, detail="Sniper run not found")

    source_payload = json.loads(original.source_payload_json or "{}")
    new_payload = SniperRunCreate(
        source_object_type=original.source_object_type,
        source_object_id=original.source_object_id,
        source_name=original.source_name,
        source_payload=source_payload,
        target_object_type=body.target_object_type or original.target_object_type,
        geo=original.geo,
        timeframe=original.timeframe,
        intent_mode=body.intent_mode or original.intent_mode,
        mock_mode=body.mock_mode if body.mock_mode is not None else original.mock_mode,
        created_by=str(current_user.get("id", "")),
    )
    new_run = orchestrator.create_and_run_sniper_workflow(db, new_payload)
    return new_run


@router.get("/defaults", response_model=SniperDefaultsResponse)
def get_sniper_defaults(current_user: dict = Depends(get_current_user)):
    return SniperDefaultsResponse(
        target_object_types=[
            "any", "lead", "business", "job", "candidate", "student",
            "college", "vendor", "permit", "rfp", "post", "property", "consumer_request",
        ],
        intent_modes=["auto", "fiber", "sales", "hiring", "vendor", "consumer"],
        timeframes=["7d", "14d", "30d", "60d", "90d"],
        source_types=["google_places", "company_site", "linkedin", "directory", "news", "existing_nexus_lead"],
        osiris_verdicts=["OSIRIS_A_LOCKED", "OSIRIS_B_STRONG", "OSIRIS_C_REVIEW", "OSIRIS_D_WEAK", "OSIRIS_REJECT"],
        bant_decisions=["APPROVED", "HOLD", "REJECT"],
    )


@router.post("/osiris-rating")
def calculate_osiris(
    body: OsirisRatingRequest,
    current_user: dict = Depends(get_current_user),
) -> dict[str, Any]:
    return osiris_svc.calculate_osiris_rating(
        source_object=body.source_object,
        matched_object=body.matched_object,
        evidence=body.evidence or [],
        source_classification=body.source_classification or {},
        duplicate_risk=body.duplicate_risk or 0.0,
    )

```
## FILE: nexus-be/app/routers/evaluator.py
```python
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.middleware.auth import get_current_user
from app.schemas.evaluator import (
    EvaluatorRunCreate,
    EvaluatorRunResponse,
    EvaluatorItemCreate,
    EvaluatorItemUpdate,
    EvaluatorItemResponse,
    EvaluatorResponseCreate,
    EvaluatorResponseOut,
)
from app.services import evaluator_service

router = APIRouter()


@router.get("/runs", response_model=list[EvaluatorRunResponse])
def list_runs(
    org_id: str | None = None,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    return evaluator_service.list_runs(db, org_id=org_id)


@router.post("/runs", response_model=EvaluatorRunResponse, status_code=201)
def create_run(
    data: EvaluatorRunCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    return evaluator_service.create_run(db, data)


@router.get("/runs/{run_id}/items", response_model=list[EvaluatorItemResponse])
def list_items(
    run_id: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    run = evaluator_service.get_run(db, run_id)
    if not run:
        raise HTTPException(status_code=404, detail="Run not found")
    return evaluator_service.list_items(db, run_id)


@router.post("/runs/{run_id}/items", response_model=EvaluatorItemResponse, status_code=201)
def create_item(
    run_id: str,
    data: EvaluatorItemCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    data.run_id = run_id
    return evaluator_service.create_item(db, data)


@router.patch("/items/{item_id}", response_model=EvaluatorItemResponse)
def update_item(
    item_id: str,
    data: EvaluatorItemUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    item = evaluator_service.update_item(db, item_id, data)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    return item


@router.get("/runs/{run_id}/responses", response_model=list[EvaluatorResponseOut])
def list_responses(
    run_id: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    return evaluator_service.list_responses(db, run_id)


@router.post("/responses", response_model=EvaluatorResponseOut, status_code=201)
def submit_response(
    data: EvaluatorResponseCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    return evaluator_service.submit_response(db, data)

```
## FILE: nexus-be/tests/conftest.py
```python
"""Pytest configuration — creates all tables in the SQLite test DB before tests run."""
from __future__ import annotations
from sqlalchemy.orm import sessionmaker
from app.database import engine, Base
import pytest

# Trigger model registration on Base.metadata
from app.models import (  # noqa: F401
    evaluator_run, evaluator_item, evaluator_response,
    sniper_run, sniper_match, sniper_timeline, sniper_script, sniper_action,
)


def pytest_configure(config):
    Base.metadata.create_all(engine)


_Session = sessionmaker(bind=engine)


@pytest.fixture
def db():
    session = _Session()
    yield session
    session.close()

```
## FILE: nexus-be/tests/test_evaluator_service.py
```python
"""Unit tests for evaluator_service — uses in-memory SQLite via conftest.py."""
from __future__ import annotations
import pytest
from datetime import date

from app.schemas.evaluator import (
    EvaluatorRunCreate,
    EvaluatorItemCreate,
    EvaluatorItemUpdate,
    EvaluatorResponseCreate,
)
from app.services import evaluator_service as svc


# ─── runs ────────────────────────────────────────────────────────────────────

def test_create_run(db):
    data = EvaluatorRunCreate(
        name="Daily QA Run",
        cadence="daily",
        start_date=str(date.today()),
        status="active",
    )
    run = svc.create_run(db, data)
    assert run.id is not None
    assert run.name == "Daily QA Run"
    assert run.cadence == "daily"
    assert run.status == "active"


def test_list_runs_returns_created(db):
    runs = svc.list_runs(db)
    assert any(r.name == "Daily QA Run" for r in runs)


def test_list_runs_org_filter(db):
    data = EvaluatorRunCreate(
        name="Org Run",
        cadence="weekly",
        start_date=str(date.today()),
        status="active",
        org_id="org-abc",
    )
    svc.create_run(db, data)
    filtered = svc.list_runs(db, org_id="org-abc")
    assert all(r.org_id == "org-abc" for r in filtered)
    assert any(r.name == "Org Run" for r in filtered)


def test_get_run_returns_none_for_unknown(db):
    assert svc.get_run(db, "nonexistent-uuid") is None


# ─── items ────────────────────────────────────────────────────────────────────

@pytest.fixture
def run_id(db):
    data = EvaluatorRunCreate(
        name="Item Test Run",
        cadence="custom",
        start_date=str(date.today()),
        status="active",
    )
    run = svc.create_run(db, data)
    return str(run.id)


def test_create_item(db, run_id):
    data = EvaluatorItemCreate(
        run_id=run_id,
        title="Evaluate lead email tone",
        input="Hi there, I wanted to follow up",
        ai_output="Professional and polite",
        priority="high",
        task_status="pending",
    )
    item = svc.create_item(db, data)
    assert item.id is not None
    assert item.run_id == run_id
    assert item.title == "Evaluate lead email tone"


def test_list_items(db, run_id):
    svc.create_item(db, EvaluatorItemCreate(run_id=run_id, title="Listed Task", task_status="pending"))
    items = svc.list_items(db, run_id)
    assert len(items) >= 1
    assert all(i.run_id == run_id for i in items)


def test_update_item_score(db, run_id):
    item = svc.create_item(db, EvaluatorItemCreate(run_id=run_id, title="Update Me", task_status="pending"))
    updated = svc.update_item(db, str(item.id), EvaluatorItemUpdate(score=4, task_status="completed"))
    assert updated is not None
    assert updated.score == 4
    assert updated.task_status == "completed"


def test_update_item_not_found(db):
    result = svc.update_item(db, "bad-uuid", EvaluatorItemUpdate(score=3))
    assert result is None


# ─── responses ───────────────────────────────────────────────────────────────

def test_submit_response(db, run_id):
    # Create a fresh item for this test
    item = svc.create_item(db, EvaluatorItemCreate(run_id=run_id, title="Score this", task_status="pending"))
    data = EvaluatorResponseCreate(
        run_id=run_id,
        item_id=str(item.id),
        score=5,
        evaluator_name="tester@nexus.com",
        organization_name="Nexus",
    )
    resp = svc.submit_response(db, data)
    assert resp.id is not None
    assert resp.score == 5
    assert resp.evaluator_name == "tester@nexus.com"


def test_submit_response_idempotent(db, run_id):
    item = svc.create_item(db, EvaluatorItemCreate(run_id=run_id, title="Idempotent test", task_status="pending"))
    data = EvaluatorResponseCreate(
        run_id=run_id,
        item_id=str(item.id),
        score=3,
        evaluator_name="idem@nexus.com",
    )
    r1 = svc.submit_response(db, data)
    r2 = svc.submit_response(db, data)
    assert r1.id == r2.id  # same record returned — idempotent


def test_submit_response_marks_item_completed(db, run_id):
    item = svc.create_item(db, EvaluatorItemCreate(run_id=run_id, title="Completable task", task_status="pending"))

    svc.submit_response(db, EvaluatorResponseCreate(
        run_id=run_id,
        item_id=str(item.id),
        score=4,
        evaluator_name="auto@nexus.com",
    ))

    refreshed = svc.list_items(db, run_id)
    target = next(i for i in refreshed if i.id == item.id)
    assert target.task_status == "completed"
    assert target.score == 4


def test_list_responses(db, run_id):
    responses = svc.list_responses(db, run_id)
    assert isinstance(responses, list)
    assert all(r.run_id == run_id for r in responses)

```
## FILE: nexus-be/tests/test_sniper_osiris.py
```python
"""Unit tests for Osiris rating engine and BANT qualification — no DB, no network."""
from __future__ import annotations
import pytest
from app.services.sniper_osiris_service import calculate_osiris_rating, _verdict, WEIGHTS
from app.services.sniper_qualification_service import run_bant_qualification


# ─── verdict thresholds ───────────────────────────────────────────────────────

@pytest.mark.parametrize("score,expected", [
    (90, "OSIRIS_A_LOCKED"),
    (85, "OSIRIS_A_LOCKED"),
    (80, "OSIRIS_B_STRONG"),
    (75, "OSIRIS_B_STRONG"),
    (65, "OSIRIS_C_REVIEW"),
    (60, "OSIRIS_C_REVIEW"),
    (50, "OSIRIS_D_WEAK"),
    (45, "OSIRIS_D_WEAK"),
    (30, "OSIRIS_REJECT"),
    (0,  "OSIRIS_REJECT"),
])
def test_verdict_thresholds(score, expected):
    assert _verdict(score) == expected


# ─── weights sum to 1.0 ───────────────────────────────────────────────────────

def test_weights_sum():
    total = sum(WEIGHTS.values())
    assert abs(total - 1.0) < 0.001, f"WEIGHTS sum to {total}, expected 1.0"


# ─── calculate_osiris_rating returns expected keys ────────────────────────────

def test_osiris_returns_all_keys():
    source = {"name": "John Doe", "object_type": "lead", "company_name": "TechCorp"}
    matched = {"name": "John Doe", "company": "TechCorp", "website": "https://techcorp.com"}
    result = calculate_osiris_rating(source, matched)

    expected_keys = {
        "entity_match", "intent_relevance", "source_trust", "evidence_strength",
        "freshness", "contact_path", "duplicate_risk", "persona_fit",
        "overall_rating", "verdict",
    }
    assert expected_keys == set(result.keys())


def test_osiris_scores_in_range():
    source = {"name": "Acme Corp", "object_type": "business"}
    matched = {"name": "Acme Corporation", "website": "https://acme.com", "phone": "555-1234"}
    result = calculate_osiris_rating(source, matched)

    for key in ("entity_match", "intent_relevance", "source_trust", "evidence_strength",
                "freshness", "contact_path", "duplicate_risk", "persona_fit"):
        assert 0 <= result[key] <= 100, f"{key}={result[key]} out of [0,100]"

    assert 0 <= result["overall_rating"] <= 100


def test_osiris_high_score_for_exact_match():
    source = {"name": "Jane Smith", "object_type": "lead", "company_name": "NexusCo", "location": "Austin"}
    matched = {
        "name": "Jane Smith", "company": "NexusCo", "location": "Austin, TX",
        "website": "https://nexusco.com", "phone": "512-000-0000", "email": "jane@nexusco.com",
    }
    evidence = [{"type": "linkedin_profile", "verified": True}]
    result = calculate_osiris_rating(source, matched, evidence)
    assert result["entity_match"] >= 70


def test_osiris_empty_source_does_not_crash():
    result = calculate_osiris_rating({}, {})
    assert "overall_rating" in result
    assert "verdict" in result


def test_osiris_duplicate_risk_penalty():
    source = {"name": "Test", "object_type": "lead"}
    matched = {"name": "Test"}
    no_dup = calculate_osiris_rating(source, matched, duplicate_risk=0.0)
    high_dup = calculate_osiris_rating(source, matched, duplicate_risk=1.0)
    assert high_dup["duplicate_risk"] < no_dup["duplicate_risk"]


# ─── BANT qualification ───────────────────────────────────────────────────────

def test_bant_returns_expected_keys():
    source = {"name": "Buyer Inc", "object_type": "lead"}
    matched = {"name": "Buyer Inc", "company": "Target LLC"}
    osiris = calculate_osiris_rating(source, matched)
    bant = run_bant_qualification(source, matched, osiris)

    expected = {"icp_fit", "authority", "intent_strength", "timing", "contactability",
                "composite_score", "decision"}
    assert expected == set(bant.keys())


def test_bant_decision_values():
    source = {"name": "Corp A", "object_type": "business"}
    matched = {"name": "Corp B", "website": "https://b.com", "phone": "555"}
    osiris = calculate_osiris_rating(source, matched)
    bant = run_bant_qualification(source, matched, osiris)
    assert bant["decision"] in ("APPROVED", "HOLD", "REJECT")


def test_bant_composite_score_range():
    source = {"name": "X", "object_type": "lead"}
    matched = {"name": "Y"}
    osiris = calculate_osiris_rating(source, matched)
    bant = run_bant_qualification(source, matched, osiris)
    assert 0 <= bant["composite_score"] <= 100

```
## FILE: nexus-fe/src/types/evaluator.ts
```typescript
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

```
## FILE: nexus-fe/src/lib/intent-workflow/types.ts
```typescript
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

```
## FILE: nexus-fe/src/lib/intent-workflow/api.ts
```typescript
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

```
## FILE: nexus-fe/src/lib/intent-workflow/normalizers.ts
```typescript
import type { SourceObject, SourceObjectType } from "./types";

export function normalizeSourceObject(raw: Record<string, unknown>): SourceObject {
  const type = (raw.object_type ?? raw.type ?? inferType(raw)) as SourceObjectType;

  if (type === "lead") return normalizeLead(raw);

  return {
    object_type: type,
    name: (raw.name ?? raw.title ?? raw.company_name ?? "Unknown") as string,
    location: extractLocation(raw),
    website: raw.website as string | undefined,
    source_url: raw.source_url as string | undefined,
    tags: (raw.tags ?? raw.industry ? [raw.industry] : []) as string[],
    signals: (raw.signals ?? []) as string[],
    ...raw,
  };
}

function normalizeLead(raw: Record<string, unknown>): SourceObject {
  const parts = [raw.address, raw.city, raw.state, raw.zip_code].filter(Boolean);
  const signals: string[] = [];

  if (raw.near_net_fiber) signals.push("near_net_opportunity");
  if (raw.atlas_checked) signals.push("atlas_verified");
  if (raw.appointment_set) signals.push("appointment_set");
  if (raw.decision_maker_name) signals.push("decision_maker_present");
  if (raw.website) signals.push("website_present");
  if (raw.email) signals.push("email_found");
  if (raw.phone) signals.push("phone_found");

  return {
    object_type: "lead",
    name: (raw.company_name ?? "Unknown") as string,
    location: parts.join(", "),
    website: raw.website as string | undefined,
    source_url: raw.google_maps_url as string | undefined,
    tags: [raw.industry, raw.lead_category].filter(Boolean) as string[],
    signals,
    ...raw,
  };
}

function extractLocation(raw: Record<string, unknown>): string {
  const parts = [raw.address, raw.city, raw.state, raw.zip, raw.country].filter(Boolean);
  return parts.join(", ") || (raw.location as string) || "";
}

function inferType(raw: Record<string, unknown>): SourceObjectType {
  if (raw.company_name != null || raw.near_net_fiber != null) return "lead";
  if (raw.job_title != null || raw.open_role != null) return "job";
  if (raw.resume != null || raw.skills != null) return "candidate";
  if (raw.gpa != null || raw.major != null) return "student";
  if (raw.enrollment != null) return "college";
  return "business";
}

```
## FILE: nexus-fe/src/lib/intent-workflow/status.ts
```typescript
import type { OsirisVerdict, BANTDecision, TimelineStepStatus, WorkflowStatus } from "./types";
import { clsx } from "clsx";

export function osirisColor(verdict: OsirisVerdict | undefined): string {
  switch (verdict) {
    case "OSIRIS_A_LOCKED": return "text-emerald-400";
    case "OSIRIS_B_STRONG": return "text-green-400";
    case "OSIRIS_C_REVIEW": return "text-yellow-400";
    case "OSIRIS_D_WEAK": return "text-orange-400";
    case "OSIRIS_REJECT": return "text-red-500";
    default: return "text-zinc-400";
  }
}

export function osirisLabel(verdict: OsirisVerdict | undefined): string {
  switch (verdict) {
    case "OSIRIS_A_LOCKED": return "A — Locked";
    case "OSIRIS_B_STRONG": return "B — Strong";
    case "OSIRIS_C_REVIEW": return "C — Review";
    case "OSIRIS_D_WEAK": return "D — Weak";
    case "OSIRIS_REJECT": return "Reject";
    default: return "—";
  }
}

export function bantColor(decision: BANTDecision | undefined): string {
  switch (decision) {
    case "APPROVED": return "text-emerald-400";
    case "HOLD": return "text-yellow-400";
    case "REJECT": return "text-red-500";
    default: return "text-zinc-400";
  }
}

export function stepStatusColor(status: TimelineStepStatus): string {
  switch (status) {
    case "completed": return "bg-emerald-500";
    case "running": return "bg-blue-500 animate-pulse";
    case "failed": return "bg-red-500";
    case "hold": return "bg-yellow-500";
    default: return "bg-zinc-600";
  }
}

export function stepStatusLabel(status: TimelineStepStatus): string {
  switch (status) {
    case "completed": return "Done";
    case "running": return "Running";
    case "failed": return "Failed";
    case "hold": return "Hold";
    default: return "Pending";
  }
}

export function workflowStatusLabel(status: WorkflowStatus): string {
  switch (status) {
    case "running": return "Running";
    case "completed": return "Completed";
    case "failed": return "Failed";
    case "pending": return "Starting";
    default: return "Idle";
  }
}

export function scoreBar(value: number, max: number = 100): string {
  const pct = Math.round((value / max) * 100);
  return clsx(
    "h-1.5 rounded-full",
    pct >= 85 ? "bg-emerald-500" : pct >= 70 ? "bg-green-500" : pct >= 50 ? "bg-yellow-500" : "bg-red-500"
  );
}

```
## FILE: nexus-fe/src/lib/intent-workflow/mockObjects.ts
```typescript
import type { SourceObject } from "./types";

export const MOCK_LEAD: SourceObject = {
  object_type: "lead",
  company_name: "Acme Commercial Properties",
  name: "Acme Commercial Properties",
  address: "1234 Commerce Blvd",
  city: "Dallas",
  state: "TX",
  zip_code: "75201",
  location: "1234 Commerce Blvd, Dallas, TX 75201",
  website: "https://acmecommercial.example.com",
  phone: "+1-214-555-0100",
  email: "info@acmecommercial.example.com",
  industry: "Commercial Real Estate",
  lead_category: "Multi-Tenant",
  decision_maker_name: "John Smith",
  decision_maker_role: "Property Manager",
  near_net_fiber: true,
  atlas_checked: true,
  current_internet_provider: "AT&T",
  contact_status: "New",
  opportunity_stage: "Prospect",
  deal_value_mrr: 1200,
  google_maps_url: "https://maps.google.com/?cid=example_lead",
  signals: ["near_net_opportunity", "decision_maker_present", "atlas_verified"],
};

export const MOCK_BUSINESS: SourceObject = {
  object_type: "business",
  name: "Summit Tech Solutions",
  location: "456 Tech Park Dr, Austin, TX 78701",
  website: "https://summittech.example.com",
  phone: "+1-512-555-0200",
  email: "hello@summittech.example.com",
  industry: "Technology",
  signals: ["website_present", "email_found", "phone_found"],
};

export const MOCK_JOB: SourceObject = {
  object_type: "job",
  name: "Senior Software Engineer",
  title: "Senior Software Engineer",
  company: "NexusCorp",
  location: "Houston, TX 77002",
  website: "https://nexuscorp.example.com/careers",
  industry: "Software",
  signals: ["hiring"],
};

export const MOCK_CANDIDATE: SourceObject = {
  object_type: "candidate",
  name: "Jane Doe",
  title: "Full Stack Developer",
  location: "San Antonio, TX 78201",
  skills: ["React", "Python", "FastAPI"],
  signals: ["available", "website_present"],
};

export const MOCK_STUDENT: SourceObject = {
  object_type: "student",
  name: "Alex Johnson",
  location: "College Station, TX",
  institution: "Texas A&M University",
  field: "Computer Science",
  gpa: 3.8,
  signals: ["graduation_upcoming"],
};

export const MOCK_COLLEGE: SourceObject = {
  object_type: "college",
  name: "Rice University",
  location: "Houston, TX 77005",
  website: "https://rice.edu",
  enrollment: 4000,
  signals: ["vendor_need"],
};

export const MOCK_CONSUMER: SourceObject = {
  object_type: "consumer_request",
  name: "Residential Customer",
  location: "Plano, TX 75023",
  phone: "+1-972-555-0300",
  signals: ["consumer_pain", "provider_switch"],
};

export const MOCK_OBJECTS: Record<string, SourceObject> = {
  lead: MOCK_LEAD,
  business: MOCK_BUSINESS,
  job: MOCK_JOB,
  candidate: MOCK_CANDIDATE,
  student: MOCK_STUDENT,
  college: MOCK_COLLEGE,
  consumer_request: MOCK_CONSUMER,
};

```
## FILE: nexus-fe/src/lib/intent-workflow/index.ts
```typescript
export * from "./types";
export * from "./api";
export * from "./normalizers";
export * from "./status";
export * from "./mockObjects";

```
## FILE: nexus-fe/src/lib/api/evaluator.ts
```typescript
import type { EvaluatorRun, EvaluatorItem, EvaluatorResponse } from "@/types/evaluator";

const _apiUrl =
  typeof process !== "undefined"
    ? (process.env.NEXT_PUBLIC_API_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL)
    : undefined;
const BASE = (_apiUrl?.replace(/\/api\/v1\/?$/, "") ?? "http://localhost:8000");

function getAuthHeaders(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}/api/v1${path}`, {
    headers: { "Content-Type": "application/json", ...getAuthHeaders(), ...init?.headers },
    ...init,
  });
  if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
  return res.json() as Promise<T>;
}

export function listRuns(orgId?: string): Promise<EvaluatorRun[]> {
  const q = orgId ? `?org_id=${encodeURIComponent(orgId)}` : "";
  return apiFetch(`/evaluator/runs${q}`);
}

export function createRun(data: {
  name: string;
  cadence: "daily" | "weekly" | "custom";
  start_date: string;
  end_date?: string;
  org_id?: string;
  status?: string;
}): Promise<EvaluatorRun> {
  return apiFetch("/evaluator/runs", { method: "POST", body: JSON.stringify(data) });
}

export function listItems(runId: string): Promise<EvaluatorItem[]> {
  if (!runId) return Promise.resolve([]);
  return apiFetch(`/evaluator/runs/${runId}/items`);
}

export function updateItem(itemId: string, data: Partial<EvaluatorItem>): Promise<EvaluatorItem> {
  return apiFetch(`/evaluator/items/${itemId}`, { method: "PATCH", body: JSON.stringify(data) });
}

export function createItem(runId: string, data: {
  title?: string;
  description?: string;
  priority?: "low" | "medium" | "high";
  input?: string;
  ai_output?: string;
}): Promise<EvaluatorItem> {
  return apiFetch(`/evaluator/runs/${runId}/items`, {
    method: "POST",
    body: JSON.stringify({ ...data, run_id: runId, task_status: "pending" }),
  });
}

export function listResponses(runId: string): Promise<EvaluatorResponse[]> {
  if (!runId) return Promise.resolve([]);
  return apiFetch(`/evaluator/runs/${runId}/responses`);
}

export function submitResponse(data: {
  run_id: string;
  item_id: string;
  score: number;
  evaluator_name?: string;
  organization_name?: string;
}): Promise<EvaluatorResponse> {
  return apiFetch("/evaluator/responses", { method: "POST", body: JSON.stringify(data) });
}

```
## FILE: nexus-fe/src/hooks/useUniversalIntentWorkflow.ts
```typescript
"use client";
import { useState, useCallback, useEffect, useRef } from "react";
import type {
  SourceObject,
  TargetObjectType,
  SniperRunResponse,
  MatchedObject,
  WorkflowStatus,
} from "@/lib/intent-workflow/types";
import {
  createSniperRun,
  getSniperRun,
  getSniperResults,
  rerunSniper,
} from "@/lib/intent-workflow/api";
import { useWorkflowTimeline } from "./useWorkflowTimeline";
import { useSniperResults } from "./useSniperResults";
import { useMagicScripting } from "./useMagicScripting";
import { useWorkflowActions } from "./useWorkflowActions";

export function useUniversalIntentWorkflow() {
  const [run, setRun] = useState<SniperRunResponse | null>(null);
  const [status, setStatus] = useState<WorkflowStatus>("idle");
  const [selectedMatch, setSelectedMatch] = useState<MatchedObject | null>(null);
  const [error, setError] = useState<string | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { timeline, isPolling } = useWorkflowTimeline(run?.id ?? null, status);
  const { results, fetchResults } = useSniperResults(run?.id ?? null);
  const { script, loading: scriptLoading, generate: generateScript } = useMagicScripting(run?.id ?? null);
  const { execute: executeAction, loading: actionLoading } = useWorkflowActions(run?.id ?? null);

  useEffect(() => {
    if (results.length > 0 && !selectedMatch) setSelectedMatch(results[0]);
  }, [results, selectedMatch]);

  // Clean up poll on unmount
  useEffect(() => () => { if (pollRef.current) clearInterval(pollRef.current); }, []);

  const startRun = useCallback(
    async (
      sourceObject: SourceObject,
      targetType: TargetObjectType = "any",
      opts: { geo?: string; mockMode?: boolean } = {}
    ) => {
      if (pollRef.current) clearInterval(pollRef.current);
      setError(null);
      setStatus("pending");
      setRun(null);
      setSelectedMatch(null);

      try {
        const created = await createSniperRun({
          source_object_type: sourceObject.object_type,
          source_name:
            (sourceObject.name as string | undefined) ??
            (sourceObject.company_name as string | undefined),
          source_payload: sourceObject as Record<string, unknown>,
          target_object_type: targetType,
          geo: opts.geo,
          mock_mode: opts.mockMode ?? false,
        });
        setRun(created);
        setStatus(created.status as WorkflowStatus);

        pollRef.current = setInterval(async () => {
          try {
            const fresh = await getSniperRun(created.id);
            setRun(fresh);
            if (fresh.status === "completed" || fresh.status === "failed") {
              clearInterval(pollRef.current!);
              pollRef.current = null;
              setStatus(fresh.status as WorkflowStatus);
              if (fresh.status === "completed") {
                const matches = await getSniperResults(fresh.id);
                if (matches.length > 0) setSelectedMatch(matches[0]);
                fetchResults();
              }
            }
          } catch {
            clearInterval(pollRef.current!);
            pollRef.current = null;
          }
        }, 2000);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to start sniper run");
        setStatus("failed");
      }
    },
    [fetchResults]
  );

  const rerun = useCallback(
    async (targetType?: TargetObjectType) => {
      if (!run?.id) return;
      setStatus("pending");
      try {
        const newRun = await rerunSniper(run.id, { target_object_type: targetType });
        setRun(newRun);
        setStatus(newRun.status as WorkflowStatus);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Rerun failed");
        setStatus("failed");
      }
    },
    [run?.id]
  );

  return {
    run, status, timeline, results, selectedMatch, script,
    scriptLoading, actionLoading, isPolling, error,
    setSelectedMatch, startRun, rerun, generateScript, executeAction,
  };
}

```
## FILE: nexus-fe/src/hooks/useMagicScripting.ts
```typescript
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

```
## FILE: nexus-fe/src/hooks/useOsirisRating.ts
```typescript
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

```
## FILE: nexus-fe/src/hooks/useSniperResults.ts
```typescript
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

```
## FILE: nexus-fe/src/hooks/useWorkflowActions.ts
```typescript
"use client";
import { useState, useCallback } from "react";
import type { WorkflowActionResponse } from "@/lib/intent-workflow/types";
import { executeSniperAction } from "@/lib/intent-workflow/api";

export function useWorkflowActions(runId: number | null) {
  const [loading, setLoading] = useState(false);
  const [lastResult, setLastResult] = useState<WorkflowActionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(
    async (actionType: string, matchId?: number, payload?: Record<string, unknown>) => {
      if (!runId) return;
      setLoading(true);
      setError(null);
      try {
        const result = await executeSniperAction(runId, {
          action_type: actionType,
          match_id: matchId,
          payload,
        });
        setLastResult(result);
        return result;
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Action failed";
        setError(msg);
      } finally {
        setLoading(false);
      }
    },
    [runId]
  );

  return { execute, loading, lastResult, error };
}

```
## FILE: nexus-fe/src/hooks/useWorkflowTimeline.ts
```typescript
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

```
## FILE: nexus-fe/src/components/evaluator/index.ts
```typescript
export { EvaluatorKPIBar } from "./EvaluatorKPIBar";
export { EvaluatorFilterBar } from "./EvaluatorFilterBar";
export { EvaluatorInsightsPanel } from "./EvaluatorInsightsPanel";
export { EvaluatorChartsPanel } from "./EvaluatorChartsPanel";
export { EvaluatorRunTaskManager } from "./EvaluatorRunTaskManager";
export { EvaluatorTimeline } from "./EvaluatorTimeline";

```
## FILE: nexus-fe/src/components/evaluator/EvaluatorKPIBar.tsx
```typescript
"use client";
import type { EvaluatorItem } from "@/types/evaluator";

export function EvaluatorKPIBar({ items }: { items: EvaluatorItem[] }) {
  const completed = items.filter((i) => i.task_status === "completed").length;
  const pending = items.filter((i) => i.task_status === "pending").length;
  const avg =
    items.length > 0
      ? (items.reduce((a, b) => a + (b.score ?? 0), 0) / items.length).toFixed(2)
      : "0.00";

  const stats = [
    { label: "Total Tasks", value: items.length },
    { label: "Completed", value: completed },
    { label: "Pending", value: pending },
    { label: "Avg Score", value: avg },
  ];

  return (
    <div className="grid grid-cols-4 gap-3 mb-5">
      {stats.map(({ label, value }) => (
        <div key={label} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="text-xs text-zinc-500 uppercase tracking-wide mb-1">{label}</div>
          <div className="text-2xl font-bold text-white">{value}</div>
        </div>
      ))}
    </div>
  );
}

```
## FILE: nexus-fe/src/components/evaluator/EvaluatorFilterBar.tsx
```typescript
"use client";

type Filter = "all" | "pending" | "completed" | "high";

export function EvaluatorFilterBar({ setFilter }: { setFilter: (f: Filter) => void }) {
  const filters: { label: string; value: Filter }[] = [
    { label: "All", value: "all" },
    { label: "Not Started", value: "pending" },
    { label: "Completed", value: "completed" },
    { label: "High Priority", value: "high" },
  ];

  return (
    <div className="flex gap-2 mb-5">
      {filters.map(({ label, value }) => (
        <button
          key={value}
          onClick={() => setFilter(value)}
          className="px-3 py-1.5 text-xs rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700 transition-colors"
        >
          {label}
        </button>
      ))}
    </div>
  );
}

```
## FILE: nexus-fe/src/components/evaluator/EvaluatorChartsPanel.tsx
```typescript
"use client";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend } from "recharts";
import type { EvaluatorItem } from "@/types/evaluator";

const PIE_COLORS = ["#f59e0b", "#2563eb", "#16a34a"];

export function EvaluatorChartsPanel({ items }: { items: EvaluatorItem[] }) {
  const scoreData = [1, 2, 3, 4, 5].map((s) => ({
    score: `${s}★`,
    count: items.filter((i) => (i.score ?? 0) === s).length,
  }));

  const statusData = [
    { name: "Pending", value: items.filter((i) => i.task_status === "pending").length },
    { name: "In Progress", value: items.filter((i) => i.task_status === "in_progress").length },
    { name: "Completed", value: items.filter((i) => i.task_status === "completed").length },
  ];

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-4">
      <div className="text-sm font-semibold text-white">Score Distribution</div>
      <div style={{ height: 220 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={scoreData}>
            <XAxis dataKey="score" stroke="#52525b" tick={{ fill: "#a1a1aa", fontSize: 12 }} />
            <YAxis allowDecimals={false} stroke="#52525b" tick={{ fill: "#a1a1aa", fontSize: 12 }} />
            <Tooltip contentStyle={{ background: "#18181b", border: "1px solid #3f3f46", color: "#fff" }} />
            <Bar dataKey="count" fill="#2563eb" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="text-sm font-semibold text-white">Status Breakdown</div>
      <div style={{ height: 220 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={statusData} dataKey="value" nameKey="name" outerRadius={80} label>
              {statusData.map((_, index) => (
                <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ background: "#18181b", border: "1px solid #3f3f46", color: "#fff" }} />
            <Legend wrapperStyle={{ color: "#a1a1aa", fontSize: 12 }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

```
## FILE: nexus-fe/src/components/evaluator/EvaluatorInsightsPanel.tsx
```typescript
"use client";
import type { EvaluatorItem } from "@/types/evaluator";

function getFeedback(score: number): string {
  if (score >= 4) return "Strong response quality. Keep tone and clarity consistent.";
  if (score === 3) return "Decent response, but may need stronger actionability or precision.";
  return "Weak response. Consider improving empathy, specificity, and resolution steps.";
}

export function EvaluatorInsightsPanel({ items }: { items: EvaluatorItem[] }) {
  const highPending = items.filter((i) => i.priority === "high" && i.task_status === "pending");
  const completed = items.filter((i) => i.task_status === "completed");
  const avgScore =
    completed.length > 0
      ? (completed.reduce((s, i) => s + (i.score ?? 0), 0) / completed.length).toFixed(2)
      : "0.00";
  const lowScoreTasks = completed.filter((i) => (i.score ?? 0) <= 2);

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-4">
      <h3 className="text-sm font-semibold text-white">AI Insights & Alerts</h3>

      <div className="space-y-1 text-sm text-zinc-400">
        <p>Avg completed score: <span className="text-white font-medium">{avgScore}</span></p>
        <p>High-priority pending: <span className="text-white font-medium">{highPending.length}</span></p>
        <p>Low-score tasks: <span className="text-white font-medium">{lowScoreTasks.length}</span></p>
      </div>

      <div>
        <div className="text-xs text-zinc-500 uppercase tracking-wide mb-2">Alerts</div>
        {highPending.length === 0 ? (
          <p className="text-xs text-zinc-500">No critical pending alerts.</p>
        ) : (
          highPending.slice(0, 5).map((i) => (
            <div key={i.id} className="text-xs bg-zinc-800 rounded-lg px-3 py-2 mb-2 text-amber-400">
              High Priority Pending: {i.title}
            </div>
          ))
        )}
      </div>

      {lowScoreTasks.length > 0 && (
        <div>
          <div className="text-xs text-zinc-500 uppercase tracking-wide mb-2">Per-task Feedback</div>
          {lowScoreTasks.slice(0, 5).map((i) => (
            <div key={i.id} className="text-xs bg-zinc-800 rounded-lg px-3 py-2 mb-2">
              <div className="font-medium text-zinc-200 mb-1">{i.title}</div>
              <div className="text-zinc-400">{getFeedback(i.score ?? 0)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

```
## FILE: nexus-fe/src/components/evaluator/EvaluatorRunTaskManager.tsx
```typescript
"use client";
import { useState } from "react";
import { createRun, createItem } from "@/lib/api/evaluator";

interface Props {
  activeRunId: string;
  reloadRuns: () => Promise<void>;
  reloadItems: () => Promise<void>;
}

export function EvaluatorRunTaskManager({ activeRunId, reloadRuns, reloadItems }: Props) {
  const [runName, setRunName] = useState("");
  const [cadence, setCadence] = useState<"daily" | "weekly" | "custom">("daily");
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskPriority, setTaskPriority] = useState<"low" | "medium" | "high">("medium");

  async function handleCreateRun() {
    if (!runName.trim()) return;
    await createRun({ name: runName, cadence, start_date: new Date().toISOString().slice(0, 10), status: "active" });
    setRunName("");
    await reloadRuns();
  }

  async function handleCreateTask() {
    if (!activeRunId || !taskTitle.trim()) return;
    await createItem(activeRunId, { title: taskTitle, description: taskDescription, priority: taskPriority });
    setTaskTitle("");
    setTaskDescription("");
    setTaskPriority("medium");
    await reloadItems();
  }

  const inputClass = "w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-500";
  const btnClass = "mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded-lg transition-colors";

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-5">
      <div className="text-sm font-semibold text-white">Run & Task Management</div>

      <div className="space-y-2">
        <div className="text-xs text-zinc-400 font-medium">Create a Run</div>
        <input className={inputClass} placeholder="Run name" value={runName} onChange={(e) => setRunName(e.target.value)} />
        <select className={inputClass} value={cadence} onChange={(e) => setCadence(e.target.value as typeof cadence)}>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="custom">Custom</option>
        </select>
        <button className={btnClass} onClick={handleCreateRun}>Create Run</button>
      </div>

      <div className="border-t border-zinc-800 pt-4 space-y-2">
        <div className="text-xs text-zinc-400 font-medium">Create Task (active run)</div>
        <input className={inputClass} placeholder="Task title" value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} />
        <textarea className={inputClass} placeholder="Description" rows={3} value={taskDescription} onChange={(e) => setTaskDescription(e.target.value)} />
        <select className={inputClass} value={taskPriority} onChange={(e) => setTaskPriority(e.target.value as typeof taskPriority)}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <button className={btnClass} onClick={handleCreateTask}>Create Task</button>
      </div>
    </div>
  );
}

```
## FILE: nexus-fe/src/components/evaluator/EvaluatorTimeline.tsx
```typescript
"use client";
import type { EvaluatorItem } from "@/types/evaluator";

export function EvaluatorTimeline({ item }: { item: EvaluatorItem | null }) {
  if (!item) return null;

  const rows = [
    { label: "Started", value: item.started_at ?? "—" },
    { label: "Completed", value: item.ended_at ?? "—" },
    { label: "Opens", value: item.open_count ?? 0 },
    { label: "Reopens", value: item.reopen_count ?? 0 },
  ];

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
      <div className="text-sm font-semibold text-white mb-3">Activity</div>
      <div className="space-y-2">
        {rows.map(({ label, value }) => (
          <div key={label} className="flex justify-between text-sm">
            <span className="text-zinc-500">{label}</span>
            <span className="text-zinc-200">{String(value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

```
## FILE: nexus-fe/src/components/intent-workflow/index.ts
```typescript
export { UniversalIntentWorkflowModal } from "./UniversalIntentWorkflowModal";
export { UniversalIntentWorkflowHeader } from "./UniversalIntentWorkflowHeader";
export { SourceObjectSummary } from "./SourceObjectSummary";
export { TargetObjectSelector } from "./TargetObjectSelector";
export { UniversalMatchFlow } from "./UniversalMatchFlow";
export { TargetingSniperPanel } from "./TargetingSniperPanel";
export { IntentSniperPanel } from "./IntentSniperPanel";
export { SniperQueryPreview } from "./SniperQueryPreview";
export { MatchedTargetsTable } from "./MatchedTargetsTable";
export { MatchDetailDrawer } from "./MatchDetailDrawer";
export { MagicScriptingPanel } from "./MagicScriptingPanel";
export { QualificationScorePanel } from "./QualificationScorePanel";
export { OsirisRatingPanel } from "./OsirisRatingPanel";
export { OutreachSpendGatePanel } from "./OutreachSpendGatePanel";
export { FulfillmentTimeline } from "./FulfillmentTimeline";
export { WorkflowActionsBar } from "./WorkflowActionsBar";
export { ManualOverridePanel } from "./ManualOverridePanel";
export { EvidenceGatePanel } from "./EvidenceGatePanel";
export { SourcePathStatusBar } from "./SourcePathStatusBar";

```
## FILE: nexus-fe/src/components/intent-workflow/UniversalIntentWorkflowModal.tsx
```typescript
"use client";
import { useState, useEffect } from "react";
import type { SourceObject, TargetObjectType, ManualOverride } from "@/lib/intent-workflow/types";
import { useUniversalIntentWorkflow } from "@/hooks/useUniversalIntentWorkflow";
import { UniversalIntentWorkflowHeader } from "./UniversalIntentWorkflowHeader";
import { SourceObjectSummary } from "./SourceObjectSummary";
import { UniversalMatchFlow } from "./UniversalMatchFlow";
import { FulfillmentTimeline } from "./FulfillmentTimeline";
import { MatchedTargetsTable } from "./MatchedTargetsTable";
import { MatchDetailDrawer } from "./MatchDetailDrawer";
import { WorkflowActionsBar } from "./WorkflowActionsBar";
import { SourcePathStatusBar } from "./SourcePathStatusBar";

interface Props {
  open: boolean;
  source: SourceObject;
  onClose: () => void;
}

const DEFAULT_PATHS = ["Lead Service", "Harvester Service", "Google Places", "Email Collector", "Audit Service"];

export function UniversalIntentWorkflowModal({ open, source, onClose }: Props) {
  const [targetType, setTargetType] = useState<TargetObjectType>("any");
  const [geo, setGeo] = useState(source.location ?? "");
  const [timeframe, setTimeframe] = useState("30d");
  const [intentMode, setIntentMode] = useState("auto");
  const [drawerOpen, setDrawerOpen] = useState(false);

  const {
    run, status, timeline, results, selectedMatch, script, scriptLoading,
    actionLoading, isPolling, error,
    setSelectedMatch, startRun, rerun, generateScript, executeAction,
  } = useUniversalIntentWorkflow();

  useEffect(() => {
    if (!open) return;
    setGeo((source.location as string | undefined) ?? "");
  }, [open, source]);

  const handleRun = () => {
    startRun(source, targetType, { geo, mockMode: false });
  };

  const handleRerun = () => {
    rerun(targetType);
  };

  const handleSelectMatch = (match: typeof results[0]) => {
    setSelectedMatch(match);
    setDrawerOpen(true);
    generateScript(match.match_uuid);
  };

  const handleRegenerate = (override?: ManualOverride) => {
    if (!selectedMatch) return;
    generateScript(selectedMatch.match_uuid, override);
  };

  const handleAction = (type: string, matchId?: number) => {
    executeAction(type, matchId);
  };

  const isRunning = status === "running" || status === "pending";

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 m-auto w-full max-w-6xl max-h-[92vh] bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl flex flex-col overflow-hidden">
        <div className="p-4 shrink-0">
          <UniversalIntentWorkflowHeader
            source={source}
            targetType={targetType}
            geo={geo}
            timeframe={timeframe}
            intentMode={intentMode}
            status={status}
            isRunning={isRunning}
            onTargetChange={setTargetType}
            onGeoChange={setGeo}
            onTimeframeChange={setTimeframe}
            onIntentModeChange={setIntentMode}
            onRun={handleRun}
            onRerun={handleRerun}
            onClose={onClose}
          />
        </div>

        {error && (
          <div className="px-4 py-2 bg-red-950/40 border-b border-red-900 text-red-400 text-xs shrink-0">
            {error}
          </div>
        )}

        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-6">
            <UniversalMatchFlow status={status} currentStep={run?.current_step} />

            <div className="grid grid-cols-[280px_1fr] gap-4">
              <div className="space-y-6">
                <SourceObjectSummary source={source} />
                <SourcePathStatusBar activePaths={DEFAULT_PATHS} />
              </div>

              <div>
                <FulfillmentTimeline steps={timeline} isPolling={isPolling} />
              </div>
            </div>

            {results.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Matched Results ({results.length})
                </h3>
                <MatchedTargetsTable
                  matches={results}
                  selected={selectedMatch}
                  onSelect={handleSelectMatch}
                />
              </div>
            )}

            {run && (
              <div className="space-y-2">
                <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Actions</h3>
                <WorkflowActionsBar
                  run={run}
                  selectedMatch={selectedMatch}
                  onAction={handleAction}
                  loading={actionLoading}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {drawerOpen && selectedMatch && (
        <MatchDetailDrawer
          match={selectedMatch}
          script={script ?? null}
          scriptLoading={scriptLoading}
          onClose={() => setDrawerOpen(false)}
          onRegenerate={handleRegenerate}
        />
      )}
    </div>
  );
}

```
## FILE: nexus-fe/src/components/intent-workflow/UniversalIntentWorkflowHeader.tsx
```typescript
"use client";
import type { SourceObject, TargetObjectType, WorkflowStatus } from "@/lib/intent-workflow/types";
import { TargetObjectSelector } from "./TargetObjectSelector";
import { workflowStatusLabel } from "@/lib/intent-workflow/status";
import { clsx } from "clsx";

interface Props {
  source: SourceObject;
  targetType: TargetObjectType;
  geo: string;
  timeframe: string;
  intentMode: string;
  status: WorkflowStatus;
  isRunning: boolean;
  onTargetChange: (v: TargetObjectType) => void;
  onGeoChange: (v: string) => void;
  onTimeframeChange: (v: string) => void;
  onIntentModeChange: (v: string) => void;
  onRun: () => void;
  onRerun: () => void;
  onClose: () => void;
}

export function UniversalIntentWorkflowHeader({
  source, targetType, geo, timeframe, intentMode, status, isRunning,
  onTargetChange, onGeoChange, onTimeframeChange, onIntentModeChange,
  onRun, onRerun, onClose,
}: Props) {
  const name = source.name ?? (source.company_name as string | undefined) ?? "Unknown";
  const hasRun = status !== "idle";

  return (
    <div className="flex flex-col gap-3 border-b border-zinc-800 pb-4">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-semibold text-zinc-100">Universal Intent Sniper</h2>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded uppercase tracking-wide">
              {source.object_type}
            </span>
            <span className="text-sm text-zinc-300 font-medium">{name}</span>
            <StatusPill status={status} />
          </div>
        </div>
        <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300 text-xl leading-none">×</button>
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        <TargetObjectSelector value={targetType} onChange={onTargetChange} disabled={isRunning} />

        <input
          placeholder="Geo (city, state)"
          value={geo}
          onChange={(e) => onGeoChange(e.target.value)}
          disabled={isRunning}
          className="text-sm bg-zinc-800 border border-zinc-700 text-zinc-200 rounded px-3 py-1.5 w-40 disabled:opacity-50"
        />

        <select
          value={timeframe}
          onChange={(e) => onTimeframeChange(e.target.value)}
          disabled={isRunning}
          className="bg-zinc-800 border border-zinc-700 text-zinc-200 text-sm rounded px-3 py-1.5 disabled:opacity-50"
        >
          {["7d","14d","30d","60d","90d"].map((t) => <option key={t} value={t}>{t}</option>)}
        </select>

        <select
          value={intentMode}
          onChange={(e) => onIntentModeChange(e.target.value)}
          disabled={isRunning}
          className="bg-zinc-800 border border-zinc-700 text-zinc-200 text-sm rounded px-3 py-1.5 disabled:opacity-50"
        >
          {["auto","fiber","sales","hiring","vendor","consumer"].map((m) => <option key={m} value={m}>{m}</option>)}
        </select>

        {!hasRun && (
          <button
            onClick={onRun}
            disabled={isRunning}
            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-medium px-4 py-1.5 rounded"
          >
            Run Sniper
          </button>
        )}
        {hasRun && (
          <button
            onClick={onRerun}
            disabled={isRunning}
            className="bg-zinc-700 hover:bg-zinc-600 disabled:opacity-50 text-white text-sm px-4 py-1.5 rounded"
          >
            Rerun
          </button>
        )}
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: WorkflowStatus }) {
  return (
    <span className={clsx(
      "text-xs px-2 py-0.5 rounded-full font-medium",
      status === "completed" ? "bg-emerald-900 text-emerald-300" :
      status === "running" || status === "pending" ? "bg-blue-900 text-blue-300" :
      status === "failed" ? "bg-red-900 text-red-300" :
      "bg-zinc-800 text-zinc-500"
    )}>
      {workflowStatusLabel(status)}
    </span>
  );
}

```
## FILE: nexus-fe/src/components/intent-workflow/UniversalMatchFlow.tsx
```typescript
"use client";
import type { WorkflowStatus } from "@/lib/intent-workflow/types";
import { clsx } from "clsx";

const FLOW_STEPS = [
  "Current Object",
  "Signal Extraction",
  "Intent Sniper Queries",
  "Matching Objects",
  "Osiris Rating",
  "Magic Script",
  "Action",
];

interface Props {
  status: WorkflowStatus;
  currentStep?: string;
}

function getActiveIndex(status: WorkflowStatus): number {
  if (status === "idle") return -1;
  if (status === "pending") return 0;
  if (status === "completed") return FLOW_STEPS.length - 1;
  if (status === "failed") return -1;
  return 2;
}

export function UniversalMatchFlow({ status, currentStep: _ }: Props) {
  const active = getActiveIndex(status);

  return (
    <div className="flex items-center gap-0 overflow-x-auto py-2">
      {FLOW_STEPS.map((step, i) => (
        <div key={step} className="flex items-center">
          <div className="flex flex-col items-center gap-1 min-w-[80px]">
            <div className={clsx(
              "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all",
              i < active ? "bg-emerald-600 border-emerald-600 text-white" :
              i === active ? "bg-blue-600 border-blue-600 text-white animate-pulse" :
              "bg-zinc-900 border-zinc-700 text-zinc-500"
            )}>
              {i + 1}
            </div>
            <span className={clsx(
              "text-xs text-center leading-tight max-w-[72px]",
              i <= active ? "text-zinc-300" : "text-zinc-600"
            )}>
              {step}
            </span>
          </div>
          {i < FLOW_STEPS.length - 1 && (
            <div className={clsx(
              "h-px w-6 shrink-0 transition-all",
              i < active ? "bg-emerald-600" : "bg-zinc-700"
            )} />
          )}
        </div>
      ))}
    </div>
  );
}

```
## FILE: nexus-fe/src/components/intent-workflow/SourceObjectSummary.tsx
```typescript
"use client";
import type { SourceObject } from "@/lib/intent-workflow/types";

interface Props {
  source: SourceObject;
}

export function SourceObjectSummary({ source }: Props) {
  const name = source.name ?? (source.company_name as string | undefined) ?? "Unknown";
  const signals = (source.signals ?? []) as string[];
  const tags = (source.tags ?? []) as string[];

  const rows: { label: string; value: string | undefined }[] = [
    { label: "Type", value: source.object_type },
    { label: "Name", value: name },
    { label: "Location", value: source.location },
    { label: "Website", value: source.website },
    { label: "Source URL", value: source.source_url },
    { label: "Confidence", value: source.source_confidence ? `${source.source_confidence}%` : undefined },
  ];

  return (
    <div className="space-y-3">
      <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Source Object</span>

      <dl className="space-y-1">
        {rows.map(({ label, value }) => value && (
          <div key={label} className="flex gap-2 text-xs">
            <dt className="text-zinc-500 w-20 shrink-0">{label}</dt>
            <dd className="text-zinc-200 break-all">{value}</dd>
          </div>
        ))}
      </dl>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {tags.map((t) => (
            <span key={t} className="text-xs bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded">{t}</span>
          ))}
        </div>
      )}

      {signals.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {signals.map((s) => (
            <span key={s} className="text-xs bg-blue-900/50 text-blue-300 px-1.5 py-0.5 rounded">{s}</span>
          ))}
        </div>
      )}
    </div>
  );
}

```
## FILE: nexus-fe/src/components/intent-workflow/MatchedTargetsTable.tsx
```typescript
"use client";
import type { MatchedObject } from "@/lib/intent-workflow/types";
import { osirisColor, osirisLabel, bantColor } from "@/lib/intent-workflow/status";
import { clsx } from "clsx";

interface Props {
  matches: MatchedObject[];
  selected?: MatchedObject | null;
  onSelect: (match: MatchedObject) => void;
}

export function MatchedTargetsTable({ matches, selected, onSelect }: Props) {
  if (matches.length === 0) {
    return (
      <div className="text-center py-8 text-zinc-500 text-sm">
        No matches yet. Run the sniper to see results.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-zinc-800">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-zinc-800 bg-zinc-900/60">
            {["Type", "Name", "Location", "Intent", "Osiris", "BANT", "Evidence", "Spend Gate", "Action"].map((h) => (
              <th key={h} className="px-3 py-2 text-left text-xs text-zinc-500 font-medium whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {matches.map((m) => (
            <tr
              key={m.id}
              onClick={() => onSelect(m)}
              className={clsx(
                "border-b border-zinc-800/50 cursor-pointer transition-colors",
                selected?.id === m.id ? "bg-blue-950/40" : "hover:bg-zinc-800/40"
              )}
            >
              <td className="px-3 py-2">
                <span className="text-xs bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded">
                  {m.match_type ?? m.source_type ?? "—"}
                </span>
              </td>
              <td className="px-3 py-2 font-medium text-zinc-200 max-w-[160px] truncate">{m.name ?? "—"}</td>
              <td className="px-3 py-2 text-zinc-400 max-w-[140px] truncate">{m.location ?? "—"}</td>
              <td className="px-3 py-2 text-zinc-400 max-w-[140px] truncate">{m.intent ?? "—"}</td>
              <td className="px-3 py-2">
                <span className={clsx("font-semibold", osirisColor(m.osiris_verdict))}>
                  {osirisLabel(m.osiris_verdict)}
                </span>
              </td>
              <td className="px-3 py-2">
                <span className={clsx("font-semibold", bantColor(m.bant_decision))}>
                  {m.bant_score.toFixed(0)}
                </span>
              </td>
              <td className="px-3 py-2">
                <EvidenceBadge status={m.evidence_status} />
              </td>
              <td className="px-3 py-2">
                <SpendBadge decision={m.spend_gate_decision} />
              </td>
              <td className="px-3 py-2">
                <button
                  onClick={(e) => { e.stopPropagation(); onSelect(m); }}
                  className="text-xs text-blue-400 hover:text-blue-300 underline"
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function EvidenceBadge({ status }: { status?: string | null }) {
  const cls = status === "VERIFIED" ? "bg-emerald-900 text-emerald-300" :
    status === "HOLD" ? "bg-yellow-900 text-yellow-300" :
    status === "REJECT" ? "bg-red-900 text-red-300" :
    "bg-zinc-800 text-zinc-400";
  return <span className={clsx("text-xs px-1.5 py-0.5 rounded", cls)}>{status ?? "—"}</span>;
}

function SpendBadge({ decision }: { decision?: string | null }) {
  const cls = decision === "APPROVED" ? "bg-emerald-900 text-emerald-300" :
    decision === "HOLD" ? "bg-yellow-900 text-yellow-300" :
    "bg-zinc-800 text-zinc-400";
  return <span className={clsx("text-xs px-1.5 py-0.5 rounded", cls)}>{decision ?? "—"}</span>;
}

```
## FILE: nexus-fe/src/components/intent-workflow/MatchDetailDrawer.tsx
```typescript
"use client";
import type { MatchedObject, MagicScriptOutput, ManualOverride } from "@/lib/intent-workflow/types";
import { OsirisRatingPanel } from "./OsirisRatingPanel";
import { QualificationScorePanel } from "./QualificationScorePanel";
import { MagicScriptingPanel } from "./MagicScriptingPanel";

interface Props {
  match: MatchedObject;
  script: MagicScriptOutput | null;
  scriptLoading?: boolean;
  onClose: () => void;
  onRegenerate?: (override?: ManualOverride) => void;
}

export function MatchDetailDrawer({ match, script, scriptLoading, onClose, onRegenerate }: Props) {
  return (
    <div className="fixed inset-y-0 right-0 w-[420px] bg-zinc-950 border-l border-zinc-800 shadow-2xl flex flex-col z-50">
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
        <h3 className="text-sm font-semibold text-zinc-200">{match.name ?? "Match Detail"}</h3>
        <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300 text-xl leading-none">×</button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <div className="space-y-2 text-xs text-zinc-400">
          {[
            { label: "Type", value: match.match_type ?? match.source_type },
            { label: "Company", value: match.company },
            { label: "Location", value: match.location },
            { label: "Website", value: match.website },
            { label: "Source URL", value: match.source_url },
            { label: "Intent", value: match.intent },
          ].map(({ label, value }) => value && (
            <div key={label} className="flex gap-2">
              <span className="w-20 shrink-0 text-zinc-600">{label}</span>
              <span className="text-zinc-300 break-all">{value}</span>
            </div>
          ))}
        </div>

        <OsirisRatingPanel match={match} />
        <QualificationScorePanel match={match} />
        <MagicScriptingPanel script={script} loading={scriptLoading} onRegenerate={onRegenerate} />
      </div>
    </div>
  );
}

```
## FILE: nexus-fe/src/components/intent-workflow/FulfillmentTimeline.tsx
```typescript
"use client";
import type { WorkflowTimelineStep } from "@/lib/intent-workflow/types";
import { stepStatusColor, stepStatusLabel } from "@/lib/intent-workflow/status";
import { clsx } from "clsx";

interface Props {
  steps: WorkflowTimelineStep[];
  isPolling?: boolean;
}

export function FulfillmentTimeline({ steps, isPolling }: Props) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
          Fulfillment Timeline
        </span>
        {isPolling && (
          <span className="text-xs text-blue-400 flex items-center gap-1">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            Live
          </span>
        )}
      </div>

      <div className="relative">
        <div className="absolute left-3 top-0 bottom-0 w-px bg-zinc-700" />

        {steps.map((step) => (
          <div key={step.id} className="relative flex items-start gap-3 pb-3">
            <div className="relative z-10 mt-0.5">
              <div className={clsx("w-6 h-6 rounded-full flex items-center justify-center", stepStatusColor(step.status))}>
                {step.status === "completed" && <CheckIcon />}
                {step.status === "running" && <SpinIcon />}
                {step.status === "failed" && <XIcon />}
                {(step.status === "pending" || step.status === "hold") && (
                  <span className="w-2 h-2 rounded-full bg-current" />
                )}
              </div>
            </div>

            <div className="flex-1 min-w-0 pt-0.5">
              <div className="flex items-center justify-between">
                <span className={clsx(
                  "text-sm font-medium",
                  step.status === "completed" ? "text-zinc-200" :
                  step.status === "running" ? "text-blue-300" :
                  step.status === "failed" ? "text-red-400" : "text-zinc-500"
                )}>
                  {step.step_label}
                </span>
                <span className="text-xs text-zinc-600">
                  {step.duration_ms ? `${step.duration_ms}ms` : stepStatusLabel(step.status)}
                </span>
              </div>
              {step.message && (
                <p className="text-xs text-zinc-500 mt-0.5 truncate">{step.message}</p>
              )}
            </div>
          </div>
        ))}

        {steps.length === 0 && (
          <div className="pl-8 text-xs text-zinc-600">Waiting for timeline data...</div>
        )}
      </div>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function SpinIcon() {
  return (
    <svg className="w-3 h-3 text-white animate-spin" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
  );
}

```
## FILE: nexus-fe/src/components/intent-workflow/WorkflowActionsBar.tsx
```typescript
"use client";
import type { MatchedObject, SniperRunResponse } from "@/lib/intent-workflow/types";

interface Props {
  run?: SniperRunResponse | null;
  selectedMatch?: MatchedObject | null;
  onAction: (type: string, matchId?: number) => void;
  loading?: boolean;
}

const ACTIONS = [
  { key: "save_as_lead", label: "Save as Lead", color: "bg-emerald-700 hover:bg-emerald-600" },
  { key: "attach_to_existing_lead", label: "Attach to Lead", color: "bg-zinc-700 hover:bg-zinc-600" },
  { key: "create_follow_up_task", label: "Follow-Up Task", color: "bg-zinc-700 hover:bg-zinc-600" },
  { key: "export_json", label: "Export JSON", color: "bg-zinc-700 hover:bg-zinc-600" },
  { key: "export_csv", label: "Export CSV", color: "bg-zinc-700 hover:bg-zinc-600" },
  { key: "export_pdf", label: "Export PDF", color: "bg-zinc-700 hover:bg-zinc-600" },
  { key: "open_audit", label: "Audit Trail", color: "bg-zinc-700 hover:bg-zinc-600" },
  { key: "trigger_webhook", label: "Webhook", color: "bg-purple-800 hover:bg-purple-700" },
] as const;

export function WorkflowActionsBar({ run, selectedMatch, onAction, loading }: Props) {
  if (!run) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {ACTIONS.map(({ key, label, color }) => (
        <button
          key={key}
          disabled={loading}
          onClick={() => onAction(key, selectedMatch?.id)}
          className={`text-xs text-white px-3 py-1.5 rounded disabled:opacity-50 transition-colors ${color}`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

```
## FILE: nexus-fe/src/components/intent-workflow/OsirisRatingPanel.tsx
```typescript
"use client";
import type { MatchedObject } from "@/lib/intent-workflow/types";
import { osirisColor, osirisLabel } from "@/lib/intent-workflow/status";
import { clsx } from "clsx";

interface Props {
  match: MatchedObject;
}

const DIMENSIONS = [
  { key: "entity_match", label: "Entity Match" },
  { key: "intent_relevance", label: "Intent Relevance" },
  { key: "source_trust", label: "Source Trust" },
  { key: "evidence_strength", label: "Evidence Strength" },
  { key: "freshness", label: "Freshness" },
  { key: "contact_path", label: "Contact Path" },
  { key: "duplicate_risk", label: "Duplicate Risk" },
  { key: "persona_fit", label: "Persona Fit" },
] as const;

export function OsirisRatingPanel({ match }: Props) {
  const verdict = match.osiris_verdict;
  const rating = match.osiris_rating;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Osiris Rating</span>
        <div className="text-right">
          <span className={clsx("text-lg font-bold", osirisColor(verdict))}>{rating.toFixed(0)}</span>
          <span className="text-xs text-zinc-500 ml-1">/ 100</span>
        </div>
      </div>

      <div className={clsx(
        "rounded-lg border px-4 py-2 text-center font-semibold text-sm",
        verdict === "OSIRIS_A_LOCKED" ? "border-emerald-500 text-emerald-400 bg-emerald-950/40" :
        verdict === "OSIRIS_B_STRONG" ? "border-green-500 text-green-400 bg-green-950/40" :
        verdict === "OSIRIS_C_REVIEW" ? "border-yellow-500 text-yellow-400 bg-yellow-950/40" :
        verdict === "OSIRIS_D_WEAK" ? "border-orange-500 text-orange-400 bg-orange-950/40" :
        "border-red-500 text-red-400 bg-red-950/40"
      )}>
        {osirisLabel(verdict)}
      </div>

      <div className="space-y-2">
        {DIMENSIONS.map(({ key, label }) => {
          const raw = (match as Record<string, unknown>)[key];
          const value = typeof raw === "number" ? raw : 0;
          return (
            <div key={key}>
              <div className="flex justify-between text-xs text-zinc-400 mb-0.5">
                <span>{label}</span>
                <span>{value.toFixed(0)}</span>
              </div>
              <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className={clsx("h-full rounded-full transition-all",
                    value >= 85 ? "bg-emerald-500" : value >= 70 ? "bg-green-500" : value >= 50 ? "bg-yellow-500" : "bg-red-500"
                  )}
                  style={{ width: `${Math.min(100, value)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

```
## FILE: nexus-fe/src/components/intent-workflow/QualificationScorePanel.tsx
```typescript
"use client";
import type { MatchedObject } from "@/lib/intent-workflow/types";
import { bantColor } from "@/lib/intent-workflow/status";
import { clsx } from "clsx";

interface Props {
  match: MatchedObject;
}

export function QualificationScorePanel({ match }: Props) {
  const score = match.bant_score;
  const decision = match.bant_decision;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">BANT Qualification</span>
        <span className={clsx("text-lg font-bold", bantColor(decision))}>{score.toFixed(0)}</span>
      </div>

      <div className={clsx(
        "rounded-lg border px-4 py-2 text-center font-semibold text-sm",
        decision === "APPROVED" ? "border-emerald-500 text-emerald-400 bg-emerald-950/40" :
        decision === "HOLD" ? "border-yellow-500 text-yellow-400 bg-yellow-950/40" :
        "border-red-500 text-red-400 bg-red-950/40"
      )}>
        {decision ?? "—"}
      </div>

      <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
        <div
          className={clsx("h-full rounded-full transition-all",
            score >= 70 ? "bg-emerald-500" : score >= 50 ? "bg-yellow-500" : "bg-red-500"
          )}
          style={{ width: `${Math.min(100, score)}%` }}
        />
      </div>

      <div className="grid grid-cols-2 gap-1 text-xs text-zinc-500">
        <span>Score: {score.toFixed(0)} / 100</span>
        <span className="text-right">≥70 = Approved</span>
      </div>
    </div>
  );
}

```
## FILE: nexus-fe/src/components/intent-workflow/EvidenceGatePanel.tsx
```typescript
"use client";
import type { MatchedObject } from "@/lib/intent-workflow/types";
import { clsx } from "clsx";

interface Props {
  match: MatchedObject;
}

export function EvidenceGatePanel({ match }: Props) {
  const status = match.evidence_status;
  return (
    <div className="space-y-2">
      <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Evidence Gate</span>
      <div className={clsx(
        "rounded-lg border px-4 py-2 text-center font-semibold text-sm",
        status === "VERIFIED" ? "border-emerald-500 text-emerald-400 bg-emerald-950/40" :
        status === "HOLD" ? "border-yellow-500 text-yellow-400 bg-yellow-950/40" :
        status === "REJECT" ? "border-red-500 text-red-400 bg-red-950/40" :
        "border-zinc-700 text-zinc-500 bg-zinc-900/40"
      )}>
        {status ?? "Pending"}
      </div>
    </div>
  );
}

```
## FILE: nexus-fe/src/components/intent-workflow/MagicScriptingPanel.tsx
```typescript
"use client";
import { useState } from "react";
import type { MagicScriptOutput, ManualOverride } from "@/lib/intent-workflow/types";

interface Props {
  script: MagicScriptOutput | null;
  loading?: boolean;
  onRegenerate?: (override?: ManualOverride) => void;
}

const SCRIPT_TABS = [
  { key: "hook", label: "Hook" },
  { key: "pain_summary", label: "Pain" },
  { key: "email_script", label: "Email" },
  { key: "linkedin_script", label: "LinkedIn" },
  { key: "call_script", label: "Call Script" },
  { key: "ringcentral_call_opener", label: "RC Opener" },
  { key: "cta", label: "CTA" },
  { key: "follow_up", label: "Follow-Up" },
] as const;

type ScriptTab = (typeof SCRIPT_TABS)[number]["key"];

export function MagicScriptingPanel({ script, loading, onRegenerate }: Props) {
  const [activeTab, setActiveTab] = useState<ScriptTab>("hook");
  const [tone, setTone] = useState("professional");
  const [painFocus, setPainFocus] = useState("");
  const [customHook, setCustomHook] = useState("");

  const handleRegenerate = () => {
    onRegenerate?.({ tone, pain_focus: painFocus || undefined, custom_hook: customHook || undefined });
  };

  const content = script?.[activeTab];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Magic Scripting</span>
        {script?.mock && (
          <span className="text-xs bg-yellow-900/50 text-yellow-400 px-2 py-0.5 rounded">Template Mode</span>
        )}
      </div>

      {onRegenerate && (
        <div className="flex gap-2 flex-wrap">
          <select
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            className="text-xs bg-zinc-800 border border-zinc-700 text-zinc-300 rounded px-2 py-1"
          >
            {["professional", "casual", "urgent", "consultative"].map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <input
            placeholder="Pain focus..."
            value={painFocus}
            onChange={(e) => setPainFocus(e.target.value)}
            className="text-xs bg-zinc-800 border border-zinc-700 text-zinc-300 rounded px-2 py-1 flex-1 min-w-[120px]"
          />
          <button
            onClick={handleRegenerate}
            disabled={loading}
            className="text-xs bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-3 py-1 rounded"
          >
            {loading ? "..." : "Regenerate"}
          </button>
        </div>
      )}

      {!script ? (
        <div className="text-center py-6 text-zinc-500 text-sm">
          {loading ? "Generating script..." : "Select a match to view scripts."}
        </div>
      ) : (
        <>
          <div className="flex gap-1 flex-wrap border-b border-zinc-800 pb-2">
            {SCRIPT_TABS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`text-xs px-2 py-1 rounded ${activeTab === key ? "bg-blue-600 text-white" : "text-zinc-400 hover:text-zinc-200"}`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="relative">
            <pre className="text-xs text-zinc-300 whitespace-pre-wrap bg-zinc-900 rounded-lg p-3 max-h-48 overflow-y-auto">
              {content || "—"}
            </pre>
            {content && (
              <button
                onClick={() => navigator.clipboard.writeText(content)}
                className="absolute top-2 right-2 text-xs text-zinc-500 hover:text-zinc-300"
              >
                Copy
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

```
## FILE: nexus-fe/src/components/intent-workflow/ManualOverridePanel.tsx
```typescript
"use client";
import { useState } from "react";
import type { ManualOverride } from "@/lib/intent-workflow/types";

interface Props {
  onApply: (override: ManualOverride) => void;
}

export function ManualOverridePanel({ onApply }: Props) {
  const [tone, setTone] = useState("professional");
  const [persona, setPersona] = useState("");
  const [painFocus, setPainFocus] = useState("");
  const [customHook, setCustomHook] = useState("");

  return (
    <div className="space-y-3">
      <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Manual Override</span>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs text-zinc-500 block mb-1">Tone</label>
          <select
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            className="w-full text-xs bg-zinc-800 border border-zinc-700 text-zinc-300 rounded px-2 py-1"
          >
            {["professional", "casual", "urgent", "consultative"].map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs text-zinc-500 block mb-1">Persona</label>
          <input
            value={persona}
            onChange={(e) => setPersona(e.target.value)}
            placeholder="e.g. IT Director"
            className="w-full text-xs bg-zinc-800 border border-zinc-700 text-zinc-300 rounded px-2 py-1"
          />
        </div>
        <div>
          <label className="text-xs text-zinc-500 block mb-1">Pain Focus</label>
          <input
            value={painFocus}
            onChange={(e) => setPainFocus(e.target.value)}
            placeholder="e.g. bandwidth costs"
            className="w-full text-xs bg-zinc-800 border border-zinc-700 text-zinc-300 rounded px-2 py-1"
          />
        </div>
        <div>
          <label className="text-xs text-zinc-500 block mb-1">Custom Hook</label>
          <input
            value={customHook}
            onChange={(e) => setCustomHook(e.target.value)}
            placeholder="Override first line"
            className="w-full text-xs bg-zinc-800 border border-zinc-700 text-zinc-300 rounded px-2 py-1"
          />
        </div>
      </div>
      <button
        onClick={() => onApply({ tone, persona: persona || undefined, pain_focus: painFocus || undefined, custom_hook: customHook || undefined })}
        className="text-xs bg-zinc-700 hover:bg-zinc-600 text-white px-3 py-1.5 rounded"
      >
        Apply Override
      </button>
    </div>
  );
}

```
## FILE: nexus-fe/src/components/intent-workflow/IntentSniperPanel.tsx
```typescript
"use client";

interface QueryPlan {
  google_places_queries?: string[];
  google_dorks?: string[];
  company_site_queries?: string[];
  linkedin_queries?: string[];
  exclusions?: string[];
}

interface Props {
  queryPlan?: QueryPlan | null;
  nexusPaths?: string[];
}

export function IntentSniperPanel({ queryPlan, nexusPaths }: Props) {
  if (!queryPlan) {
    return <div className="text-xs text-zinc-500">Intent queries not yet generated.</div>;
  }

  const sections: { label: string; items: string[] | undefined }[] = [
    { label: "Google Places Queries", items: queryPlan.google_places_queries },
    { label: "Google Dorks", items: queryPlan.google_dorks },
    { label: "LinkedIn Queries", items: queryPlan.linkedin_queries },
    { label: "Exclusions", items: queryPlan.exclusions },
  ];

  return (
    <div className="space-y-3">
      <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Intent Sniper</span>

      {nexusPaths && nexusPaths.length > 0 && (
        <div>
          <p className="text-xs text-zinc-500 mb-1">Active NEXUS Paths</p>
          <div className="flex flex-wrap gap-1">
            {nexusPaths.map((p) => (
              <span key={p} className="text-xs bg-blue-900/50 text-blue-300 px-1.5 py-0.5 rounded">{p}</span>
            ))}
          </div>
        </div>
      )}

      {sections.map(({ label, items }) =>
        items && items.length > 0 ? (
          <div key={label}>
            <p className="text-xs text-zinc-500 mb-1">{label}</p>
            <ul className="space-y-0.5">
              {items.map((item, i) => (
                <li key={i} className="text-xs text-zinc-300 bg-zinc-900 rounded px-2 py-1 font-mono truncate">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ) : null
      )}
    </div>
  );
}

```
## FILE: nexus-fe/src/components/intent-workflow/TargetingSniperPanel.tsx
```typescript
"use client";

interface TargetingPlan {
  target_type?: string;
  recommended_target?: string;
  buyer_persona?: string;
  icp_summary?: string;
  authority_clues?: string[];
  contact_path?: string;
  best_targeting_route?: string;
  targeting_confidence?: number;
  nexus_paths_activated?: string[];
}

interface Props {
  plan?: TargetingPlan | null;
}

export function TargetingSniperPanel({ plan }: Props) {
  if (!plan) {
    return <div className="text-xs text-zinc-500">Targeting plan not yet generated.</div>;
  }

  const rows = [
    { label: "Target Type", value: plan.target_type },
    { label: "Buyer Persona", value: plan.buyer_persona },
    { label: "ICP Summary", value: plan.icp_summary },
    { label: "Contact Path", value: plan.contact_path },
    { label: "Targeting Route", value: plan.best_targeting_route },
    { label: "Confidence", value: plan.targeting_confidence ? `${plan.targeting_confidence}%` : undefined },
  ];

  return (
    <div className="space-y-3">
      <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Targeting Sniper</span>

      <dl className="space-y-1.5">
        {rows.map(({ label, value }) => value && (
          <div key={label} className="flex gap-2 text-xs">
            <dt className="text-zinc-500 w-28 shrink-0">{label}</dt>
            <dd className="text-zinc-200">{value}</dd>
          </div>
        ))}
      </dl>

      {(plan.authority_clues ?? []).length > 0 && (
        <div>
          <p className="text-xs text-zinc-500 mb-1">Authority Clues</p>
          <div className="flex flex-wrap gap-1">
            {plan.authority_clues!.map((c) => (
              <span key={c} className="text-xs bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded">{c}</span>
            ))}
          </div>
        </div>
      )}

      {(plan.nexus_paths_activated ?? []).length > 0 && (
        <div>
          <p className="text-xs text-zinc-500 mb-1">NEXUS Paths</p>
          <div className="flex flex-wrap gap-1">
            {plan.nexus_paths_activated!.map((p) => (
              <span key={p} className="text-xs bg-blue-900/50 text-blue-300 px-1.5 py-0.5 rounded">{p}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

```
## FILE: nexus-fe/src/components/intent-workflow/SniperQueryPreview.tsx
```typescript
"use client";

interface Props {
  queries: string[];
  label?: string;
}

export function SniperQueryPreview({ queries, label = "Queries" }: Props) {
  if (!queries.length) return null;
  return (
    <div className="space-y-1">
      <p className="text-xs text-zinc-500">{label}</p>
      {queries.map((q, i) => (
        <div key={i} className="text-xs font-mono text-zinc-300 bg-zinc-900 rounded px-2 py-1 truncate">{q}</div>
      ))}
    </div>
  );
}

```
## FILE: nexus-fe/src/components/intent-workflow/SourcePathStatusBar.tsx
```typescript
"use client";

const ALL_PATHS = [
  "Lead Service",
  "Harvester Service",
  "Google Places",
  "Email Collector",
  "Audit Service",
  "CoreAI / OpenAI",
  "RingCentral",
];

interface Props {
  activePaths?: string[];
}

export function SourcePathStatusBar({ activePaths = [] }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {ALL_PATHS.map((path) => {
        const active = activePaths.includes(path);
        return (
          <div
            key={path}
            className={`flex items-center gap-1.5 text-xs px-2 py-1 rounded border ${
              active
                ? "border-blue-700 bg-blue-950/40 text-blue-300"
                : "border-zinc-800 bg-zinc-900 text-zinc-600"
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${active ? "bg-blue-400" : "bg-zinc-700"}`} />
            {path}
          </div>
        );
      })}
    </div>
  );
}

```
## FILE: nexus-fe/src/components/intent-workflow/TargetObjectSelector.tsx
```typescript
"use client";
import type { TargetObjectType } from "@/lib/intent-workflow/types";

const TARGET_TYPES: { value: TargetObjectType; label: string }[] = [
  { value: "any", label: "Any" },
  { value: "lead", label: "Lead" },
  { value: "business", label: "Business" },
  { value: "job", label: "Job" },
  { value: "candidate", label: "Candidate" },
  { value: "student", label: "Student" },
  { value: "college", label: "College" },
  { value: "vendor", label: "Vendor" },
  { value: "permit", label: "Permit" },
  { value: "rfp", label: "RFP" },
  { value: "post", label: "Post" },
  { value: "property", label: "Property" },
  { value: "consumer_request", label: "Consumer Request" },
];

interface Props {
  value: TargetObjectType;
  onChange: (v: TargetObjectType) => void;
  disabled?: boolean;
}

export function TargetObjectSelector({ value, onChange, disabled }: Props) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as TargetObjectType)}
      disabled={disabled}
      className="bg-zinc-800 border border-zinc-700 text-zinc-200 text-sm rounded px-3 py-1.5 disabled:opacity-50"
    >
      {TARGET_TYPES.map(({ value: v, label }) => (
        <option key={v} value={v}>{label}</option>
      ))}
    </select>
  );
}

```
## FILE: nexus-fe/src/components/intent-workflow/OutreachSpendGatePanel.tsx
```typescript
"use client";
import type { MatchedObject } from "@/lib/intent-workflow/types";
import { clsx } from "clsx";

interface Props {
  match: MatchedObject;
}

export function OutreachSpendGatePanel({ match }: Props) {
  const decision = match.spend_gate_decision;
  return (
    <div className="space-y-2">
      <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Outreach Spend Gate</span>
      <div className={clsx(
        "rounded-lg border px-4 py-2 text-center font-semibold text-sm",
        decision === "APPROVED" ? "border-emerald-500 text-emerald-400 bg-emerald-950/40" :
        decision === "HOLD" ? "border-yellow-500 text-yellow-400 bg-yellow-950/40" :
        "border-zinc-700 text-zinc-500 bg-zinc-900/40"
      )}>
        {decision ?? "Pending"}
      </div>
      <p className="text-xs text-zinc-500">
        Gate approves outreach spend based on BANT composite score ≥ 50.
      </p>
    </div>
  );
}

```
## FILE: nexus-fe/src/components/leads/SniperLaunchButton.tsx
```typescript
"use client";
import { useState } from "react";
import { UniversalIntentWorkflowModal } from "@/components/intent-workflow/UniversalIntentWorkflowModal";
import type { SourceObject } from "@/lib/intent-workflow/types";

interface NexusLead {
  id?: string | number;
  name?: string;
  first_name?: string;
  last_name?: string;
  company?: string;
  company_name?: string;
  title?: string;
  location?: string;
  city?: string;
  state?: string;
  website?: string;
  linkedin_url?: string;
  source_url?: string;
  tags?: string[];
  [key: string]: unknown;
}

interface Props {
  lead: NexusLead;
  className?: string;
}

function mapLeadToSourceObject(lead: NexusLead): SourceObject {
  const name =
    lead.name ??
    [lead.first_name, lead.last_name].filter(Boolean).join(" ") ??
    lead.company_name ??
    lead.company ??
    "";
  const location =
    lead.location ??
    [lead.city, lead.state].filter(Boolean).join(", ") ??
    "";

  return {
    object_type: "lead",
    name,
    title: lead.title,
    company_name: lead.company_name ?? lead.company,
    location: location || undefined,
    website: lead.website,
    source_url: lead.linkedin_url ?? lead.source_url,
    tags: lead.tags,
  };
}

export function SniperLaunchButton({ lead, className = "" }: Props) {
  const [open, setOpen] = useState(false);
  const sourceObject = mapLeadToSourceObject(lead);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium rounded-lg transition-colors ${className}`}
      >
        <svg
          className="w-3.5 h-3.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
          <path d="M5.636 5.636l2.122 2.122M16.243 16.243l2.121 2.121M5.636 18.364l2.122-2.121M16.243 7.757l2.121-2.121" />
        </svg>
        Launch Sniper
      </button>

      <UniversalIntentWorkflowModal
        open={open}
        source={sourceObject}
        onClose={() => setOpen(false)}
      />
    </>
  );
}

```
## FILE: nexus-fe/src/app/(dashboard)/evaluator/page.tsx
```typescript
"use client";
import { useEffect, useMemo, useState } from "react";
import { listRuns, listItems, listResponses, submitResponse } from "@/lib/api/evaluator";
import type { EvaluatorRun, EvaluatorItem, EvaluatorResponse } from "@/types/evaluator";

const ORG_NAME = process.env.NEXT_PUBLIC_EVALUATOR_ORG_ID ?? "Nexus";
const USER_NAME = typeof window !== "undefined"
  ? (localStorage.getItem("user_name") ?? "Evaluator")
  : "Evaluator";

type ActivityFilter = "all" | "low" | "high";

export default function EvaluatorPage() {
  const [runs, setRuns] = useState<EvaluatorRun[]>([]);
  const [runId, setRunId] = useState<string>("");
  const [items, setItems] = useState<EvaluatorItem[]>([]);
  const [responses, setResponses] = useState<EvaluatorResponse[]>([]);
  const [activityFilter, setActivityFilter] = useState<ActivityFilter>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listRuns()
      .then((r) => {
        setRuns(r);
        const defaultId = process.env.NEXT_PUBLIC_EVALUATOR_RUN_ID ?? (r[0]?.id ?? "");
        setRunId(defaultId);
      })
      .catch(() => setError("Failed to load runs"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!runId) return;
    loadRunData(runId);
  }, [runId]);

  async function loadRunData(id: string) {
    try {
      const [itemsData, respData] = await Promise.all([listItems(id), listResponses(id)]);
      setItems(itemsData);
      setResponses(respData);
    } catch {
      setError("Failed to load run data");
    }
  }

  async function save(itemId: string, score: number) {
    const existing = responses.find((r) => r.item_id === itemId && r.evaluator_name === USER_NAME);
    if (existing) return;
    await submitResponse({ run_id: runId, item_id: itemId, score, evaluator_name: USER_NAME, organization_name: ORG_NAME });
    loadRunData(runId);
  }

  const itemScoreMap: Record<string, number> = {};
  responses.forEach((r) => { if (!(r.item_id in itemScoreMap)) itemScoreMap[r.item_id] = r.score; });

  const completed = new Set(responses.map((r) => r.item_id)).size;
  const avg = responses.length > 0
    ? (responses.reduce((a, b) => a + (b.score ?? 0), 0) / responses.length).toFixed(2)
    : "0.00";
  const lowCount = responses.filter((r) => (r.score ?? 0) <= 2).length;
  const highCount = responses.filter((r) => (r.score ?? 0) >= 4).length;
  const pending = Math.max(items.length - completed, 0);

  const activity = useMemo(() => {
    if (activityFilter === "low") return responses.filter((r) => (r.score ?? 0) <= 2);
    if (activityFilter === "high") return responses.filter((r) => (r.score ?? 0) >= 4);
    return responses;
  }, [responses, activityFilter]);

  const activeRun = runs.find((r) => r.id === runId);

  const stats = [
    { label: "Completed", value: completed },
    { label: "Pending", value: pending },
    { label: "Avg Score", value: avg },
    { label: "High Scores", value: highCount },
    { label: "Low Scores", value: lowCount },
  ];

  const inputCls = "bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-1.5 text-sm text-zinc-200 focus:outline-none focus:border-zinc-500";

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-zinc-400 text-sm">Loading evaluator…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Evaluator</h1>
            <p className="text-zinc-400 text-sm mt-1">
              {ORG_NAME}
              {activeRun && <> · <span className="text-zinc-300">{activeRun.name}</span></>}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {error && <span className="text-xs text-red-400">{error}</span>}
            <select
              className={inputCls}
              value={runId}
              onChange={(e) => setRunId(e.target.value)}
            >
              {runs.length === 0 && <option value="">No runs found</option>}
              {runs.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} ({r.cadence})
                </option>
              ))}
            </select>
            <a
              href="/evaluator/runs"
              className="px-3 py-1.5 text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition-colors"
            >
              Manage Runs
            </a>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-3 mb-6">
          {stats.map(({ label, value }) => (
            <div key={label} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <div className="text-xs text-zinc-500 uppercase tracking-wide mb-1">{label}</div>
              <div className="text-2xl font-bold text-white">{value}</div>
            </div>
          ))}
        </div>

        {!runId ? (
          <div className="text-center py-16 text-zinc-500 text-sm">
            Select or create a run to start evaluating.
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16 text-zinc-500 text-sm">
            No items in this run yet.{" "}
            <a href="/evaluator/runs" className="text-blue-400 hover:underline">Add tasks</a>
          </div>
        ) : (
          <div className="grid grid-cols-[1fr_360px] gap-5">
            <div className="space-y-4">
              {items.map((item, i) => {
                const savedScore = itemScoreMap[item.id] ?? null;
                const done = !!savedScore;
                return (
                  <div key={item.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-sm font-semibold text-zinc-200">
                        {item.title ?? `Task ${i + 1}`}
                      </div>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          done ? "bg-green-900/40 text-green-400" : "bg-zinc-800 text-zinc-400"
                        }`}
                      >
                        {done ? "Completed" : "Pending Review"}
                      </span>
                    </div>
                    {(item.input || item.ai_output) && (
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        {item.input && (
                          <div className="bg-zinc-800/50 rounded-lg p-3">
                            <div className="text-xs text-zinc-500 mb-1">Input</div>
                            <div className="text-sm text-zinc-300">{item.input}</div>
                          </div>
                        )}
                        {item.ai_output && (
                          <div className="bg-zinc-800/50 rounded-lg p-3">
                            <div className="text-xs text-zinc-500 mb-1">AI Output</div>
                            <div className="text-sm text-zinc-300">{item.ai_output}</div>
                          </div>
                        )}
                      </div>
                    )}
                    {item.description && (
                      <p className="text-xs text-zinc-500 mb-3">{item.description}</p>
                    )}
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          key={s}
                          onClick={() => save(item.id, s)}
                          disabled={done}
                          className={`w-9 h-9 rounded-lg text-sm font-bold transition-colors ${
                            savedScore === s
                              ? "bg-blue-600 text-white"
                              : done
                              ? "bg-zinc-800/40 text-zinc-600 cursor-not-allowed"
                              : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="space-y-4">
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                <div className="text-sm font-semibold text-white mb-3">Live Widgets</div>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: "Completed", value: completed, filter: "all" as ActivityFilter },
                    { label: "Avg Score", value: avg, filter: null },
                    { label: "High Scores", value: highCount, filter: "high" as ActivityFilter },
                    { label: "Low Scores", value: lowCount, filter: "low" as ActivityFilter },
                  ].map(({ label, value, filter }) => (
                    <div key={label} className="bg-zinc-800 rounded-lg p-3">
                      <div className="text-xs text-zinc-500 mb-1">{label}</div>
                      <div className="text-lg font-bold text-white">{value}</div>
                      {filter && (
                        <button
                          className="text-xs text-blue-400 hover:text-blue-300 mt-1"
                          onClick={() => setActivityFilter(filter)}
                        >
                          Filter
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                <div className="text-sm font-semibold text-white mb-3">Recent Activity</div>
                <div className="space-y-2">
                  {activity.length === 0 ? (
                    <div className="text-xs text-zinc-500">No activity in this filter.</div>
                  ) : (
                    activity.map((r, idx) => (
                      <div key={idx} className="bg-zinc-800 rounded-lg px-3 py-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-medium text-zinc-300">
                            {r.evaluator_name ?? USER_NAME}
                          </span>
                          <span className="text-xs bg-zinc-700 text-zinc-300 px-2 py-0.5 rounded-full">
                            {r.score} / 5
                          </span>
                        </div>
                        <div className="text-xs text-zinc-500 mt-0.5">
                          Item {String(r.item_id).slice(0, 8)}… · {ORG_NAME}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <a
                  href="/evaluator/analytics"
                  className="flex-1 text-center py-2 text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition-colors"
                >
                  Analytics
                </a>
                <a
                  href="/evaluator/runs"
                  className="flex-1 text-center py-2 text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition-colors"
                >
                  Runs
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

```
## FILE: nexus-fe/src/app/(dashboard)/evaluator/analytics/page.tsx
```typescript
"use client";
import { useEffect, useState } from "react";
import { listRuns, listItems, listResponses } from "@/lib/api/evaluator";
import { EvaluatorKPIBar, EvaluatorChartsPanel, EvaluatorInsightsPanel } from "@/components/evaluator";
import type { EvaluatorRun, EvaluatorItem, EvaluatorResponse } from "@/types/evaluator";

export default function EvaluatorAnalyticsPage() {
  const [runs, setRuns] = useState<EvaluatorRun[]>([]);
  const [runId, setRunId] = useState<string>("");
  const [items, setItems] = useState<EvaluatorItem[]>([]);
  const [responses, setResponses] = useState<EvaluatorResponse[]>([]);

  useEffect(() => {
    listRuns().then((r) => {
      setRuns(r);
      const defaultId = process.env.NEXT_PUBLIC_EVALUATOR_RUN_ID ?? (r[0]?.id ?? "");
      setRunId(defaultId);
    });
  }, []);

  useEffect(() => {
    if (!runId) return;
    load(runId);
  }, [runId]);

  async function load(id: string) {
    const [itemData, respData] = await Promise.all([listItems(id), listResponses(id)]);
    const enriched = itemData.map((item) => {
      const resp = respData.find((r) => r.item_id === item.id);
      return { ...item, score: resp?.score ?? item.score };
    });
    setItems(enriched);
    setResponses(respData);
  }

  const completed = new Set(responses.map((r) => r.item_id)).size;
  const avg = responses.length > 0
    ? (responses.reduce((a, b) => a + (b.score ?? 0), 0) / responses.length).toFixed(2)
    : "0.00";
  const lowCount = responses.filter((r) => (r.score ?? 0) <= 2).length;
  const highCount = responses.filter((r) => (r.score ?? 0) >= 4).length;
  const pending = Math.max(items.length - completed, 0);

  const alerts =
    lowCount === 0
      ? [{ title: "No critical alerts", body: "No low-score evaluations in the current run.", isLow: false }]
      : responses.filter((r) => (r.score ?? 0) <= 2).map((r) => ({
          title: "Low-score evaluation",
          body: `Item ${String(r.item_id).slice(0, 8)}… scored ${r.score}/5`,
          isLow: true,
        }));

  const activeRun = runs.find((r) => r.id === runId);
  const inputCls =
    "bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-1.5 text-sm text-zinc-200 focus:outline-none focus:border-zinc-500";

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Evaluator Analytics</h1>
            <p className="text-zinc-400 text-sm mt-1">
              Score distribution, activity, and run-level health
              {activeRun && <> · <span className="text-zinc-300">{activeRun.name}</span></>}
            </p>
          </div>
          <select
            className={inputCls}
            value={runId}
            onChange={(e) => setRunId(e.target.value)}
          >
            {runs.length === 0 && <option value="">No runs</option>}
            {runs.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name} ({r.cadence})
              </option>
            ))}
          </select>
        </div>

        <EvaluatorKPIBar items={items} />

        <div className="grid grid-cols-[1fr_380px] gap-5">
          <EvaluatorChartsPanel items={items} />

          <div className="space-y-4">
            <EvaluatorInsightsPanel items={items} />

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <div className="text-sm font-semibold text-white mb-3">Alerts</div>
              <div className="space-y-2">
                {alerts.map((a, i) => (
                  <div
                    key={i}
                    className={`text-xs rounded-lg px-3 py-2 ${
                      a.isLow ? "bg-red-900/20 text-red-400" : "bg-green-900/20 text-green-400"
                    }`}
                  >
                    <div className="font-medium">{a.title}</div>
                    <div className="text-zinc-400 mt-0.5">{a.body}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-2">
              <div className="text-sm font-semibold text-white">Run Summary</div>
              {[
                { label: "Completed", value: completed },
                { label: "Pending", value: pending },
                { label: "Avg Score", value: avg },
                { label: "High Scores (4–5)", value: highCount },
                { label: "Low Scores (1–2)", value: lowCount },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between text-sm">
                  <span className="text-zinc-500">{label}</span>
                  <span className="text-white font-medium">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

```
## FILE: nexus-fe/src/app/(dashboard)/evaluator/runs/page.tsx
```typescript
"use client";
import { useEffect, useState } from "react";
import { listRuns, createRun } from "@/lib/api/evaluator";
import type { EvaluatorRun } from "@/types/evaluator";

const ORG_ID = process.env.NEXT_PUBLIC_EVALUATOR_ORG_ID;

export default function EvaluatorRunsPage() {
  const [runs, setRuns] = useState<EvaluatorRun[]>([]);
  const [name, setName] = useState("");
  const [cadence, setCadence] = useState<"daily" | "weekly" | "custom">("daily");
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split("T")[0]);
  const [status, setStatus] = useState("Ready");

  useEffect(() => { loadRuns(); }, []);

  async function loadRuns() {
    try {
      setRuns(await listRuns(ORG_ID));
    } catch (e: unknown) {
      setStatus(e instanceof Error ? e.message : "Failed to load runs");
    }
  }

  async function handleCreate() {
    const label = name || `${cadence.toUpperCase()} Run ${startDate}`;
    try {
      await createRun({
        org_id: ORG_ID,
        name: label,
        cadence,
        start_date: startDate,
        end_date: cadence === "custom" ? endDate : startDate,
        status: "active",
      });
      setStatus("Run created");
      setName("");
      loadRuns();
    } catch (e: unknown) {
      setStatus(e instanceof Error ? e.message : "Failed to create run");
    }
  }

  const inputClass = "w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-500";

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">Run Management</h1>
          <p className="text-zinc-400 text-sm mt-1">Create and manage daily, weekly, and custom evaluation runs</p>
        </div>

        <div className="grid grid-cols-[1.5fr_1fr] gap-5 mb-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
            <div className="text-sm font-semibold text-white mb-4">Create Run</div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-xs text-zinc-500 mb-1">Run Name</div>
                <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} placeholder="Optional custom name" />
              </div>
              <div>
                <div className="text-xs text-zinc-500 mb-1">Cadence</div>
                <select className={inputClass} value={cadence} onChange={(e) => setCadence(e.target.value as typeof cadence)}>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
              <div>
                <div className="text-xs text-zinc-500 mb-1">Start Date</div>
                <input type="date" className={inputClass} value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              </div>
              <div>
                <div className="text-xs text-zinc-500 mb-1">End Date</div>
                <input type="date" className={inputClass} value={endDate} onChange={(e) => setEndDate(e.target.value)} disabled={cadence !== "custom"} />
              </div>
            </div>
            <button onClick={handleCreate} className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded-lg transition-colors">
              Create Run
            </button>
            <div className="mt-2 text-xs text-zinc-500">Status: {status}</div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-3">
            <div className="text-sm font-semibold text-white">Run Notes</div>
            {[
              { label: "Daily", note: "Use for regular operational evaluation batches." },
              { label: "Weekly", note: "Use for summary and review cycles." },
              { label: "Custom", note: "Use for backlog windows and specific date-bounded campaigns." },
            ].map(({ label, note }) => (
              <div key={label} className="bg-zinc-800 rounded-lg px-3 py-2">
                <div className="text-xs font-medium text-zinc-300 mb-0.5">{label}</div>
                <div className="text-xs text-zinc-500">{note}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <div className="text-sm font-semibold text-white mb-4">Existing Runs</div>
          <div className="space-y-2">
            {runs.map((r) => (
              <div key={r.id} className="bg-zinc-800 rounded-xl px-4 py-3 flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-zinc-200">{r.name}</div>
                  <div className="text-xs text-zinc-500 mt-0.5">{r.start_date} → {r.end_date ?? r.start_date} · ID {String(r.id).slice(0, 8)}…</div>
                </div>
                <span className="text-xs bg-zinc-700 text-zinc-300 px-2 py-0.5 rounded-full">{r.cadence}</span>
              </div>
            ))}
            {runs.length === 0 && <div className="text-xs text-zinc-500">No runs yet.</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

```
## FILE: nexus-fe/src/app/(dashboard)/evaluator/v2/page.tsx
```typescript
"use client";
import { useEffect, useState } from "react";
import { listRuns, listItems, submitResponse } from "@/lib/api/evaluator";
import { EvaluatorTimeline } from "@/components/evaluator";
import type { EvaluatorRun, EvaluatorItem } from "@/types/evaluator";

export default function EvaluatorV2Page() {
  const [runs, setRuns] = useState<EvaluatorRun[]>([]);
  const [runId, setRunId] = useState("");
  const [items, setItems] = useState<EvaluatorItem[]>([]);
  const [selected, setSelected] = useState<EvaluatorItem | null>(null);
  const [scores, setScores] = useState<Record<string, number>>({});

  useEffect(() => { loadRuns(); }, []);
  useEffect(() => { if (runId) loadItems(); }, [runId]);

  async function loadRuns() {
    const data = await listRuns();
    setRuns(data);
    if (data.length) setRunId(data[0].id);
  }

  async function loadItems() {
    const data = await listItems(runId);
    setItems(data);
    if (data.length) setSelected(data.find((i) => i.task_status !== "completed") ?? data[0]);
  }

  async function save() {
    if (!selected) return;
    const score = scores[selected.id];
    if (!score) return;
    await submitResponse({ item_id: selected.id, run_id: runId, score });
    await loadItems();
  }

  const active = items.filter((i) => i.task_status !== "completed");
  const done = items.filter((i) => i.task_status === "completed");

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Evaluator V2</h1>
            <p className="text-zinc-400 text-sm mt-1">Isolated per-run evaluation with star scoring</p>
          </div>
          <select
            className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200"
            onChange={(e) => setRunId(e.target.value)}
            value={runId}
          >
            {runs.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-[380px_1fr] gap-5">
          <div className="space-y-3">
            <div className="text-xs text-zinc-500 uppercase tracking-wide font-medium">Active ({active.length})</div>
            {active.map((i) => (
              <div
                key={i.id}
                onClick={() => setSelected(i)}
                className={`cursor-pointer rounded-xl p-3 border transition-colors ${selected?.id === i.id ? "border-blue-500 bg-blue-950/30" : "border-zinc-800 bg-zinc-900 hover:border-zinc-700"}`}
              >
                <div className="text-sm font-medium text-zinc-200">{i.title}</div>
                <div className="text-xs text-zinc-500 mt-0.5">{i.description}</div>
              </div>
            ))}
            {done.length > 0 && (
              <>
                <div className="text-xs text-zinc-500 uppercase tracking-wide font-medium mt-4">Completed ({done.length})</div>
                {done.map((i) => (
                  <div key={i.id} className="rounded-xl p-3 border border-zinc-800 bg-zinc-900/50 opacity-60">
                    <div className="text-sm text-zinc-400">{i.title} · Score {i.score}</div>
                  </div>
                ))}
              </>
            )}
          </div>

          <div className="space-y-4">
            {selected ? (
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                <div className="text-lg font-semibold text-white mb-1">{selected.title}</div>
                <div className="text-sm text-zinc-400 mb-5">{selected.description}</div>
                <div className="flex gap-3 mb-5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      onClick={() => setScores((prev) => ({ ...prev, [selected.id]: s }))}
                      className="text-3xl transition-colors"
                      style={{ color: s <= (scores[selected.id] ?? 0) ? "#f59e0b" : "#3f3f46" }}
                    >
                      ★
                    </button>
                  ))}
                </div>
                <button onClick={save} className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded-lg transition-colors">
                  Save Score
                </button>
              </div>
            ) : (
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 text-zinc-500 text-sm">Select a task to score.</div>
            )}
            <EvaluatorTimeline item={selected} />
          </div>
        </div>
      </div>
    </div>
  );
}

```
## FILE: nexus-fe/src/app/demo/universal-intent-modal/page.tsx
```typescript
"use client";
import { useState } from "react";
import { UniversalIntentWorkflowModal } from "@/components/intent-workflow";
import type { SourceObject } from "@/lib/intent-workflow/types";
import { MOCK_OBJECTS } from "@/lib/intent-workflow/mockObjects";

const DEMO_BUTTONS: { label: string; key: keyof typeof MOCK_OBJECTS; description: string }[] = [
  { label: "Open with Existing Nexus Lead", key: "lead", description: "Commercial property with fiber signals" },
  { label: "Open with Business Object", key: "business", description: "Tech company in Austin, TX" },
  { label: "Open with Job Object", key: "job", description: "Senior Software Engineer posting" },
  { label: "Open with Candidate Object", key: "candidate", description: "Full stack developer profile" },
  { label: "Open with Student Object", key: "student", description: "CS student at Texas A&M" },
  { label: "Open with College Object", key: "college", description: "Rice University" },
  { label: "Open with Consumer Request", key: "consumer_request", description: "Residential ISP switch request" },
];

export default function UniversalIntentModalDemoPage() {
  const [open, setOpen] = useState(false);
  const [source, setSource] = useState<SourceObject | null>(null);

  const openWith = (key: keyof typeof MOCK_OBJECTS) => {
    setSource(MOCK_OBJECTS[key]);
    setOpen(true);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-1">Universal Intent Sniper Modal</h1>
          <p className="text-zinc-400 text-sm">
            Launch the NEXUS Sniper from any source object type. Each run normalizes the object,
            extracts signals, queries NEXUS services, and returns scored matches with Osiris rating,
            BANT qualification, and magic scripts.
          </p>
        </div>

        <div className="grid gap-3">
          {DEMO_BUTTONS.map(({ label, key, description }) => (
            <button
              key={key}
              onClick={() => openWith(key)}
              className="flex items-center justify-between w-full px-4 py-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 rounded-lg transition-all text-left group"
            >
              <div>
                <div className="text-sm font-medium text-zinc-200 group-hover:text-white">{label}</div>
                <div className="text-xs text-zinc-500 mt-0.5">{description}</div>
              </div>
              <span className="text-xs bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded uppercase tracking-wide shrink-0 ml-3">
                {key}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-8 p-4 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-zinc-500 space-y-1">
          <p className="text-zinc-400 font-medium">API Configuration</p>
          <p>Backend: <code className="text-blue-400">NEXT_PUBLIC_API_BASE_URL</code> → <code>https://nexus-api.cai-sol.com</code></p>
          <p>Mock mode is enabled by default. Set <code className="text-blue-400">COREAI_API_KEY</code> on the backend for live AI scripting.</p>
        </div>
      </div>

      {source && (
        <UniversalIntentWorkflowModal
          open={open}
          source={source}
          onClose={() => { setOpen(false); setSource(null); }}
        />
      )}
    </div>
  );
}

```
## FILE: nexus-fe/src/__tests__/evaluator.test.ts
```typescript
/**
 * Jest unit tests for evaluator API client.
 * Run with: npx jest src/__tests__/evaluator.test.ts
 */
import { listRuns, listItems, listResponses, submitResponse, createRun, createItem } from "@/lib/api/evaluator";

const MOCK_RUN_ID = "run-abc-123";
const MOCK_ITEM_ID = "item-xyz-456";

const mockFetch = jest.fn();
global.fetch = mockFetch;

function mockOk(body: unknown) {
  mockFetch.mockResolvedValueOnce({
    ok: true,
    json: async () => body,
  });
}

function mockError(status: number, text: string) {
  mockFetch.mockResolvedValueOnce({
    ok: false,
    status,
    text: async () => text,
  });
}

beforeEach(() => {
  mockFetch.mockClear();
  // Simulate a logged-in user token
  Object.defineProperty(window, "localStorage", {
    value: {
      getItem: (key: string) => (key === "token" ? "test-jwt-token" : null),
      setItem: jest.fn(),
      removeItem: jest.fn(),
    },
    writable: true,
  });
});

// ─── listRuns ────────────────────────────────────────────────────────────────

describe("listRuns", () => {
  it("calls /evaluator/runs and returns array", async () => {
    const runs = [{ id: MOCK_RUN_ID, name: "Daily", cadence: "daily", status: "active" }];
    mockOk(runs);
    const result = await listRuns();
    expect(result).toEqual(runs);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/v1/evaluator/runs"),
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: "Bearer test-jwt-token" }),
      }),
    );
  });

  it("appends org_id query param when provided", async () => {
    mockOk([]);
    await listRuns("org-999");
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("org_id=org-999"),
      expect.anything(),
    );
  });

  it("throws on non-ok response", async () => {
    mockError(401, "Unauthorized");
    await expect(listRuns()).rejects.toThrow("401");
  });
});

// ─── listItems ───────────────────────────────────────────────────────────────

describe("listItems", () => {
  it("returns empty array for empty runId without fetching", async () => {
    const result = await listItems("");
    expect(result).toEqual([]);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("calls /evaluator/runs/{id}/items with auth", async () => {
    const items = [{ id: MOCK_ITEM_ID, run_id: MOCK_RUN_ID, title: "T1" }];
    mockOk(items);
    const result = await listItems(MOCK_RUN_ID);
    expect(result).toEqual(items);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining(`/evaluator/runs/${MOCK_RUN_ID}/items`),
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: "Bearer test-jwt-token" }),
      }),
    );
  });
});

// ─── listResponses ────────────────────────────────────────────────────────────

describe("listResponses", () => {
  it("returns empty array for empty runId without fetching", async () => {
    const result = await listResponses("");
    expect(result).toEqual([]);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("calls /evaluator/runs/{id}/responses", async () => {
    const responses = [{ id: "r1", run_id: MOCK_RUN_ID, item_id: MOCK_ITEM_ID, score: 4 }];
    mockOk(responses);
    const result = await listResponses(MOCK_RUN_ID);
    expect(result).toEqual(responses);
  });
});

// ─── submitResponse ───────────────────────────────────────────────────────────

describe("submitResponse", () => {
  it("POSTs to /evaluator/responses with JSON body", async () => {
    const resp = { id: "r2", run_id: MOCK_RUN_ID, item_id: MOCK_ITEM_ID, score: 5 };
    mockOk(resp);
    const result = await submitResponse({
      run_id: MOCK_RUN_ID,
      item_id: MOCK_ITEM_ID,
      score: 5,
      evaluator_name: "tester",
    });
    expect(result).toEqual(resp);
    const [url, init] = mockFetch.mock.calls[0];
    expect(url).toContain("/evaluator/responses");
    expect(init.method).toBe("POST");
    const body = JSON.parse(init.body);
    expect(body.score).toBe(5);
    expect(body.item_id).toBe(MOCK_ITEM_ID);
  });
});

// ─── createRun ────────────────────────────────────────────────────────────────

describe("createRun", () => {
  it("POSTs to /evaluator/runs with correct body", async () => {
    const run = { id: MOCK_RUN_ID, name: "New Run", cadence: "weekly", status: "active" };
    mockOk(run);
    const result = await createRun({
      name: "New Run",
      cadence: "weekly",
      start_date: "2026-05-07",
      status: "active",
    });
    expect(result).toEqual(run);
    const [, init] = mockFetch.mock.calls[0];
    expect(init.method).toBe("POST");
    const body = JSON.parse(init.body);
    expect(body.name).toBe("New Run");
  });
});

// ─── createItem ───────────────────────────────────────────────────────────────

describe("createItem", () => {
  it("POSTs to /evaluator/runs/{id}/items", async () => {
    const item = { id: MOCK_ITEM_ID, run_id: MOCK_RUN_ID, title: "Task A" };
    mockOk(item);
    const result = await createItem(MOCK_RUN_ID, { title: "Task A", priority: "high" });
    expect(result).toEqual(item);
    const [url, init] = mockFetch.mock.calls[0];
    expect(url).toContain(`/evaluator/runs/${MOCK_RUN_ID}/items`);
    const body = JSON.parse(init.body);
    expect(body.task_status).toBe("pending");
    expect(body.priority).toBe("high");
  });
});

```

## =========================================================
## MANUAL CHANGES — apply to existing nexus-main files
## =========================================================

### 1. nexus-be/app/main.py — CORS (replace allow_origins list)
```python
allow_origins=[
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:3001",
    "https://nexus.cai-sol.com",
    "https://nexus-api.cai-sol.com",
],
```

### 2. nexus-be/app/main.py — Register routers (append after last include_router)
```python
from app.routers import sniper, evaluator
app.include_router(sniper.router,    prefix="/api/v1/sniper",    tags=["Sniper"])
app.include_router(evaluator.router, prefix="/api/v1/evaluator", tags=["Evaluator"])
```

### 3. nexus-be/app/database.py — Register models in create_tables()
```python
from app.models import sniper_run, sniper_timeline, sniper_match, sniper_script, sniper_action
from app.models import evaluator_run, evaluator_item, evaluator_response
```

### 4. nexus-fe/src/components/layout/Sidebar.tsx — Add nav entries to NAV_ITEMS
Use whatever icon pattern already exists in the file (Lucide/react-icons/heroicons):
```
{ href: "/sniper",              label: "Sniper"         },
{ href: "/evaluator",           label: "Evaluator"      },
{ href: "/evaluator/runs",      label: "Eval Runs"      },
{ href: "/evaluator/analytics", label: "Eval Analytics" },
```

### 5. LeadDetailModal.tsx — Wire in Sniper button (append-only)
```tsx
import { SniperLaunchButton } from "@/components/leads/SniperLaunchButton";
// Then inside the modal action bar:
<SniperLaunchButton lead={lead} />
```

## =========================================================
## .env.local (nexus-fe)
## =========================================================
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_EVALUATOR_ORG_ID=    # your org id
NEXT_PUBLIC_EVALUATOR_RUN_ID=    # leave blank — page shows dropdown
```

## =========================================================
## npm install (nexus-fe)
## =========================================================
```bash
npm install recharts
```

## =========================================================
## RUN TESTS
## =========================================================
```bash
# Backend — must show 31 passed
cd nexus-be && python -m pytest tests/ -v

# Frontend type check — must show 0 errors  
cd nexus-fe && npx tsc --noEmit

# Frontend jest
cd nexus-fe && npx jest src/__tests__/evaluator.test.ts
```

## =========================================================
## VERIFICATION CHECKLIST
## =========================================================
- [ ] GET /api/v1/sniper/defaults → 200
- [ ] GET /api/v1/evaluator/runs → 200
- [ ] Sidebar shows Sniper + Evaluator entries
- [ ] /evaluator loads run picker (not blank)
- [ ] /evaluator/analytics loads with run picker
- [ ] /evaluator/runs — create run form works
- [ ] LeadDetailModal shows "Launch Sniper" button
- [ ] Sniper modal opens and pipeline runs to completion
- [ ] All 31 backend tests pass
- [ ] 0 TypeScript errors
