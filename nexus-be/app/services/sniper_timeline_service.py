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
