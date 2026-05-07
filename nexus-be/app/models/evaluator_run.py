from sqlalchemy import Column, String, Date, DateTime
from datetime import datetime
from uuid import uuid4
from app.database import Base


class EvaluatorRun(Base):
    __tablename__ = "evaluator_runs"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid4()))
    org_id = Column(String(255), nullable=True, index=True)
    name = Column(String(255), nullable=False)
    cadence = Column(String(20), nullable=False, default="daily")
    run_type = Column(String(20), nullable=True)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=True)
    status = Column(String(20), nullable=False, default="active")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
