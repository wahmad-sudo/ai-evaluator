from __future__ import annotations
from typing import Any

SOURCE_TRUST_SCORES = {
    "existing_nexus_lead": 92,
    "google_places": 88,
    "company_site": 85,
    "linkedin": 82,
    "ringcentral_call": 80,
    "news": 75,
    "directory": 55,
    "google_result_only": 45,
    "weak_unknown": 20,
}

DOMAIN_PATTERNS = {
    "maps.google.com": "google_places",
    "google.com/maps": "google_places",
    "linkedin.com": "linkedin",
    "facebook.com": "weak_unknown",
    "twitter.com": "weak_unknown",
    "yelp.com": "directory",
    "yellowpages.com": "directory",
    "bbb.org": "directory",
    "news": "news",
    "reuters": "news",
    "bloomberg": "news",
}


def classify_source(url: str, snippet: str | None = None) -> dict[str, Any]:
    if not url:
        return _result("weak_unknown", url)

    url_lower = url.lower()

    for pattern, source_type in DOMAIN_PATTERNS.items():
        if pattern in url_lower:
            return _result(source_type, url)

    if snippet:
        snippet_lower = snippet.lower()
        if "news" in snippet_lower or "press release" in snippet_lower:
            return _result("news", url)
        if "linkedin" in snippet_lower:
            return _result("linkedin", url)

    if _looks_like_company_site(url_lower):
        return _result("company_site", url)

    if "google" in url_lower:
        return _result("google_result_only", url)

    return _result("weak_unknown", url)


def _looks_like_company_site(url: str) -> bool:
    noise = {"google", "facebook", "twitter", "yelp", "linkedin", "bbb", "yellowpages", "bing", "yahoo"}
    return not any(n in url for n in noise) and url.startswith("http")


def _result(source_type: str, url: str) -> dict[str, Any]:
    return {
        "source_type": source_type,
        "trust_score": SOURCE_TRUST_SCORES.get(source_type, 20),
        "url": url,
    }
