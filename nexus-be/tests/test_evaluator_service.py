"""Unit tests for evaluator_service — uses in-memory SQLite via conftest.py."""
from __future__ import annotations
import pytest
from datetime import date

from app.schemas.evaluator import (
    EvaluatorRunCreate,
    EvaluatorItemCreate,
    EvaluatorItemUpdate,
    EvaluatorResponseCreate,
)
from app.services import evaluator_service as svc


# ─── runs ────────────────────────────────────────────────────────────────────

def test_create_run(db):
    data = EvaluatorRunCreate(
        name="Daily QA Run",
        cadence="daily",
        start_date=str(date.today()),
        status="active",
    )
    run = svc.create_run(db, data)
    assert run.id is not None
    assert run.name == "Daily QA Run"
    assert run.cadence == "daily"
    assert run.status == "active"


def test_list_runs_returns_created(db):
    runs = svc.list_runs(db)
    assert any(r.name == "Daily QA Run" for r in runs)


def test_list_runs_org_filter(db):
    data = EvaluatorRunCreate(
        name="Org Run",
        cadence="weekly",
        start_date=str(date.today()),
        status="active",
        org_id="org-abc",
    )
    svc.create_run(db, data)
    filtered = svc.list_runs(db, org_id="org-abc")
    assert all(r.org_id == "org-abc" for r in filtered)
    assert any(r.name == "Org Run" for r in filtered)


def test_get_run_returns_none_for_unknown(db):
    assert svc.get_run(db, "nonexistent-uuid") is None


# ─── items ────────────────────────────────────────────────────────────────────

@pytest.fixture
def run_id(db):
    data = EvaluatorRunCreate(
        name="Item Test Run",
        cadence="custom",
        start_date=str(date.today()),
        status="active",
    )
    run = svc.create_run(db, data)
    return str(run.id)


def test_create_item(db, run_id):
    data = EvaluatorItemCreate(
        run_id=run_id,
        title="Evaluate lead email tone",
        input="Hi there, I wanted to follow up",
        ai_output="Professional and polite",
        priority="high",
        task_status="pending",
    )
    item = svc.create_item(db, data)
    assert item.id is not None
    assert item.run_id == run_id
    assert item.title == "Evaluate lead email tone"


def test_list_items(db, run_id):
    svc.create_item(db, EvaluatorItemCreate(run_id=run_id, title="Listed Task", task_status="pending"))
    items = svc.list_items(db, run_id)
    assert len(items) >= 1
    assert all(i.run_id == run_id for i in items)


def test_update_item_score(db, run_id):
    item = svc.create_item(db, EvaluatorItemCreate(run_id=run_id, title="Update Me", task_status="pending"))
    updated = svc.update_item(db, str(item.id), EvaluatorItemUpdate(score=4, task_status="completed"))
    assert updated is not None
    assert updated.score == 4
    assert updated.task_status == "completed"


def test_update_item_not_found(db):
    result = svc.update_item(db, "bad-uuid", EvaluatorItemUpdate(score=3))
    assert result is None


# ─── responses ───────────────────────────────────────────────────────────────

def test_submit_response(db, run_id):
    # Create a fresh item for this test
    item = svc.create_item(db, EvaluatorItemCreate(run_id=run_id, title="Score this", task_status="pending"))
    data = EvaluatorResponseCreate(
        run_id=run_id,
        item_id=str(item.id),
        score=5,
        evaluator_name="tester@nexus.com",
        organization_name="Nexus",
    )
    resp = svc.submit_response(db, data)
    assert resp.id is not None
    assert resp.score == 5
    assert resp.evaluator_name == "tester@nexus.com"


def test_submit_response_idempotent(db, run_id):
    item = svc.create_item(db, EvaluatorItemCreate(run_id=run_id, title="Idempotent test", task_status="pending"))
    data = EvaluatorResponseCreate(
        run_id=run_id,
        item_id=str(item.id),
        score=3,
        evaluator_name="idem@nexus.com",
    )
    r1 = svc.submit_response(db, data)
    r2 = svc.submit_response(db, data)
    assert r1.id == r2.id  # same record returned — idempotent


def test_submit_response_marks_item_completed(db, run_id):
    item = svc.create_item(db, EvaluatorItemCreate(run_id=run_id, title="Completable task", task_status="pending"))

    svc.submit_response(db, EvaluatorResponseCreate(
        run_id=run_id,
        item_id=str(item.id),
        score=4,
        evaluator_name="auto@nexus.com",
    ))

    refreshed = svc.list_items(db, run_id)
    target = next(i for i in refreshed if i.id == item.id)
    assert target.task_status == "completed"
    assert target.score == 4


def test_list_responses(db, run_id):
    responses = svc.list_responses(db, run_id)
    assert isinstance(responses, list)
    assert all(r.run_id == run_id for r in responses)
