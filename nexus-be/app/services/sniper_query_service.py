from __future__ import annotations
from typing import Any


def build_sniper_queries(context: dict[str, Any]) -> dict[str, Any]:
    source = context.get("source_object", {})
    targeting = context.get("targeting_plan", {})
    geo = context.get("geo") or source.get("location", "")
    name = source.get("name", "")
    target_type = targeting.get("target_type", "business")
    tags = source.get("tags") or []
    industry = tags[0] if tags else "commercial"

    google_places_queries = _google_places_queries(name, geo, industry, target_type)
    google_dorks = _google_dorks(name, geo, industry, target_type)
    linkedin_queries = _linkedin_queries(name, geo, target_type)

    return {
        "google_places_queries": google_places_queries,
        "google_dorks": google_dorks,
        "company_site_queries": [f'site:linkedin.com/company "{name}"'],
        "linkedin_queries": linkedin_queries,
        "local_business_queries": [f'{industry} businesses near {geo}'],
        "exclusions": ["site:facebook.com", "site:twitter.com", "-residential", "-house"],
    }


def _google_places_queries(name: str, geo: str, industry: str, target_type: str) -> list[str]:
    queries = []
    base_geo = geo.split(",")[0] if geo else "local area"

    if target_type in ("lead", "business"):
        queries.append(f'{industry} companies in {base_geo}')
        queries.append(f'commercial offices {base_geo}')
        queries.append(f'business park {base_geo}')
    elif target_type == "job":
        queries.append(f'hiring companies {base_geo}')
        queries.append(f'staffing agency {base_geo}')
    elif target_type == "college":
        queries.append(f'university college {base_geo}')
    else:
        queries.append(f'{industry} {base_geo}')

    return queries


def _google_dorks(name: str, geo: str, industry: str, target_type: str) -> list[str]:
    dorks = []
    if target_type in ("lead", "business"):
        dorks.append(f'"{industry}" "contact us" "{geo}"')
        dorks.append(f'intitle:"{industry} company" "{geo}" email')
        dorks.append(f'"{industry}" site:linkedin.com/company "{geo}"')
    elif target_type == "candidate":
        dorks.append(f'site:linkedin.com/in "{industry}" "{geo}"')
    return dorks


def _linkedin_queries(name: str, geo: str, target_type: str) -> list[str]:
    queries = []
    if target_type in ("lead", "business"):
        queries.append(f'company location:{geo}')
    elif target_type in ("candidate", "job"):
        queries.append(f'people title:{target_type} location:{geo}')
    return queries
