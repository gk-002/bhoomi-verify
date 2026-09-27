import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Float, DateTime, ForeignKey, Text, JSON, Integer
from sqlalchemy.orm import relationship
from app.core.database import Base


class RiskScore(Base):
    __tablename__ = "risk_scores"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    case_id = Column(String(36), ForeignKey("cases.id", ondelete="CASCADE"), nullable=False, index=True)
    score = Column(Float, nullable=False)  # 0 to 100
    risk_band = Column(String(20), nullable=False)  # LOW (0-25), MEDIUM (26-55), HIGH (56-75), CRITICAL (76-100)
    confidence = Column(Float, default=1.0)
    summary = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    case = relationship("Case", back_populates="risk_evaluations")
    factors = relationship("RiskFactor", back_populates="risk_score", cascade="all, delete-orphan")


class RiskFactor(Base):
    __tablename__ = "risk_factors"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    risk_score_id = Column(String(36), ForeignKey("risk_scores.id", ondelete="CASCADE"), nullable=False, index=True)
    factor = Column(String(100), nullable=False)  # OWNERSHIP_MISMATCH, AREA_DISCREPANCY, BOUNDARY_OVERLAP, etc.
    severity = Column(String(20), nullable=False)  # LOW, MEDIUM, HIGH, CRITICAL
    weight = Column(Float, nullable=False)  # e.g., 20.0
    evidence = Column(JSON, default=dict)
    description = Column(Text, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    risk_score = relationship("RiskScore", back_populates="factors")
