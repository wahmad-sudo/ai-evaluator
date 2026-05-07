from __future__ import annotations
import uuid
from typing import Any
from sqlalchemy.orm import Session


def execute_search_paths(db: Session, query_plan: dict[str, Any], mock_mode: bool = False) -> list[dict[str, Any]]:
    results: list[dict[str, Any]] = []

    if mock_mode:
        return _mock_results(query_plan)

    gp_queries = query_plan.get("google_places_queries") or []
    if gp_queries:
        try:
            from app.utils.google_places import search_places
            for query in gp_queries[:3]:
                places = search_places(query)
                for p in places:
                    results.append({**p, "source_type": "google_places", "mock": False})
        except Exception:
            results.extend(_mock_results(query_plan))

    if not results:
        results = _mock_results(query_plan)

    return results


def _mock_results(query_plan: dict[str, Any]) -> list[dict[str, Any]]:
    queries = query_plan.get("google_places_queries") or ["commercial business"]
    base_query = queries[0] if queries else "business"

    return [
        {
            "name": f"Acme Corp ({base_query.title()})",
            "location": "123 Main St, Dallas, TX 75201",
            "website": "https://acmecorp.example.com",
            "source_url": "https://maps.google.com/?cid=example1",
            "phone": "+1-214-555-0100",
            "email": None,
            "intent": "Fiber upgrade candidate — near-net eligible",
            "freshness_score": 75.0,
            "match_uuid": str(uuid.uuid4()),
            "source_type": "google_places",
            "mock": True,
        },
        {
            "name": f"Nexus Industrial ({base_query.title()})",
            "location": "456 Commerce Blvd, Austin, TX 78701",
            "website": "https://nexusindustrial.example.com",
            "source_url": "https://maps.google.com/?cid=example2",
            "phone": "+1-512-555-0200",
            "email": "info@nexusindustrial.example.com",
            "intent": "Provider switch opportunity — contract end Q3",
            "freshness_score": 82.0,
            "match_uuid": str(uuid.uuid4()),
            "source_type": "google_places",
            "mock": True,
        },
        {
            "name": f"Summit Business Center ({base_query.title()})",
            "location": "789 Tech Park, Houston, TX 77002",
            "website": "https://summitbc.example.com",
            "source_url": "https://maps.google.com/?cid=example3",
            "phone": "+1-713-555-0300",
            "email": None,
            "intent": "Multi-tenant property — high MRR potential",
            "freshness_score": 68.0,
            "match_uuid": str(uuid.uuid4()),
            "source_type": "google_places",
            "mock": True,
        },
    ]
