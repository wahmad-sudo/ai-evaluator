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
