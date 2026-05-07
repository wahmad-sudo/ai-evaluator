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
