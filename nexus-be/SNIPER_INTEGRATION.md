# Sniper Router — main.py Integration

Add this import and registration to `nexus-be/app/main.py` (append-only, do not remove existing routers):

```python
from app.routers import sniper

app.include_router(sniper.router, prefix="/api/v1/sniper", tags=["Sniper"])
```

Place it after your existing router registrations:

```python
app.include_router(leads.router, prefix="/api/v1/leads", tags=["Leads"])
app.include_router(harvester.router, prefix="/api/v1/harvester", tags=["Harvester"])
app.include_router(audit.router, prefix="/api/v1/audit", tags=["Audit"])
app.include_router(health.router, tags=["Health"])
# ADD THIS:
app.include_router(sniper.router, prefix="/api/v1/sniper", tags=["Sniper"])
```

# DB Tables

The sniper models use SQLAlchemy declarative base. Add them to your `create_tables()` call in `database.py`:

```python
from app.models import sniper_run, sniper_timeline, sniper_match, sniper_script, sniper_action  # noqa: F401
```

This ensures `Base.metadata.create_all(bind=engine)` picks up the new tables.

# Required Backend Env Vars (optional)

```env
SNIPER_MOCK_FALLBACK=true
SNIPER_TIMELINE_FAST_MODE=true
COREAI_API_KEY=your_openai_key        # enables live AI scripting
COREAI_MODEL=gpt-4o
```

# Audit Service Compatibility

The orchestrator calls `audit_service.log_audit(...)`. If your existing `audit_service.py` uses a different signature, update the call in `sniper_orchestrator_service.py` line ~115 to match.
