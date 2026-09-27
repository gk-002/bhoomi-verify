import pytest
from app.verification.ownership import OwnershipVerificationService
from app.verification.mutation import MutationVerificationService
from app.verification.encumbrance import EncumbranceVerificationService
from app.verification.duplicate import DuplicateVerificationService


def test_ownership_partial_match():
    """Verify partial name match with middle initial: 'Ganesh Patil' vs 'Ganesh R. Patil'."""
    result = OwnershipVerificationService.verify(
        claimed_owner="Ganesh Patil",
        government_owners=["Ganesh R. Patil"]
    )
    assert result.status == "PARTIAL_MATCH"
    assert result.confidence >= 0.70
    assert result.requires_review is True
    assert len(result.discrepancies) > 0
    assert result.discrepancies[0].discrepancy_type == "NAME_SPELLING_VARIATION"


def test_ownership_direct_mismatch():
    """Verify mismatch when names are completely different."""
    result = OwnershipVerificationService.verify(
        claimed_owner="Ramesh Sharma",
        government_owners=["Ganesh R. Patil"]
    )
    assert result.status == "MISMATCH"
    assert result.requires_review is True
    assert result.discrepancies[0].severity == "CRITICAL"


def test_mutation_dispute_flagged():
    """Verify that a disputed mutation in government records is flagged."""
    sample_mutations = [
        {"mutation_number": "1289", "status": "DISPUTED", "type": "INHERITANCE"}
    ]
    result = MutationVerificationService.verify(
        claimed_mutation_no="1289",
        government_mutations=sample_mutations
    )
    assert result.status in ("REQUIRES_REVIEW", "PARTIAL_MATCH")
    assert result.requires_review is True
    assert any(d.discrepancy_type == "MUTATION_DISPUTE" for d in result.discrepancies)


def test_encumbrance_verification():
    """Verify bank mortgage creates high severity discrepancy."""
    mortgage = {"bank_name": "State Bank of India", "amount": 500000}
    result = EncumbranceVerificationService.verify(
        encumbrance_flag=True,
        mortgage_details=mortgage
    )
    assert result.status == "REQUIRES_REVIEW"
    assert result.requires_review is True
    assert result.discrepancies[0].discrepancy_type == "ACTIVE_ENCUMBRANCE"
