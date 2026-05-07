from __future__ import annotations
from typing import Any, Optional
from datetime import datetime
from pydantic import BaseModel


class WorkflowActionRequest(BaseModel):
    action_type: str
    match_id: Optional[int] = None
    payload: Optional[dict[str, Any]] = None


class WorkflowActionResponse(BaseModel):
    id: int
    run_id: int
    match_id: Optional[int]
    action_type: str
    action_status: str
    result: Optional[dict[str, Any]]
    created_at: datetime

    model_config = {"from_attributes": True}
