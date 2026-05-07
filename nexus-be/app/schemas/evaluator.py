from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime


class EvaluatorRunCreate(BaseModel):
    org_id: Optional[str] = None
    name: str
    cadence: str = "daily"
    run_type: Optional[str] = None
    start_date: date
    end_date: Optional[date] = None
    status: str = "active"


class EvaluatorRunResponse(BaseModel):
    id: str
    org_id: Optional[str] = None
    name: str
    cadence: str
    run_type: Optional[str] = None
    start_date: date
    end_date: Optional[date] = None
    status: str
    created_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


class EvaluatorItemCreate(BaseModel):
    run_id: str
    title: Optional[str] = None
    input: Optional[str] = None
    ai_output: Optional[str] = None
    description: Optional[str] = None
    priority: str = "medium"
    task_status: str = "pending"
    position: Optional[int] = None


class EvaluatorItemUpdate(BaseModel):
    task_status: Optional[str] = None
    score: Optional[int] = None
    ended_at: Optional[datetime] = None


class EvaluatorItemResponse(BaseModel):
    id: str
    run_id: str
    title: Optional[str] = None
    input: Optional[str] = None
    ai_output: Optional[str] = None
    description: Optional[str] = None
    priority: Optional[str] = None
    task_status: str
    score: Optional[int] = None
    position: Optional[int] = None
    started_at: Optional[datetime] = None
    ended_at: Optional[datetime] = None
    open_count: Optional[int] = 0
    reopen_count: Optional[int] = 0
    created_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


class EvaluatorResponseCreate(BaseModel):
    run_id: str
    item_id: str
    score: int
    evaluator_name: Optional[str] = None
    organization_name: Optional[str] = None


class EvaluatorResponseOut(BaseModel):
    id: str
    run_id: str
    item_id: str
    score: int
    evaluator_name: Optional[str] = None
    organization_name: Optional[str] = None
    created_at: Optional[datetime] = None

    model_config = {"from_attributes": True}
