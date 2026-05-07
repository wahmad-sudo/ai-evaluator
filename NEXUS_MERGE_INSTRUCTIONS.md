# Instructions for Claude — Nexus Production Merge & Audit

## Context

You are working in the **nexus-main** repository (the actual Nexus production codebase).
A separate repo (`wahmad-sudo/ai-evaluator`, branch `claude/production-wiring`) contains
two fully built modules that need to be merged in:

1. **Universal NEXUS Sniper** — 12-step AI lead targeting pipeline (FastAPI + Next.js)
2. **AI Evaluator** — task scoring module ported from Supabase to Nexus MySQL

All code is production-ready: auth-gated, unit-tested (31/31 passing), env-var aligned.

---

## Step 1 — Download and extract the ZIP

Run from the nexus-main root:

```bash
curl -L "https://raw.githubusercontent.com/wahmad-sudo/ai-evaluator/claude/production-wiring/nexus-production-wiring.zip" \
  -o /tmp/nexus-production-wiring.zip

unzip -o /tmp/nexus-production-wiring.zip
```

This drops these files into nexus-main (mirroring the directory structure):

**Backend (`nexus-be/`):**
```
app/__init__.py
app/database.py              ← SQLite stub for standalone tests only; nexus uses the real MySQL one
app/middleware/__init__.py
app/models/__init__.py
app/routers/__init__.py
app/routers/sniper.py        ← 9 endpoints, all auth-gated
app/routers/evaluator.py     ← 7 endpoints, all auth-gated
app/schemas/__init__.py
app/utils/__init__.py
pytest.ini
tests/__init__.py
tests/conftest.py
tests/test_evaluator_service.py   ← 12 pytest tests
tests/test_sniper_osiris.py       ← 19 pytest tests (Osiris + BANT)
```

**Frontend (`nexus-fe/`):**
```
src/lib/api/evaluator.ts
src/lib/intent-workflow/api.ts
src/hooks/useUniversalIntentWorkflow.ts
src/components/intent-workflow/UniversalIntentWorkflowModal.tsx
src/components/leads/SniperLaunchButton.tsx   ← new component
src/app/(dashboard)/evaluator/page.tsx
src/app/(dashboard)/evaluator/analytics/page.tsx
src/__tests__/evaluator.test.ts               ← Jest tests
```

**IMPORTANT:** The extracted `nexus-be/app/database.py` is a SQLite stub for testing only.
If nexus already has an `app/database.py` (MySQL), do NOT overwrite it. Check first:
```bash
# If a real database.py exists, skip that file:
ls nexus-be/app/database.py   # if this exists and has MySQL config, keep it
```

---

## Step 2 — Apply the 5 manual changes (append-only)

### 2a. `nexus-be/app/main.py` — CORS fix

Find the `CORSMiddleware` block and expand `allow_origins`:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "https://nexus.cai-sol.com",
        "https://nexus-api.cai-sol.com",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 2b. `nexus-be/app/main.py` — Register new routers

Add AFTER the existing `app.include_router(...)` calls:

```python
from app.routers import sniper, evaluator

app.include_router(sniper.router,    prefix="/api/v1/sniper",    tags=["Sniper"])
app.include_router(evaluator.router, prefix="/api/v1/evaluator", tags=["Evaluator"])
```

### 2c. `nexus-be/app/database.py` — Register new models in create_tables()

Inside the `create_tables()` function add to the import block:

```python
from app.models import (
    # ... existing models ...
    sniper_run, sniper_timeline, sniper_match, sniper_script, sniper_action,
    evaluator_run, evaluator_item, evaluator_response,
)
```

### 2d. `nexus-fe/src/components/layout/Sidebar.tsx` — Add nav entries

Add to the `NAV_ITEMS` array (after existing entries). Use whatever icon library
is already in use in the file (Lucide, react-icons, heroicons, etc.):

```tsx
{ href: "/sniper",              label: "Sniper",          icon: <TargetIcon /> },
{ href: "/evaluator",           label: "Evaluator",       icon: <StarIcon /> },
{ href: "/evaluator/runs",      label: "Eval Runs",       icon: <StarIcon /> },
{ href: "/evaluator/analytics", label: "Eval Analytics",  icon: <StarIcon /> },
```

### 2e. `nexus-fe/src/components/leads/LeadDetailModal.tsx` — Add Sniper button

Add import at the top:
```tsx
import { SniperLaunchButton } from "@/components/leads/SniperLaunchButton";
```

Add button in the modal action bar (next to existing action buttons):
```tsx
<SniperLaunchButton lead={lead} />
```

---

## Step 3 — Environment variables

In `nexus-fe/.env.local`, ensure this is set:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
# These are optional — evaluator will show a run picker if not set:
NEXT_PUBLIC_EVALUATOR_RUN_ID=
NEXT_PUBLIC_EVALUATOR_ORG_ID=
```

Install recharts if not already installed:
```bash
cd nexus-fe && npm install recharts
```

---

## Step 4 — Run backend tests

```bash
cd nexus-be
pip install pytest sqlalchemy pydantic
python -m pytest tests/ -v
```

Expected: **31 passed** (12 evaluator service + 10 Osiris verdict + 9 BANT/scoring tests).

If any test fails, investigate and fix before proceeding.

---

## Step 5 — Run frontend type-check and Jest tests

```bash
cd nexus-fe
npx tsc --noEmit          # must pass with 0 errors
npx jest src/__tests__/evaluator.test.ts --passWithNoTests
```

---

## Step 6 — Start servers and smoke-test

```bash
# Terminal 1 — backend
cd nexus-be
python -m uvicorn app.main:app --reload --port 8000

# Terminal 2 — frontend
cd nexus-fe
npm run dev
```

**Smoke test checklist:**
- `GET http://localhost:8000/api/v1/sniper/defaults` → 200 with JSON array
- `GET http://localhost:8000/api/v1/evaluator/runs` → 200 (empty array if no runs yet)
- `GET http://localhost:8000/docs` → Swagger shows Sniper + Evaluator sections
- `http://localhost:3000/evaluator` → loads run picker dropdown, not blank
- `http://localhost:3000/evaluator/analytics` → loads with run picker
- `http://localhost:3000/evaluator/runs` → create-run form works
- Open a lead in the lead detail modal → "Launch Sniper" button is present
- Click Launch Sniper → modal opens with SourceObject pre-filled from the lead
- Sidebar shows Sniper and Evaluator entries

---

## Step 7 — Commit and push

```bash
git add -A
git commit -m "feat: merge Sniper + Evaluator modules — production-wired, auth-gated, 31 tests passing"
git push
```

---

## Step 8 — Generate Audit Report

After completing the above, produce a **full audit report** in the same format as
the gate review that flagged the original issues. Cover:

| # | Area | Finding | Severity | Status |
|---|------|---------|----------|--------|
| D1 | CORS | 127.0.0.1:3000 missing from allow_origins | CRITICAL | FIXED |
| D2 | Env var | Sniper api.ts used NEXT_PUBLIC_API_BASE_URL | HIGH | FIXED |
| D3 | Auth | Sniper endpoints had no Depends(get_current_user) | CRITICAL | FIXED |
| D4 | Auth | Evaluator endpoints had no Depends(get_current_user) | CRITICAL | FIXED |
| D5 | UX | Evaluator page hardcoded RUN_ID from env var | HIGH | FIXED |
| D6 | Mock | mock_mode defaulted to true in production | HIGH | FIXED |
| D7 | Leak | Poll interval not cleaned up on unmount | MEDIUM | FIXED |
| E1 | Integration | Sniper not wired into LeadDetailModal | HIGH | FIXED |
| E2 | Nav | Sniper missing from sidebar | HIGH | CHECK |
| E3 | Nav | Evaluator missing from sidebar | HIGH | CHECK |
| E4 | Tests | No backend unit tests existed | HIGH | FIXED |
| E5 | Tests | No frontend unit tests existed | MEDIUM | FIXED |
| E6 | Demo | /demo route accessible in production | LOW | CHECK |

For each item marked CHECK: verify current state in the codebase and update to
FIXED or OPEN with a note.

Then add any NEW findings discovered during this merge session, and provide:
- Overall production-readiness score (RED / AMBER / GREEN)
- List of remaining blockers before go-live
- Recommended next steps

---

## Quick reference — what each changed file does

| File | Change |
|------|--------|
| `app/routers/sniper.py` | 9 endpoints, all require JWT via `get_current_user` |
| `app/routers/evaluator.py` | 7 endpoints, all require JWT |
| `src/lib/api/evaluator.ts` | Fixed env var + auth headers + path construction |
| `src/lib/intent-workflow/api.ts` | Fixed env var + auth headers |
| `src/hooks/useUniversalIntentWorkflow.ts` | mock_mode=false, poll cleanup |
| `src/components/intent-workflow/UniversalIntentWorkflowModal.tsx` | mockMode=false on run |
| `src/components/leads/SniperLaunchButton.tsx` | New — maps NexusLead → SourceObject |
| `src/app/(dashboard)/evaluator/page.tsx` | Run picker replaces hardcoded env var |
| `src/app/(dashboard)/evaluator/analytics/page.tsx` | Run picker replaces hardcoded env var |
| `src/__tests__/evaluator.test.ts` | 7 Jest test groups covering evaluator API client |
| `nexus-be/tests/test_evaluator_service.py` | 12 pytest tests for evaluator CRUD |
| `nexus-be/tests/test_sniper_osiris.py` | 19 pytest tests for Osiris + BANT scoring |
