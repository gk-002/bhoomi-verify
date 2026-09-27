import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Float, DateTime, ForeignKey, Text, JSON, Boolean
from sqlalchemy.orm import relationship
from app.core.database import Base


class VerificationResult(Base):
    __tablename__ = "verification_results"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    case_id = Column(String(36), ForeignKey("cases.id", ondelete="CASCADE"), nullable=False, index=True)
    verification_type = Column(String(50), nullable=False)  # OWNERSHIP, MUTATION, GIS, REGISTRATION, ENCUMBRANCE, DUPLICATE
    status = Column(String(50), nullable=False)  # MATCH, PARTIAL_MATCH, MISMATCH, NOT_FOUND, SOURCE_UNAVAILABLE, REQUIRES_REVIEW
    confidence = Column(Float, default=1.0)
    source_provider = Column(String(100), nullable=False)
    summary = Column(Text, nullable=False)
    discrepancies = Column(JSON, default=list)  # List of discrepancy dicts
    evidence = Column(JSON, default=dict)
    requires_review = Column(Boolean, default=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    case = relationship("Case", back_populates="verification_results")


class ReconciliationSummary(Base):
    __tablename__ = "reconciliation_summaries"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    case_id = Column(String(36), ForeignKey("cases.id", ondelete="CASCADE"), nullable=False, index=True)
    overall_status = Column(String(50), nullable=False)  # RECONCILED, CONFLICT_DETECTED, INSUFFICIENT_DATA
    resolved_owner = Column(String(255), nullable=True)
    resolved_area_sqm = Column(Float, nullable=True)
    conflict_count = Column(Float, default=0)
    conflict_details = Column(JSON, default=list)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
