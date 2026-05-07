"use client";
import { useState } from "react";
import { UniversalIntentWorkflowModal } from "@/components/intent-workflow/UniversalIntentWorkflowModal";
import type { SourceObject } from "@/lib/intent-workflow/types";

interface NexusLead {
  id?: string | number;
  name?: string;
  first_name?: string;
  last_name?: string;
  company?: string;
  company_name?: string;
  title?: string;
  location?: string;
  city?: string;
  state?: string;
  website?: string;
  linkedin_url?: string;
  source_url?: string;
  tags?: string[];
  [key: string]: unknown;
}

interface Props {
  lead: NexusLead;
  className?: string;
}

function mapLeadToSourceObject(lead: NexusLead): SourceObject {
  const name =
    lead.name ??
    [lead.first_name, lead.last_name].filter(Boolean).join(" ") ??
    lead.company_name ??
    lead.company ??
    "";
  const location =
    lead.location ??
    [lead.city, lead.state].filter(Boolean).join(", ") ??
    "";

  return {
    object_type: "lead",
    name,
    title: lead.title,
    company_name: lead.company_name ?? lead.company,
    location: location || undefined,
    website: lead.website,
    source_url: lead.linkedin_url ?? lead.source_url,
    tags: lead.tags,
  };
}

export function SniperLaunchButton({ lead, className = "" }: Props) {
  const [open, setOpen] = useState(false);
  const sourceObject = mapLeadToSourceObject(lead);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium rounded-lg transition-colors ${className}`}
      >
        <svg
          className="w-3.5 h-3.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
          <path d="M5.636 5.636l2.122 2.122M16.243 16.243l2.121 2.121M5.636 18.364l2.122-2.121M16.243 7.757l2.121-2.121" />
        </svg>
        Launch Sniper
      </button>

      <UniversalIntentWorkflowModal
        open={open}
        source={sourceObject}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
