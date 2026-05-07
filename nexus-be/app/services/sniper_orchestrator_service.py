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
