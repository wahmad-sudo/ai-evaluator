"""Pytest configuration — creates all tables in the SQLite test DB before tests run."""
from __future__ import annotations
from sqlalchemy.orm import sessionmaker
from app.database import engine, Base
import pytest

# Trigger model registration on Base.metadata
from app.models import (  # noqa: F401
    evaluator_run, evaluator_item, evaluator_response,
    sniper_run, sniper_match, sniper_timeline, sniper_script, sniper_action,
)


def pytest_configure(config):
    Base.metadata.create_all(engine)


_Session = sessionmaker(bind=engine)


@pytest.fixture
def db():
    session = _Session()
    yield session
    session.close()
