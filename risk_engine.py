from typing import List, Dict, Any
from app.schemas.risk import RiskEvaluationResponse, RiskFactorDetail
from app.schemas.verification import DiscrepancyDetail


class TransparentRiskEngine:
    """Computes an auditable, weighted risk score (0 to 100) with clear factor attribution."""

    FACTOR_WEIGHTS = {
        "OWNERSHIP_MISMATCH": {"weight": 35.0, "severity": "CRITICAL"},
        "DUPLICATE_PARCEL_CLAIM": {"weight": 30.0, "severity": "CRITICAL"},
        "MUTATION_DISPUTE": {"weight": 25.0, "severity": "HIGH"},
        "BOUNDARY_OVERLAP": {"weight": 20.0, "severity": "HIGH"},
        "ACTIVE_ENCUMBRANCE": {"weight": 15.0, "severity": "HIGH"},
        "AREA_DISCREPANCY": {"weight": 15.0, "severity": "MEDIUM"},
        "NAME_SPELLING_VARIATION": {"weight": 10.0, "severity": "MEDIUM"},
        "PENDING_MUTATION": {"weight": 10.0, "severity": "MEDIUM"},
        "DEED_NUMBER_MISMATCH": {"weight": 10.0, "severity": "MEDIUM"},
        "LOW_OCR_CONFIDENCE": {"weight": 10.0, "severity": "LOW"},
        "SOURCE_UNAVAILABLE": {"weight": 15.0, "severity": "MEDIUM"},
    }

    @classmethod
    def evaluate(cls, case_id: str, discrepancies: List[DiscrepancyDetail], base_confidence: float = 1.0) -> RiskEvaluationResponse:
        total_score = 0.0
        factor_details: List[RiskFactorDetail] = []
        high_count = 0
        critical_count = 0

        for d in discrepancies:
            dtype = d.discrepancy_type.upper()
            config = cls.FACTOR_WEIGHTS.get(dtype, {"weight": 10.0, "severity": d.severity})
            weight = config["weight"]
            severity = config["severity"]

            if severity == "CRITICAL":
                critical_count += 1
            elif severity == "HIGH":
                high_count += 1

            contribution = weight
            total_score += contribution

            factor_details.append(
                RiskFactorDetail(
                    factor=dtype,
                    severity=severity,
                    weight=weight,
                    contribution_to_score=contribution,
                    description=d.description,
                    evidence={
                        "expected": str(d.expected_value),
                        "actual": str(d.actual_value),
                        "source": d.source
                    }
                )
            )

        # Cap score at 100.0
        final_score = min(round(total_score, 1), 100.0)

        # Determine Risk Band
        if final_score <= 25.0:
            risk_band = "LOW"
        elif final_score <= 55.0:
            risk_band = "MEDIUM"
        elif final_score <= 75.0:
            risk_band = "HIGH"
        else:
            risk_band = "CRITICAL"

        requires_review = final_score > 25.0 or critical_count > 0 or high_count > 0

        breakdown = (
            f"Calculated base score from {len(factor_details)} risk factor(s). "
            f"Critical factors: {critical_count}, High factors: {high_count}. "
            f"Formula: Sum(Factor Weights) capped at 100 -> {final_score}/100 ({risk_band})."
        )

        return RiskEvaluationResponse(
            case_id=case_id,
            risk_score=final_score,
            risk_band=risk_band,
            factors=factor_details,
            total_factors_evaluated=len(factor_details),
            high_severity_count=high_count,
            critical_severity_count=critical_count,
            requires_manual_verification=requires_review,
            confidence=base_confidence,
            calculation_breakdown=breakdown
        )
