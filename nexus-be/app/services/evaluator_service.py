from sqlalchemy.orm import Session
from datetime import datetime
from app.models.evaluator_run import EvaluatorRun
from app.models.evaluator_item import EvaluatorItem
from app.models.evaluator_response import EvaluatorResponse
from app.schemas.evaluator import (
    EvaluatorRunCreate,
    EvaluatorItemCreate,
    EvaluatorItemUpdate,
    EvaluatorResponseCreate,
)


def create_run(db: Session, data: EvaluatorRunCreate) -> EvaluatorRun:
    run = EvaluatorRun(**data.model_dump())
    db.add(run)
    db.commit()
    db.refresh(run)
    return run


def list_runs(db: Session, org_id: str | None = None) -> list[EvaluatorRun]:
    q = db.query(EvaluatorRun)
    if org_id:
        q = q.filter(EvaluatorRun.org_id == org_id)
    return q.order_by(EvaluatorRun.created_at.desc()).all()


def get_run(db: Session, run_id: str) -> EvaluatorRun | None:
    return db.query(EvaluatorRun).filter(EvaluatorRun.id == run_id).first()


def create_item(db: Session, data: EvaluatorItemCreate) -> EvaluatorItem:
    item = EvaluatorItem(**data.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


def list_items(db: Session, run_id: str) -> list[EvaluatorItem]:
    return (
        db.query(EvaluatorItem)
        .filter(EvaluatorItem.run_id == run_id)
        .order_by(EvaluatorItem.position.asc(), EvaluatorItem.created_at.asc())
        .all()
    )


def update_item(db: Session, item_id: str, data: EvaluatorItemUpdate) -> EvaluatorItem | None:
    item = db.query(EvaluatorItem).filter(EvaluatorItem.id == item_id).first()
    if not item:
        return None
    for field, value in data.model_dump(exclude_none=True).items():
        setattr(item, field, value)
    item.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(item)
    return item


def submit_response(db: Session, data: EvaluatorResponseCreate) -> EvaluatorResponse:
    existing = (
        db.query(EvaluatorResponse)
        .filter(
            EvaluatorResponse.item_id == data.item_id,
            EvaluatorResponse.evaluator_name == data.evaluator_name,
        )
        .first()
    )
    if existing:
        return existing
    resp = EvaluatorResponse(**data.model_dump())
    db.add(resp)
    # also mark item completed
    item = db.query(EvaluatorItem).filter(EvaluatorItem.id == data.item_id).first()
    if item:
        item.score = data.score
        item.task_status = "completed"
        item.ended_at = datetime.utcnow()
        item.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(resp)
    return resp


def list_responses(db: Session, run_id: str) -> list[EvaluatorResponse]:
    return (
        db.query(EvaluatorResponse)
        .filter(EvaluatorResponse.run_id == run_id)
        .order_by(EvaluatorResponse.created_at.asc())
        .all()
    )
