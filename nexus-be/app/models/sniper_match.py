from sqlalchemy import Column, Integer, String, Text, DateTime, Float, ForeignKey
from sqlalchemy.sql import func
from app.database import Base


class SniperMatch(Base):
    __tablename__ = "sniper_matches"

    id = Column(Integer, primary_key=True, index=True)
    run_id = Column(Integer, ForeignKey("sniper_runs.id", ondelete="CASCADE"), nullable=False, index=True)
    match_uuid = Column(String(64), unique=True, nullable=False, index=True)
    match_type = Column(String(64), nullable=True)
    name = Column(String(256), nullable=True)
    title = Column(String(256), nullable=True)
    company = Column(String(256), nullable=True)
    location = Column(String(512), nullable=True)
    website = Column(String(512), nullable=True)
    source_url = Column(String(1024), nullable=True)
    intent = Column(String(256), nullable=True)
    score = Column(Float, default=0.0)
    evidence_status = Column(String(32), nullable=True, default="HOLD")
    osiris_rating = Column(Float, default=0.0)
    osiris_verdict = Column(String(32), nullable=True)
    bant_score = Column(Float, default=0.0)
    bant_decision = Column(String(32), nullable=True)
    spend_gate_decision = Column(String(32), nullable=True)
    source_type = Column(String(64), nullable=True)
    evidence_json = Column(Text, nullable=True)
    raw_payload_json = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
