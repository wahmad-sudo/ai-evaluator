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
