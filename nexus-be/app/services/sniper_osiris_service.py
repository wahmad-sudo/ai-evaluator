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
