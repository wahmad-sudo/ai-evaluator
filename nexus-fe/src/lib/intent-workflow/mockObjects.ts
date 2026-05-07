import type { SourceObject } from "./types";

export const MOCK_LEAD: SourceObject = {
  object_type: "lead",
  company_name: "Acme Commercial Properties",
  name: "Acme Commercial Properties",
  address: "1234 Commerce Blvd",
  city: "Dallas",
  state: "TX",
  zip_code: "75201",
  location: "1234 Commerce Blvd, Dallas, TX 75201",
  website: "https://acmecommercial.example.com",
  phone: "+1-214-555-0100",
  email: "info@acmecommercial.example.com",
  industry: "Commercial Real Estate",
  lead_category: "Multi-Tenant",
  decision_maker_name: "John Smith",
  decision_maker_role: "Property Manager",
  near_net_fiber: true,
  atlas_checked: true,
  current_internet_provider: "AT&T",
  contact_status: "New",
  opportunity_stage: "Prospect",
  deal_value_mrr: 1200,
  google_maps_url: "https://maps.google.com/?cid=example_lead",
  signals: ["near_net_opportunity", "decision_maker_present", "atlas_verified"],
};

export const MOCK_BUSINESS: SourceObject = {
  object_type: "business",
  name: "Summit Tech Solutions",
  location: "456 Tech Park Dr, Austin, TX 78701",
  website: "https://summittech.example.com",
  phone: "+1-512-555-0200",
  email: "hello@summittech.example.com",
  industry: "Technology",
  signals: ["website_present", "email_found", "phone_found"],
};

export const MOCK_JOB: SourceObject = {
  object_type: "job",
  name: "Senior Software Engineer",
  title: "Senior Software Engineer",
  company: "NexusCorp",
  location: "Houston, TX 77002",
  website: "https://nexuscorp.example.com/careers",
  industry: "Software",
  signals: ["hiring"],
};

export const MOCK_CANDIDATE: SourceObject = {
  object_type: "candidate",
  name: "Jane Doe",
  title: "Full Stack Developer",
  location: "San Antonio, TX 78201",
  skills: ["React", "Python", "FastAPI"],
  signals: ["available", "website_present"],
};

export const MOCK_STUDENT: SourceObject = {
  object_type: "student",
  name: "Alex Johnson",
  location: "College Station, TX",
  institution: "Texas A&M University",
  field: "Computer Science",
  gpa: 3.8,
  signals: ["graduation_upcoming"],
};

export const MOCK_COLLEGE: SourceObject = {
  object_type: "college",
  name: "Rice University",
  location: "Houston, TX 77005",
  website: "https://rice.edu",
  enrollment: 4000,
  signals: ["vendor_need"],
};

export const MOCK_CONSUMER: SourceObject = {
  object_type: "consumer_request",
  name: "Residential Customer",
  location: "Plano, TX 75023",
  phone: "+1-972-555-0300",
  signals: ["consumer_pain", "provider_switch"],
};

export const MOCK_OBJECTS: Record<string, SourceObject> = {
  lead: MOCK_LEAD,
  business: MOCK_BUSINESS,
  job: MOCK_JOB,
  candidate: MOCK_CANDIDATE,
  student: MOCK_STUDENT,
  college: MOCK_COLLEGE,
  consumer_request: MOCK_CONSUMER,
};
