from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean
from sqlalchemy.sql import func
from app.database import Base


class SniperRun(Base):
    __tablename__ = "sniper_runs"

    id = Column(Integer, primary_key=True, index=True)
    run_uuid = Column(String(64), unique=True, nullable=False, index=True)
    source_context = Column(String(128), nullable=True)
    source_object_type = Column(String(64), nullable=False)
    source_object_id = Column(String(64), nullable=True)
    source_name = Column(String(256), nullable=True)
    source_payload_json = Column(Text, nullable=True)
    target_object_type = Column(String(64), nullable=True, default="any")
    geo = Column(String(256), nullable=True)
    timeframe = Column(String(64), nullable=True, default="30d")
    intent_mode = Column(String(64), nullable=True, default="auto")
    status = Column(String(32), nullable=False, default="pending")
    current_step = Column(String(64), nullable=True)
    mock_mode = Column(Boolean, default=False)
    created_by = Column(String(128), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    completed_at = Column(DateTime(timezone=True), nullable=True)
    error_message = Column(Text, nullable=True)
