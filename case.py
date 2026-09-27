import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, Float, DateTime, ForeignKey, Text, JSON, Boolean
from sqlalchemy.orm import relationship
from app.core.database import Base


class Case(Base):
    __tablename__ = "cases"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    case_number = Column(String(50), unique=True, nullable=False, index=True)
    state = Column(String(100), nullable=False, index=True)
    state_code = Column(String(10), nullable=False, index=True)
    district = Column(String(100), nullable=False, index=True)
    tehsil = Column(String(100), nullable=False, index=True)
    village = Column(String(100), nullable=False, index=True)
    survey_number = Column(String(100), nullable=False, index=True)
    subdivision = Column(String(50), nullable=True)

    status = Column(String(50), default="SUBMITTED", index=True)  # SUBMITTED, PROCESSING, VERIFIED, FLAGGED, REJECTED, REQUIRES_REVIEW
    risk_score = Column(Float, default=0.0)
    risk_band = Column(String(20), default="LOW")  # LOW, MEDIUM, HIGH, CRITICAL
    requires_manual_verification = Column(Boolean, default=False)
    summary = Column(Text, nullable=True)

    assigned_officer_id = Column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    documents = relationship("Document", back_populates="case")
    land_records = relationship("LandRecord", back_populates="case")
    decisions = relationship("OfficerDecision", back_populates="case", cascade="all, delete-orphan")
    audit_events = relationship("AuditEvent", back_populates="case", cascade="all, delete-orphan")
    processing_jobs = relationship("ProcessingJob", back_populates="case", cascade="all, delete-orphan")
    verification_results = relationship("VerificationResult", back_populates="case", cascade="all, delete-orphan")
    risk_evaluations = relationship("RiskScore", back_populates="case", cascade="all, delete-orphan")
    ledger_entries = relationship("LedgerEntry", back_populates="case", cascade="all, delete-orphan")


class OfficerDecision(Base):
    __tablename__ = "officer_decisions"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    case_id = Column(String(36), ForeignKey("cases.id", ondelete="CASCADE"), nullable=False, index=True)
    officer_id = Column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    decision = Column(String(50), nullable=False)  # APPROVED, FLAGGED, REJECTED, FIELD_CORRECTED
    notes = Column(Text, nullable=True)
    
    # Field correction specifics
    field_corrected = Column(String(100), nullable=True)
    old_value = Column(JSON, nullable=True)
    new_value = Column(JSON, nullable=True)
    reason = Column(Text, nullable=True)
    
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    case = relationship("Case", back_populates="decisions")
    officer = relationship("User", back_populates="decisions")


class AuditEvent(Base):
    __tablename__ = "audit_events"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    case_id = Column(String(36), ForeignKey("cases.id", ondelete="CASCADE"), nullable=False, index=True)
    actor_id = Column(String(100), default="SYSTEM")
    event_type = Column(String(100), nullable=False)  # UPLOAD, OCR, VERIFICATION, RISK_SCORE, OFFICER_ACTION
    description = Column(Text, nullable=False)
    metadata_json = Column(JSON, nullable=True)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    case = relationship("Case", back_populates="audit_events")


class ProcessingJob(Base):
    __tablename__ = "processing_jobs"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    case_id = Column(String(36), ForeignKey("cases.id", ondelete="CASCADE"), nullable=False, index=True)
    job_type = Column(String(50), nullable=False)  # DOCUMENT_OCR, MULTI_VERIFY, RECONCILIATION
    status = Column(String(50), default="QUEUED", index=True)  # QUEUED, PROCESSING, COMPLETED, FAILED, REQUIRES_REVIEW
    progress_percentage = Column(Integer, default=0)
    result_json = Column(JSON, nullable=True)
    error_message = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    completed_at = Column(DateTime, nullable=True)

    case = relationship("Case", back_populates="processing_jobs")
