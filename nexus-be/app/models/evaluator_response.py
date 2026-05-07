from sqlalchemy import Column, String, Integer, DateTime, ForeignKey
from datetime import datetime
from uuid import uuid4
from app.database import Base


class EvaluatorResponse(Base):
    __tablename__ = "evaluator_responses"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid4()))
    run_id = Column(String(36), ForeignKey("evaluator_runs.id"), nullable=False, index=True)
    item_id = Column(String(36), ForeignKey("evaluator_items.id"), nullable=False, index=True)
    score = Column(Integer, nullable=False)
    evaluator_name = Column(String(255), nullable=True)
    organization_name = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
