from typing import Optional, Any, Dict
from datetime import datetime, timezone
from pydantic import BaseModel, Field, ConfigDict


class ReviewActionRequest(BaseModel):
    notes: Optional[str] = None
    reason: Optional[str] = None


class FieldCorrectionRequest(BaseModel):
    field_name: str
    old_value: Any
    new_value: Any
    reason: str = Field(min_length=5, description="Official justification for manual field correction")


class OfficerDecisionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    case_id: str
    officer_id: Optional[str] = None
    decision: str  # APPROVED, FLAGGED, REJECTED, FIELD_CORRECTED
    notes: Optional[str] = None
    field_corrected: Optional[str] = None
    old_value: Optional[Any] = None
    new_value: Optional[Any] = None
    reason: Optional[str] = None
    timestamp: datetime
