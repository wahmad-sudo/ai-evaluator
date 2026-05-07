from sqlalchemy import Column, Integer, Text, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.database import Base


class SniperScript(Base):
    __tablename__ = "sniper_scripts"

    id = Column(Integer, primary_key=True, index=True)
    run_id = Column(Integer, ForeignKey("sniper_runs.id", ondelete="CASCADE"), nullable=False, index=True)
    match_id = Column(Integer, ForeignKey("sniper_matches.id", ondelete="CASCADE"), nullable=True, index=True)
    hook = Column(Text, nullable=True)
    pain_summary = Column(Text, nullable=True)
    email_script = Column(Text, nullable=True)
    linkedin_script = Column(Text, nullable=True)
    call_script = Column(Text, nullable=True)
    ringcentral_call_opener = Column(Text, nullable=True)
    cta = Column(Text, nullable=True)
    follow_up = Column(Text, nullable=True)
    manual_override_json = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
