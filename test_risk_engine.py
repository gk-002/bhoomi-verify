import pytest
from app.verification.risk_engine import TransparentRiskEngine
from app.schemas.verification import DiscrepancyDetail


def test_zero_discrepancies_low_risk():
    res = TransparentRiskEngine.evaluate(case_id="case_clean", discrepancies=[])
    assert res.risk_score == 0.0
    assert res.risk_band == "LOW"
    assert res.requires_manual_verification is False


def test_multiple_discrepancies_scoring():
    discrepancies = [
        DiscrepancyDetail(
            discrepancy_type="OWNERSHIP_MISMATCH",
            severity="CRITICAL",
            description="Owner mismatch",
            expected_value="A",
            actual_value="B"
        ),
        DiscrepancyDetail(
            discrepancy_type="BOUNDARY_OVERLAP",
            severity="HIGH",
            description="Boundary overlap",
            expected_value="None",
            actual_value="15%"
        ),
        DiscrepancyDetail(
            discrepancy_type="ACTIVE_ENCUMBRANCE",
            severity="HIGH",
            description="Bank charge",
            expected_value="Clean",
            actual_value="Lien"
        )
    ]
    res = TransparentRiskEngine.evaluate(case_id="case_high_risk", discrepancies=discrepancies)
    # Weights: 35 + 20 + 15 = 70 -> HIGH
    assert res.risk_score >= 65.0
    assert res.risk_band in ("HIGH", "CRITICAL")
    assert res.requires_manual_verification is True
    assert "Formula: Sum(Factor Weights)" in res.calculation_breakdown
