import re
from difflib import SequenceMatcher
from typing import List, Dict, Any, Tuple, Optional
from app.schemas.verification import VerificationCheckResult, DiscrepancyDetail


class OwnershipVerificationService:
    """Verifies land ownership comparing OCR/Applicant claims against government records."""

    @staticmethod
    def _similarity_ratio(str1: str, str2: str) -> float:
        s1 = re.sub(r'[\.\,\s]+', ' ', str1.lower().strip())
        s2 = re.sub(r'[\.\,\s]+', ' ', str2.lower().strip())
        return SequenceMatcher(None, s1, s2).ratio()

    @classmethod
    def verify(
        cls,
        claimed_owner: str,
        government_owners: List[str],
        claimed_co_owners: Optional[List[str]] = None,
        government_co_owners: Optional[List[str]] = None
    ) -> VerificationCheckResult:
        """Compares claimed names against authentic government record."""
        if not government_owners:
            return VerificationCheckResult(
                check_name="OWNERSHIP_VERIFICATION",
                status="NOT_FOUND",
                confidence=0.5,
                source_provider="GOVERNMENT_ROR",
                summary="No ownership records found in official government source.",
                discrepancies=[
                    DiscrepancyDetail(
                        discrepancy_type="OWNER_NOT_FOUND",
                        severity="HIGH",
                        description=f"Claimed owner '{claimed_owner}' not found in government record."
                    )
                ],
                requires_review=True
            )

        best_ratio = 0.0
        best_match_name = ""

        for gov_name in government_owners:
            ratio = cls._similarity_ratio(claimed_owner, gov_name)
            if ratio > best_ratio:
                best_ratio = ratio
                best_match_name = gov_name

        discrepancies: List[DiscrepancyDetail] = []
        requires_review = False

        if best_ratio >= 0.95:
            status = "MATCH"
            summary = f"Claimed owner '{claimed_owner}' matches government record '{best_match_name}'."
            confidence = 0.98
        elif best_ratio >= 0.70:
            status = "PARTIAL_MATCH"
            summary = f"Partial name match between '{claimed_owner}' and official record '{best_match_name}'. Possible middle name/initial variation."
            confidence = 0.82
            requires_review = True
            discrepancies.append(
                DiscrepancyDetail(
                    discrepancy_type="NAME_SPELLING_VARIATION",
                    severity="MEDIUM",
                    description=f"Spelling / middle-name divergence between '{claimed_owner}' and '{best_match_name}' (similarity {int(best_ratio*100)}%).",
                    expected_value=best_match_name,
                    actual_value=claimed_owner,
                    source="OCR_vs_GOVT"
                )
            )
        else:
            status = "MISMATCH"
            summary = f"Claimed owner '{claimed_owner}' does not match official record '{best_match_name}'."
            confidence = 0.90
            requires_review = True
            discrepancies.append(
                DiscrepancyDetail(
                    discrepancy_type="OWNER_MISMATCH",
                    severity="CRITICAL",
                    description=f"Direct ownership mismatch. Document claims '{claimed_owner}', official record has '{best_match_name}'.",
                    expected_value=best_match_name,
                    actual_value=claimed_owner,
                    source="OCR_vs_GOVT"
                )
            )

        return VerificationCheckResult(
            check_name="OWNERSHIP_VERIFICATION",
            status=status,
            confidence=confidence,
            source_provider="GOVERNMENT_ROR",
            summary=summary,
            discrepancies=discrepancies,
            evidence={
                "claimed_owner": claimed_owner,
                "government_owners": government_owners,
                "similarity_score": round(best_ratio, 3),
                "matched_record": best_match_name
            },
            requires_review=requires_review
        )
