from __future__ import annotations
import os
from typing import Any


def generate_magic_script(
    source_object: dict[str, Any],
    matched_object: dict[str, Any],
    qualification: dict[str, Any],
    osiris: dict[str, Any],
    manual_override: dict[str, Any] | None = None,
) -> dict[str, Any]:
    override = manual_override or {}

    api_key = os.getenv("COREAI_API_KEY")
    model = os.getenv("COREAI_MODEL", "gpt-4o")

    if api_key:
        try:
            return _generate_with_ai(source_object, matched_object, qualification, osiris, override, api_key, model)
        except Exception:
            pass

    return _generate_template(source_object, matched_object, qualification, osiris, override)


def _generate_with_ai(
    source: dict, match: dict, qual: dict, osiris: dict, override: dict, api_key: str, model: str
) -> dict[str, Any]:
    from openai import OpenAI

    client = OpenAI(api_key=api_key)

    src_name = source.get("name", "the prospect")
    match_name = match.get("name") or match.get("company", "your business")
    location = match.get("location", "")
    verdict = osiris.get("verdict", "")
    score = qual.get("composite_score", 0)
    tone = override.get("tone", "professional")
    pain_focus = override.get("pain_focus", "fiber connectivity and bandwidth needs")
    custom_hook = override.get("custom_hook", "")

    prompt = f"""You are an expert SDR for a fiber internet sales company.

Source: {src_name} ({source.get('object_type', 'lead')})
Target: {match_name}, {location}
Osiris verdict: {verdict} | BANT score: {score}
Tone: {tone}
Pain focus: {pain_focus}
{f'Custom hook: {custom_hook}' if custom_hook else ''}

Generate a complete outreach script package with these exact keys:
- hook: One powerful opening sentence
- pain_summary: 2-3 sentence pain summary
- email_script: Full cold email (subject + body)
- linkedin_script: LinkedIn connection request message (under 300 chars)
- call_script: Full cold call script with objection handlers
- ringcentral_call_opener: First 10 seconds of the call (for SDR quick reference)
- cta: The call to action
- follow_up: Follow-up sequence (3 steps)

Respond in JSON only."""

    response = client.chat.completions.create(
        model=model,
        messages=[{"role": "user", "content": prompt}],
        response_format={"type": "json_object"},
        temperature=0.7,
    )

    import json
    result = json.loads(response.choices[0].message.content)
    result["mock"] = False
    return result


def _generate_template(
    source: dict, match: dict, qual: dict, osiris: dict, override: dict
) -> dict[str, Any]:
    name = match.get("name") or match.get("company", "your team")
    location = match.get("location", "your area")
    src_name = source.get("name", "us")
    verdict = osiris.get("verdict", "")
    score = qual.get("composite_score", 0)
    tone = override.get("tone", "professional")
    pain_focus = override.get("pain_focus", "fiber connectivity")
    custom_hook = override.get("custom_hook", "")

    hook = custom_hook or f"I noticed {name} in {location} and wanted to connect about fiber internet solutions that could reduce your telecom costs."

    return {
        "hook": hook,
        "pain_summary": (
            f"{name} likely faces increasing bandwidth demands and rising telecom costs. "
            f"Many businesses in {location} are switching to fiber to get better speeds at lower rates. "
            f"With an Osiris score of {verdict} and BANT score of {score}, this is a strong opportunity."
        ),
        "email_script": (
            f"Subject: Fiber Internet for {name} — Quick Question\n\n"
            f"Hi [First Name],\n\n"
            f"I came across {name} and noticed you might benefit from a fiber upgrade.\n\n"
            f"We help businesses in {location} cut telecom costs by 20–40% while doubling bandwidth. "
            f"Would you be open to a 15-minute call this week?\n\n"
            f"Best,\n[SDR Name]\n[Company]"
        ),
        "linkedin_script": (
            f"Hi [Name], I work with businesses in {location} on fiber solutions. "
            f"Saw {name} and thought there might be a fit. Open to a quick chat?"
        ),
        "call_script": (
            f"OPENER:\n"
            f"'Hi, is this [Decision Maker]? Great — this is [Name] from [Company]. "
            f"I'm reaching out to businesses in {location} about fiber internet — do you have 2 minutes?'\n\n"
            f"VALUE:\n"
            f"'We help companies like {name} reduce telecom costs while getting faster, more reliable connectivity.'\n\n"
            f"OBJECTION — 'Not interested':\n"
            f"'I completely understand. Can I ask — are you happy with your current provider's speed and pricing?'\n\n"
            f"CTA:\n"
            f"'Could we schedule a 15-minute discovery call? I can show you exactly what we could save you.'"
        ),
        "ringcentral_call_opener": (
            f"'Hi [Name], this is [SDR] from [Company] — calling about fiber internet for {name} in {location}. "
            f"Do you have 2 minutes?'"
        ),
        "cta": "Schedule a 15-minute discovery call to review your current telecom spend and see if we can beat your current rate.",
        "follow_up": (
            "Step 1 (Day 3): Send follow-up email referencing initial outreach.\n"
            "Step 2 (Day 7): LinkedIn message with a case study.\n"
            "Step 3 (Day 14): Final call attempt — leave voicemail and send closing email."
        ),
        "mock": True,
    }
