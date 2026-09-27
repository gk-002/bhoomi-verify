import pytest
from app.models.case import Case
from app.services.review_service import OfficerReviewService


def test_officer_approval_workflow(db):
    case = Case(
        case_number="BV-MH-TEST-01",
        state="Maharashtra",
        state_code="MH",
        district="Raigad",
        tehsil="Karjat",
        village="Shirdhon",
        survey_number="42/1",
        status="SUBMITTED"
    )
    db.add(case)
    db.commit()

    decision = OfficerReviewService.approve_case(
        db=db,
        case_id=case.id,
        officer_id="officer_talathi_01",
        notes="Verified against physical Tehsil register."
    )

    assert decision.decision == "APPROVED"
    assert case.status == "VERIFIED"
    assert case.requires_manual_verification is False


def test_officer_field_correction(db):
    case = Case(
        case_number="BV-MH-TEST-02",
        state="Maharashtra",
        state_code="MH",
        district="Pune",
        tehsil="Haveli",
        village="Wadgaon",
        survey_number="108",
        status="FLAGGED"
    )
    db.add(case)
    db.commit()

    decision = OfficerReviewService.correct_field(
        db=db,
        case_id=case.id,
        officer_id="officer_tehsildar_02",
        field_name="owner_name",
        old_value="Ganesh Patil",
        new_value="Ganesh Ramchandra Patil",
        reason="Corrected to reflect full father name per Mutation #3452."
    )

    assert decision.decision == "FIELD_CORRECTED"
    assert decision.field_corrected == "owner_name"
    assert decision.new_value["value"] == "Ganesh Ramchandra Patil"
