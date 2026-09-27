from typing import List, Dict, Any, Optional
from app.schemas.verification import VerificationCheckResult, DiscrepancyDetail


class DuplicateVerificationService:
    """Detects duplicate document submissions and simultaneous duplicate claims on same land parcel."""

    @classmethod
    def verify(
        cls,
        current_case_id: str,
        existing_cases_on_parcel: List[Dict[str, Any]]
    ) -> VerificationCheckResult:
        other_active_cases = [c for c in existing_cases_on_parcel if c.get("id") != current_case_id]
        discrepancies: List[DiscrepancyDetail] = []
        requires_review = False

        if not other_active_cases:
            return VerificationCheckResult(
                check_name="DUPLICATE_CHECK",
                status="MATCH",
                confidence=1.0,
                source_provider="BHOOMIVERIFY_REGISTRY",
                summary="No duplicate or conflicting active claims on this parcel.",
                discrepancies=[],
                requires_review=False
            )

        status = "REQUIRES_REVIEW"
        requires_review = True
        for ec in other_active_cases:
            discrepancies.append(
                DiscrepancyDetail(
                    discrepancy_type="DUPLICATE_PARCEL_CLAIM",
                    severity="CRITICAL",
                    description=f"Another active verification case #{ec.get('case_number')} exists for this exact land parcel.",
                    expected_value="Single active verification claim",
                    actual_value=ec.get("case_number"),
                    source="INTERNAL_REGISTRY"
                )
            )

        return VerificationCheckResult(
            check_name="DUPLICATE_CHECK",
            status=status,
            confidence=0.98,
            source_provider="BHOOMIVERIFY_REGISTRY",
            summary=f"Found {len(other_active_cases)} conflicting active verification cases on the same parcel.",
            discrepancies=discrepancies,
            evidence={"conflicting_cases": other_active_cases},
            requires_review=requires_review
        )
