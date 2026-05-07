"use client";
import type { TargetObjectType } from "@/lib/intent-workflow/types";

const TARGET_TYPES: { value: TargetObjectType; label: string }[] = [
  { value: "any", label: "Any" },
  { value: "lead", label: "Lead" },
  { value: "business", label: "Business" },
  { value: "job", label: "Job" },
  { value: "candidate", label: "Candidate" },
  { value: "student", label: "Student" },
  { value: "college", label: "College" },
  { value: "vendor", label: "Vendor" },
  { value: "permit", label: "Permit" },
  { value: "rfp", label: "RFP" },
  { value: "post", label: "Post" },
  { value: "property", label: "Property" },
  { value: "consumer_request", label: "Consumer Request" },
];

interface Props {
  value: TargetObjectType;
  onChange: (v: TargetObjectType) => void;
  disabled?: boolean;
}

export function TargetObjectSelector({ value, onChange, disabled }: Props) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as TargetObjectType)}
      disabled={disabled}
      className="bg-zinc-800 border border-zinc-700 text-zinc-200 text-sm rounded px-3 py-1.5 disabled:opacity-50"
    >
      {TARGET_TYPES.map(({ value: v, label }) => (
        <option key={v} value={v}>{label}</option>
      ))}
    </select>
  );
}
