from typing import Optional, List, Dict, Any
from datetime import datetime, timezone
from pydantic import BaseModel, Field, ConfigDict


class CaseCreate(BaseModel):
    state: str
    state_code: str
    district: str
    tehsil: str
    village: str
    survey_number: str
    subdivision: Optional[str] = None
    document_ids: Optional[List[str]] = Field(default_factory=list)


class CaseResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    case_number: str
    state: str
    state_code: str
    district: str
    tehsil: str
    village: str
    survey_number: str
    subdivision: Optional[str] = None
    status: str
    risk_score: float
    risk_band: str
    requires_manual_verification: bool
    summary: Optional[str] = None
    created_at: datetime
    updated_at: datetime


class CaseDetailResponse(CaseResponse):
    documents_count: int = 0
    verification_count: int = 0
    risk_factors_count: int = 0
    officer_decisions_count: int = 0
