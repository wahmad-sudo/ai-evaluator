from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.evaluator import (
    EvaluatorRunCreate,
    EvaluatorRunResponse,
    EvaluatorItemCreate,
    EvaluatorItemUpdate,
    EvaluatorItemResponse,
    EvaluatorResponseCreate,
    EvaluatorResponseOut,
)
from app.services import evaluator_service

router = APIRouter()


@router.get("/runs", response_model=list[EvaluatorRunResponse])
def list_runs(org_id: str | None = None, db: Session = Depends(get_db)):
    return evaluator_service.list_runs(db, org_id=org_id)


@router.post("/runs", response_model=EvaluatorRunResponse, status_code=201)
def create_run(data: EvaluatorRunCreate, db: Session = Depends(get_db)):
    return evaluator_service.create_run(db, data)


@router.get("/runs/{run_id}/items", response_model=list[EvaluatorItemResponse])
def list_items(run_id: str, db: Session = Depends(get_db)):
    run = evaluator_service.get_run(db, run_id)
    if not run:
        raise HTTPException(status_code=404, detail="Run not found")
    return evaluator_service.list_items(db, run_id)


@router.post("/runs/{run_id}/items", response_model=EvaluatorItemResponse, status_code=201)
def create_item(run_id: str, data: EvaluatorItemCreate, db: Session = Depends(get_db)):
    data.run_id = run_id
    return evaluator_service.create_item(db, data)


@router.patch("/items/{item_id}", response_model=EvaluatorItemResponse)
def update_item(item_id: str, data: EvaluatorItemUpdate, db: Session = Depends(get_db)):
    item = evaluator_service.update_item(db, item_id, data)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    return item


@router.get("/runs/{run_id}/responses", response_model=list[EvaluatorResponseOut])
def list_responses(run_id: str, db: Session = Depends(get_db)):
    return evaluator_service.list_responses(db, run_id)


@router.post("/responses", response_model=EvaluatorResponseOut, status_code=201)
def submit_response(data: EvaluatorResponseCreate, db: Session = Depends(get_db)):
    return evaluator_service.submit_response(db, data)
