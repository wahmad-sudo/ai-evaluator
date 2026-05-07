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
