import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, Float, DateTime, Text, JSON, Boolean
from app.core.database import Base


class ProviderHealth(Base):
    __tablename__ = "provider_health"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    provider_id = Column(String(100), unique=True, nullable=False, index=True)
    state_code = Column(String(10), nullable=False, index=True)
    status = Column(String(50), default="HEALTHY")  # HEALTHY, DEGRADED, RATE_LIMITED, UNAVAILABLE, DISABLED
    circuit_state = Column(String(50), default="CLOSED")  # CLOSED, OPEN, HALF_OPEN
    consecutive_failures = Column(Integer, default=0)
    last_latency_ms = Column(Float, default=0.0)
    last_checked_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    error_summary = Column(Text, nullable=True)


class ApiRequestLog(Base):
    __tablename__ = "api_requests"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    request_id = Column(String(100), nullable=False, index=True)
    case_id = Column(String(100), nullable=True, index=True)
    provider_id = Column(String(100), nullable=False, index=True)
    operation = Column(String(100), nullable=False)
    latency_ms = Column(Float, nullable=False)
    status_code = Column(Integer, nullable=False)
    status = Column(String(50), nullable=False)  # SUCCESS, FAILED, TIMEOUT, RATE_LIMITED
    error_code = Column(String(50), nullable=True)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc))
