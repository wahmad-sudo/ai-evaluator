from __future__ import annotations
from typing import Any

TARGETING_MATRIX: dict[str, dict[str, Any]] = {
    "lead": {
        "recommended_targets": ["business", "lead"],
        "buyer_persona": "Commercial Property Owner / IT Decision Maker",
        "icp_summary": "Mid-market businesses with 10–200 employees needing fiber connectivity",
        "authority_clues": ["IT Manager", "Operations Director", "Owner", "Property Manager"],
        "contact_path": "Cold call → Email → LinkedIn",
        "targeting_route": "Google Places → Lead Service → Near-Net Check",
        "confidence": 88,
    },
    "business": {
        "recommended_targets": ["lead", "business"],
        "buyer_persona": "C-Suite / IT Director",
        "icp_summary": "Commercial businesses seeking telecom upgrade or provider switch",
        "authority_clues": ["CEO", "CTO", "IT Director", "VP Operations"],
        "contact_path": "LinkedIn → Email → Call",
        "targeting_route": "Harvester → Google Places → Email Collector",
        "confidence": 84,
    },
    "job": {
        "recommended_targets": ["candidate", "college"],
        "buyer_persona": "Job Seeker / Recruiter",
        "icp_summary": "Active candidates matching role requirements",
        "authority_clues": ["Hiring Manager", "HR Director", "Recruiter"],
        "contact_path": "LinkedIn → Email",
        "targeting_route": "LinkedIn Dork → College Career Pages → Job Boards",
        "confidence": 72,
    },
    "candidate": {
        "recommended_targets": ["job", "business"],
        "buyer_persona": "Employer / Hiring Manager",
        "icp_summary": "Companies actively hiring for matching skills",
        "authority_clues": ["Hiring Manager", "HR", "Department Lead"],
        "contact_path": "LinkedIn → Company Email",
        "targeting_route": "LinkedIn → Indeed → Company Site",
        "confidence": 75,
    },
    "student": {
        "recommended_targets": ["college", "job"],
        "buyer_persona": "College Admissions / Employer",
        "icp_summary": "Colleges or employers seeking talent pipeline",
        "authority_clues": ["Admissions Officer", "Career Services", "Recruiter"],
        "contact_path": "Email → LinkedIn",
        "targeting_route": "College Sites → LinkedIn → Indeed",
        "confidence": 68,
    },
    "college": {
        "recommended_targets": ["student", "vendor"],
        "buyer_persona": "Student Prospects / Vendors",
        "icp_summary": "High school seniors or vendors serving education sector",
        "authority_clues": ["Dean", "Procurement Officer"],
        "contact_path": "Email → Phone",
        "targeting_route": "High School Sites → Google Places → Vendor Directories",
        "confidence": 65,
    },
    "consumer_request": {
        "recommended_targets": ["business", "lead"],
        "buyer_persona": "Consumer seeking service resolution",
        "icp_summary": "Residential or SMB consumer needing telecom service",
        "authority_clues": ["Account Holder"],
        "contact_path": "Email → Call",
        "targeting_route": "CRM Lookup → Google Places",
        "confidence": 70,
    },
}


def build_targeting_plan(source_object: dict[str, Any], target_object_type: str) -> dict[str, Any]:
    obj_type = source_object.get("object_type", "lead")
    matrix = TARGETING_MATRIX.get(obj_type, TARGETING_MATRIX["lead"])

    effective_target = target_object_type if target_object_type and target_object_type != "any" else matrix["recommended_targets"][0]

    return {
        "source_type": obj_type,
        "target_type": effective_target,
        "recommended_target": matrix["recommended_targets"][0],
        "buyer_persona": matrix["buyer_persona"],
        "icp_summary": matrix["icp_summary"],
        "authority_clues": matrix["authority_clues"],
        "contact_path": matrix["contact_path"],
        "best_targeting_route": matrix["targeting_route"],
        "targeting_confidence": matrix["confidence"],
        "nexus_paths_activated": _nexus_paths(obj_type),
    }


def _nexus_paths(obj_type: str) -> list[str]:
    paths = ["Lead Service", "Audit Service"]
    if obj_type in ("lead", "business", "consumer_request"):
        paths += ["Harvester Service", "Google Places", "Email Collector"]
    if obj_type == "lead":
        paths.append("Atlas / Near-Net Check")
    return paths
