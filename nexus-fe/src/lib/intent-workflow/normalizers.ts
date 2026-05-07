import type { SourceObject, SourceObjectType } from "./types";

export function normalizeSourceObject(raw: Record<string, unknown>): SourceObject {
  const type = (raw.object_type ?? raw.type ?? inferType(raw)) as SourceObjectType;

  if (type === "lead") return normalizeLead(raw);

  return {
    object_type: type,
    name: (raw.name ?? raw.title ?? raw.company_name ?? "Unknown") as string,
    location: extractLocation(raw),
    website: raw.website as string | undefined,
    source_url: raw.source_url as string | undefined,
    tags: (raw.tags ?? raw.industry ? [raw.industry] : []) as string[],
    signals: (raw.signals ?? []) as string[],
    ...raw,
  };
}

function normalizeLead(raw: Record<string, unknown>): SourceObject {
  const parts = [raw.address, raw.city, raw.state, raw.zip_code].filter(Boolean);
  const signals: string[] = [];

  if (raw.near_net_fiber) signals.push("near_net_opportunity");
  if (raw.atlas_checked) signals.push("atlas_verified");
  if (raw.appointment_set) signals.push("appointment_set");
  if (raw.decision_maker_name) signals.push("decision_maker_present");
  if (raw.website) signals.push("website_present");
  if (raw.email) signals.push("email_found");
  if (raw.phone) signals.push("phone_found");

  return {
    object_type: "lead",
    name: (raw.company_name ?? "Unknown") as string,
    location: parts.join(", "),
    website: raw.website as string | undefined,
    source_url: raw.google_maps_url as string | undefined,
    tags: [raw.industry, raw.lead_category].filter(Boolean) as string[],
    signals,
    ...raw,
  };
}

function extractLocation(raw: Record<string, unknown>): string {
  const parts = [raw.address, raw.city, raw.state, raw.zip, raw.country].filter(Boolean);
  return parts.join(", ") || (raw.location as string) || "";
}

function inferType(raw: Record<string, unknown>): SourceObjectType {
  if (raw.company_name != null || raw.near_net_fiber != null) return "lead";
  if (raw.job_title != null || raw.open_role != null) return "job";
  if (raw.resume != null || raw.skills != null) return "candidate";
  if (raw.gpa != null || raw.major != null) return "student";
  if (raw.enrollment != null) return "college";
  return "business";
}
