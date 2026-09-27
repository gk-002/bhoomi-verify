from typing import List, Dict, Any, Optional
from app.schemas.verification import VerificationCheckResult, DiscrepancyDetail


class MutationVerificationService:
    """Verifies mutation history, flags disputed or uncertified mutation entries."""

    @classmethod
    def verify(
        cls,
        claimed_mutation_no: Optional[str],
        government_mutations: List[Dict[str, Any]]
    ) -> VerificationCheckResult:
        if not government_mutations:
            return VerificationCheckResult(
                check_name="MUTATION_VERIFICATION",
                status="NOT_FOUND",
                confidence=0.7,
                source_provider="E_MUTATION_REGISTER",
                summary="No digital mutation history available for this parcel.",
                discrepancies=[],
                requires_review=False
            )

        discrepancies: List[DiscrepancyDetail] = []
        requires_review = False
        status = "MATCH"
        has_disputed = any(m.get("status") in ("DISPUTED", "LITIGATION") for m in government_mutations)
        has_pending = any(m.get("status") == "PENDING" for m in government_mutations)

        if has_disputed:
            status = "REQUIRES_REVIEW"
            requires_review = True
            discrepancies.append(
                DiscrepancyDetail(
                    discrepancy_type="MUTATION_DISPUTE",
                    severity="HIGH",
                    description="Parcel has active disputed or contested mutation entries on record.",
                    source="GOVT_FERFAR"
                )
            )

        if has_pending:
            status = "PARTIAL_MATCH" if status == "MATCH" else status
            requires_review = True
            discrepancies.append(
                DiscrepancyDetail(
                    discrepancy_type="PENDING_MUTATION",
                    severity="MEDIUM",
                    description="Uncertified / pending mutation entry detected awaiting revenue officer sign-off.",
                    source="GOVT_FERFAR"
                )
            )

        # Check claimed mutation number
        if claimed_mutation_no:
            matched = any(str(m.get("mutation_number")) == str(claimed_mutation_no) for m in government_mutations)
            if not matched:
                status = "MISMATCH"
                requires_review = True
                discrepancies.append(
                    DiscrepancyDetail(
                        discrepancy_type="MUTATION_NOT_FOUND",
                        severity="HIGH",
                        description=f"Claimed mutation #{claimed_mutation_no} not found in official government mutation register.",
                        expected_value="Registered mutation",
                        actual_value=claimed_mutation_no,
                        source="DOCUMENT_vs_GOVT"
                    )
                )

        summary = f"Evaluated {len(government_mutations)} mutation records. Active disputes: {has_disputed}."
        return VerificationCheckResult(
            check_name="MUTATION_VERIFICATION",
            status=status,
            confidence=0.95,
            source_provider="E_MUTATION_REGISTER",
            summary=summary,
            discrepancies=discrepancies,
            evidence={"total_mutations": len(government_mutations), "mutations": government_mutations},
            requires_review=requires_review
        )
