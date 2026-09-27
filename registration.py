from typing import List, Dict, Any, Optional
from app.schemas.verification import VerificationCheckResult, DiscrepancyDetail


class RegistrationVerificationService:
    """Cross-references deed registration against Sub-Registrar Office (SRO) indices."""

    @classmethod
    def verify(
        cls,
        claimed_deed_no: Optional[str],
        government_registration: Optional[Dict[str, Any]]
    ) -> VerificationCheckResult:
        if not government_registration:
            return VerificationCheckResult(
                check_name="REGISTRATION_SRO_CHECK",
                status="NOT_FOUND",
                confidence=0.75,
                source_provider="SRO_IGR_INDEX_II",
                summary="No SRO registration record indexed for this query. Physical deed inspection recommended.",
                discrepancies=[],
                requires_review=False
            )

        reg_no = government_registration.get("registration_number")
        is_match = claimed_deed_no and str(claimed_deed_no).strip() == str(reg_no).strip()

        if is_match:
            return VerificationCheckResult(
                check_name="REGISTRATION_SRO_CHECK",
                status="MATCH",
                confidence=0.99,
                source_provider="SRO_IGR_INDEX_II",
                summary=f"Deed registration #{claimed_deed_no} validated with SRO Index II.",
                discrepancies=[],
                evidence=government_registration,
                requires_review=False
            )
        else:
            return VerificationCheckResult(
                check_name="REGISTRATION_SRO_CHECK",
                status="PARTIAL_MATCH" if claimed_deed_no else "MATCH",
                confidence=0.85,
                source_provider="SRO_IGR_INDEX_II",
                summary="SRO record retrieved; deed number cross-reference requires officer check.",
                discrepancies=[
                    DiscrepancyDetail(
                        discrepancy_type="DEED_NUMBER_MISMATCH",
                        severity="MEDIUM",
                        description=f"Claimed deed #{claimed_deed_no} does not match SRO index #{reg_no}."
                    )
                ] if claimed_deed_no else [],
                evidence=government_registration,
                requires_review=bool(claimed_deed_no)
            )
