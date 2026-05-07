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
