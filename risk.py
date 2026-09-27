from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field


class RiskFactorDetail(BaseModel):
    factor: str
    severity: str  # LOW, MEDIUM, HIGH, CRITICAL
    weight: float
    contribution_to_score: float
    description: str
    evidence: Dict[str, Any] = Field(default_factory=dict)


class RiskEvaluationResponse(BaseModel):
    case_id: str
    risk_score: float = Field(ge=0.0, le=100.0)
    risk_band: str  # LOW (0-25), MEDIUM (26-55), HIGH (56-75), CRITICAL (76-100)
    factors: List[RiskFactorDetail] = Field(default_factory=list)
    total_factors_evaluated: int = 0
    high_severity_count: int = 0
    critical_severity_count: int = 0
    requires_manual_verification: bool = False
    confidence: float = 1.0
    calculation_breakdown: str
