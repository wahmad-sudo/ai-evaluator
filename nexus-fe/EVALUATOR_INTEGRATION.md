# AI Evaluator — Nexus Integration

Evaluator runs on the **Nexus main MySQL DB** (SQLAlchemy). No Supabase dependency.

## Routes added

| Path | Description |
|------|-------------|
| `/evaluator` | Score evaluation tasks (1–5 scoring, live widgets, activity feed) |
| `/evaluator/v2` | Isolated per-run star evaluator with sidebar task list |
| `/evaluator/runs` | Create/manage daily · weekly · custom runs |
| `/evaluator/analytics` | KPI bar + score charts + AI insights dashboard |

## Backend files (nexus-be)

```
app/models/evaluator_run.py       — evaluator_runs table
app/models/evaluator_item.py      — evaluator_items table
app/models/evaluator_response.py  — evaluator_responses table
app/schemas/evaluator.py          — Pydantic v2 schemas
app/services/evaluator_service.py — CRUD service
app/routers/evaluator.py          — 7 REST endpoints
```

## Frontend files (nexus-fe)

```
src/types/evaluator.ts                             — TypeScript types
src/lib/api/evaluator.ts                           — API client (uses NEXT_PUBLIC_API_BASE_URL)
src/components/evaluator/
  EvaluatorKPIBar.tsx
  EvaluatorFilterBar.tsx
  EvaluatorInsightsPanel.tsx
  EvaluatorChartsPanel.tsx
  EvaluatorRunTaskManager.tsx
  EvaluatorTimeline.tsx
  index.ts
src/app/(dashboard)/evaluator/
  page.tsx            — main evaluator
  v2/page.tsx         — v2 evaluator
  runs/page.tsx       — run management
  analytics/page.tsx  — analytics dashboard
```

## Wire up in nexus-be

### main.py
```python
from app.routers import evaluator
app.include_router(evaluator.router, prefix="/api/v1/evaluator", tags=["Evaluator"])
```

### database.py — add to create_tables() import block
```python
evaluator_run, evaluator_item, evaluator_response,
```

## Required env vars (nexus-fe .env.local)

```env
NEXT_PUBLIC_EVALUATOR_RUN_ID=<default run UUID>
NEXT_PUBLIC_EVALUATOR_ORG_ID=<your org UUID>
```

> `NEXT_PUBLIC_API_BASE_URL` is already set in nexus-fe — evaluator reuses it.

## Required npm dependency

```bash
npm install recharts
```
(`@supabase/supabase-js` no longer needed for evaluator)

## API endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/evaluator/runs` | List runs (optional `?org_id=`) |
| POST | `/api/v1/evaluator/runs` | Create run |
| GET | `/api/v1/evaluator/runs/{id}/items` | List items |
| POST | `/api/v1/evaluator/runs/{id}/items` | Create item |
| PATCH | `/api/v1/evaluator/items/{id}` | Update item (score/status) |
| GET | `/api/v1/evaluator/runs/{id}/responses` | List responses |
| POST | `/api/v1/evaluator/responses` | Submit score (idempotent per evaluator+item) |

## Add to nexus-fe sidebar nav

```tsx
{ href: "/evaluator", label: "Evaluator" }
{ href: "/evaluator/runs", label: "Eval Runs" }
{ href: "/evaluator/analytics", label: "Eval Analytics" }
```
