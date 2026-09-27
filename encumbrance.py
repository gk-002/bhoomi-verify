from typing import List, Dict, Any, Optional
from app.schemas.verification import VerificationCheckResult, DiscrepancyDetail


class EncumbranceVerificationService:
    """Verifies encumbrance, bank mortgage charge, and court stay orders on land parcel."""

    @classmethod
    def verify(
        cls,
        encumbrance_flag: bool,
        mortgage_details: Optional[Dict[str, Any]]
    ) -> VerificationCheckResult:
        if not encumbrance_flag and not mortgage_details:
            return VerificationCheckResult(
                check_name="ENCUMBRANCE_CHECK",
                status="MATCH",
                confidence=0.95,
                source_provider="REVENUE_ENCUMBRANCE_REGISTER",
                summary="Parcel is unencumbered. No active bank charges or court stays recorded.",
                discrepancies=[],
                evidence={"encumbered": False},
                requires_review=False
            )

        discrepancies: List[DiscrepancyDetail] = []
        details = mortgage_details or {}
        bank_name = details.get("bank_name", "Financial Institution")
        amount = details.get("amount", "Unspecified")

        discrepancies.append(
            DiscrepancyDetail(
                discrepancy_type="ACTIVE_ENCUMBRANCE",
                severity="HIGH",
                description=f"Active charge / mortgage recorded in favor of {bank_name} for amount ₹{amount}.",
                expected_value="Clean Title",
                actual_value=f"Mortgaged to {bank_name}",
                source="7_12_OTHER_RIGHTS"
            )
        )

        return VerificationCheckResult(
            check_name="ENCUMBRANCE_CHECK",
            status="REQUIRES_REVIEW",
            confidence=0.98,
            source_provider="REVENUE_ENCUMBRANCE_REGISTER",
            summary=f"Encumbrance detected on parcel: Mortgage / charge with {bank_name}.",
            discrepancies=discrepancies,
            evidence={"encumbered": True, "mortgage_details": details},
            requires_review=True
        )
