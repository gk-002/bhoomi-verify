from typing import Optional, List, Dict, Any
from datetime import datetime, timezone
from pydantic import BaseModel, Field
from app.schemas.canonical import CanonicalLandRecord


class VerificationRequest(BaseModel):
    case_id: Optional[str] = None
    state: str
    district: str
    tehsil: str
    village: str
    identifier: str  # survey_number, gat_number, khasra_number
    identifier_type: str = "SURVEY_NUMBER"  # SURVEY_NUMBER, GAT_NUMBER, KHASRA_NUMBER, PLOT_NUMBER, DAG_NUMBER
    subdivision: Optional[str] = None
    document_type: str = "7_12"  # 7_12, 8A, KHASRA, KHATAUNI, JAMABANDI, RTC, etc.
    document_id: Optional[str] = None
    operations: List[str] = Field(default=["ROR_LOOKUP", "OWNERSHIP_VERIFY", "MUTATION_CHECK", "GIS_CHECK"])


class DiscrepancyDetail(BaseModel):
    discrepancy_type: str  # NAME_MISMATCH, AREA_MISMATCH, BOUNDARY_OVERLAP, MISSING_COHEIR, UNRECORDED_MUTATION
    severity: str  # LOW, MEDIUM, HIGH, CRITICAL
    description: str
    field_affected: Optional[str] = None
    expected_value: Optional[Any] = None
    actual_value: Optional[Any] = None
    source: Optional[str] = None


class VerificationCheckResult(BaseModel):
    check_name: str
    status: str  # MATCH, PARTIAL_MATCH, MISMATCH, NOT_FOUND, SOURCE_UNAVAILABLE, REQUIRES_REVIEW
    confidence: float
    source_provider: str
    summary: str
    discrepancies: List[DiscrepancyDetail] = Field(default_factory=list)
    evidence: Dict[str, Any] = Field(default_factory=dict)
    requires_review: bool = False


class VerificationResponse(BaseModel):
    case_id: str
    state_code: str
    overall_status: str  # VERIFIED, FLAGGED, REQUIRES_REVIEW, REJECTED
    confidence_score: float
    canonical_record: Optional[CanonicalLandRecord] = None
    checks: List[VerificationCheckResult] = Field(default_factory=list)
    discrepancies: List[DiscrepancyDetail] = Field(default_factory=list)
    risk_score: float
    risk_band: str
    requires_manual_verification: bool
    verified_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
