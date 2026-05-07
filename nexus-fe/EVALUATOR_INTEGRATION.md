# AI Evaluator — Nexus Integration

## Routes added

| Path | Description |
|------|-------------|
| `/evaluator` | Score evaluation tasks (main evaluator) |
| `/evaluator/v2` | Isolated per-run evaluator with star scoring |
| `/evaluator/runs` | Create & manage daily/weekly/custom runs |
| `/evaluator/analytics` | Dashboard: KPI bar, score charts, AI insights |

## Files added

```
nexus-fe/src/lib/supabase.ts                          — Supabase client
nexus-fe/src/types/evaluator.ts                       — TypeScript types
nexus-fe/src/components/evaluator/
  EvaluatorKPIBar.tsx
  EvaluatorFilterBar.tsx
  EvaluatorInsightsPanel.tsx
  EvaluatorChartsPanel.tsx
  EvaluatorRunTaskManager.tsx
  EvaluatorTimeline.tsx
  index.ts
nexus-fe/src/app/(dashboard)/evaluator/
  page.tsx                                            — Main evaluator
  v2/page.tsx                                         — V2 evaluator
  runs/page.tsx                                       — Run management
  analytics/page.tsx                                  — Analytics dashboard
```

## Required env vars (add to nexus-fe .env.local)

```env
NEXT_PUBLIC_EVALUATOR_SUPABASE_URL=https://qigupqtkxfiwssegvrsk.supabase.co
NEXT_PUBLIC_EVALUATOR_SUPABASE_ANON_KEY=sb_publishable_KOxnEw8OnXYUjj1rjj4igw_tzc-3Vzl
NEXT_PUBLIC_EVALUATOR_RUN_ID=f4790bd3-210e-4657-847d-cf4e619b1d98
NEXT_PUBLIC_EVALUATOR_ORG_ID=70386368-862f-4f4d-a2bd-ecff976756d3
```

## Required npm dependency

```bash
npm install @supabase/supabase-js recharts
```

## Supabase tables required

| Table | Key columns |
|-------|-------------|
| `runs` | id, org_id, name, cadence, start_date, end_date, status |
| `items` | id, run_id, input, ai_output, title, description, priority, task_status, score, position, started_at, ended_at |
| `responses` | id, run_id, item_id, score, evaluator_name, organization_name |

## Add to nexus-fe sidebar nav

```tsx
{ href: "/evaluator", label: "Evaluator" }
{ href: "/evaluator/runs", label: "Eval Runs" }
{ href: "/evaluator/analytics", label: "Eval Analytics" }
```
