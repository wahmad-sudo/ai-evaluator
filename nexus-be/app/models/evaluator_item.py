from sqlalchemy import Column, String, Text, Integer, DateTime, ForeignKey
from datetime import datetime
from uuid import uuid4
from app.database import Base


class EvaluatorItem(Base):
    __tablename__ = "evaluator_items"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid4()))
    run_id = Column(String(36), ForeignKey("evaluator_runs.id"), nullable=False, index=True)
    title = Column(String(500), nullable=True)
    input = Column(Text, nullable=True)
    ai_output = Column(Text, nullable=True)
    description = Column(Text, nullable=True)
    priority = Column(String(20), nullable=True, default="medium")
    task_status = Column(String(20), nullable=False, default="pending")
    score = Column(Integer, nullable=True)
    position = Column(Integer, nullable=True)
    started_at = Column(DateTime, nullable=True)
    ended_at = Column(DateTime, nullable=True)
    open_count = Column(Integer, default=0)
    reopen_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
