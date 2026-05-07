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
