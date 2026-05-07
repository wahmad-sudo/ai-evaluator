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
