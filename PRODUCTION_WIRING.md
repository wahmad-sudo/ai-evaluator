# Production Wiring Guide — Nexus Sniper + Evaluator

Apply these changes to **nexus-main** (the actual Nexus codebase). All changes are
append-only unless noted. After applying, restart the backend and rebuild the frontend.

---

## 1. Backend — main.py (CORS + router registration)

Open `nexus-be/app/main.py` and find the `CORSMiddleware` block. Replace the
`allow_origins` list with the expanded list below:

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

Then add the two new routers **after** the existing `app.include_router` calls:

```python
from app.routers import sniper, evaluator

app.include_router(sniper.router,    prefix="/api/v1/sniper",    tags=["Sniper"])
app.include_router(evaluator.router, prefix="/api/v1/evaluator", tags=["Evaluator"])
```

---

## 2. Backend — database.py (create tables)

In `nexus-be/app/database.py`, inside the `create_tables()` function, add the
new models to the import block:

```python
from app.models import (
    # ... existing models ...
    sniper_run, sniper_timeline, sniper_match, sniper_script, sniper_action,
    evaluator_run, evaluator_item, evaluator_response,
)
```

---

## 3. Frontend — Sidebar.tsx (nav entries)

File: `nexus-fe/src/components/layout/Sidebar.tsx`

Add these entries to the `NAV_ITEMS` array (after the existing entries):

```tsx
// Add to import block at top:
import { Target, Star } from "lucide-react";   // or your icon library

// Add to NAV_ITEMS:
{ href: "/sniper",             icon: Target, label: "Sniper"       },
{ href: "/evaluator",          icon: Star,   label: "Evaluator"    },
{ href: "/evaluator/runs",     icon: Star,   label: "Eval Runs"    },
{ href: "/evaluator/analytics",icon: Star,   label: "Eval Analytics"},
```

If using a different icon library (e.g. `react-icons`), substitute `FiTarget`
(`react-icons/fi`) and `FiStar` (`react-icons/fi`) respectively.

---

## 4. Frontend — LeadDetailModal.tsx (Sniper launch button)

File: `nexus-fe/src/components/leads/LeadDetailModal.tsx` (or wherever your
lead detail panel lives).

**Step 1 — Import the button:**

```tsx
import { SniperLaunchButton } from "@/components/leads/SniperLaunchButton";
```

**Step 2 — Add button inside the modal action bar** (append-only, place next to
existing action buttons):

```tsx
<SniperLaunchButton lead={lead} />
```

The `lead` prop accepts any object with these optional fields:
`name`, `first_name`, `last_name`, `company`, `company_name`, `title`,
`location`, `city`, `state`, `website`, `linkedin_url`, `source_url`, `tags`.

---

## 5. Frontend — .env.local

```env
# Required — used by both sniper and evaluator API clients
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1

# Optional — evaluator run picker uses these as defaults
NEXT_PUBLIC_EVALUATOR_RUN_ID=   # leave blank to show dropdown
NEXT_PUBLIC_EVALUATOR_ORG_ID=your-org-id
```

---

## 6. Frontend — install recharts (evaluator analytics)

```bash
cd nexus-fe
npm install recharts
```

---

## 7. Run backend tests

```bash
cd nexus-be
pip install pytest pytest-cov
pytest tests/ -v
```

Expected: all tests in `tests/test_evaluator_service.py` and
`tests/test_sniper_osiris.py` pass.

---

## 8. Run frontend tests

```bash
cd nexus-fe
npx jest src/__tests__/evaluator.test.ts --passWithNoTests
```

---

## 9. Demo route (optional — gate in production)

The demo page at `/demo/universal-intent-modal` is useful for development.
For production, protect it with an admin check or remove:

```tsx
// In nexus-fe/src/app/demo/universal-intent-modal/page.tsx — add at top:
if (process.env.NODE_ENV === "production") {
  notFound();   // from "next/navigation"
}
```

---

## Verification checklist

- [ ] `GET /api/v1/sniper/defaults` returns 200 with auth header
- [ ] `GET /api/v1/evaluator/runs` returns 200 with auth header
- [ ] `POST /api/v1/sniper/runs` creates a run and returns `run_uuid`
- [ ] Sidebar shows Sniper and Evaluator entries
- [ ] LeadDetailModal shows "Launch Sniper" button
- [ ] Evaluator page loads run list in dropdown (no hardcoded RUN_ID)
- [ ] Evaluator analytics page shows charts
- [ ] All backend pytest tests pass
- [ ] All frontend Jest tests pass
