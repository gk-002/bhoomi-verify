from typing import List, Dict, Any, Optional
from app.schemas.verification import VerificationCheckResult, DiscrepancyDetail, VerificationResponse
from app.schemas.canonical import CanonicalLandRecord


class ReconciliationEngine:
    """Reconciles multi-source verification outputs into a unified verdict."""

    @classmethod
    def reconcile(
        cls,
        case_id: str,
        state_code: str,
        canonical_record: Optional[CanonicalLandRecord],
        checks: List[VerificationCheckResult]
    ) -> Dict[str, Any]:
        all_discrepancies: List[DiscrepancyDetail] = []
        requires_manual_review = False
        has_critical = False
        has_high = False

        for check in checks:
            all_discrepancies.extend(check.discrepancies)
            if check.requires_review:
                requires_manual_review = True
            for d in check.discrepancies:
                if d.severity == "CRITICAL":
                    has_critical = True
                elif d.severity == "HIGH":
                    has_high = True

        if has_critical:
            overall_status = "REJECTED"
        elif has_high or requires_manual_review:
            overall_status = "REQUIRES_REVIEW"
        elif all_discrepancies:
            overall_status = "FLAGGED"
        else:
            overall_status = "VERIFIED"

        avg_confidence = 1.0
        if checks:
            avg_confidence = round(sum(c.confidence for c in checks) / len(checks), 2)

        return {
            "overall_status": overall_status,
            "confidence_score": avg_confidence,
            "requires_manual_verification": requires_manual_review or has_critical or has_high,
            "discrepancies": all_discrepancies,
            "checks": checks
        }
