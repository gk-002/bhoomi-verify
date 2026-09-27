from typing import Optional, Dict, Any
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from app.models.case import Case, OfficerDecision, AuditEvent
from app.models.document import ExtractedField
from app.ledger.cryptographic_ledger import CryptographicLedgerService
from app.core.exceptions import BhoomiVerifyException, ErrorCode
from fastapi import status


class OfficerReviewService:
    """Manages human-in-the-loop triage, approvals, flags, rejections, and auditable field corrections."""

    @classmethod
    def approve_case(cls, db: Session, case_id: str, officer_id: str, notes: Optional[str] = None) -> OfficerDecision:
        case = db.query(Case).filter(Case.id == case_id).first()
        if not case:
            raise BhoomiVerifyException(error_code=ErrorCode.NOT_FOUND, message=f"Case {case_id} not found.", status_code=status.HTTP_404_NOT_FOUND)

        case.status = "VERIFIED"
        case.requires_manual_verification = False

        decision = OfficerDecision(
            case_id=case_id,
            officer_id=officer_id,
            decision="APPROVED",
            notes=notes
        )
        db.add(decision)

        # Audit event
        audit = AuditEvent(
            case_id=case_id,
            actor_id=officer_id,
            event_type="OFFICER_APPROVAL",
            description=f"Case approved by officer {officer_id}. Notes: {notes or 'None'}"
        )
        db.add(audit)

        # Record into cryptographic ledger
        CryptographicLedgerService.record_event(
            db=db,
            case_id=case_id,
            actor_id=officer_id,
            event_type="OFFICER_APPROVED",
            event_payload={"decision": "APPROVED", "notes": notes, "case_number": case.case_number}
        )

        db.commit()
        db.refresh(decision)
        return decision

    @classmethod
    def flag_case(cls, db: Session, case_id: str, officer_id: str, reason: str, notes: Optional[str] = None) -> OfficerDecision:
        case = db.query(Case).filter(Case.id == case_id).first()
        if not case:
            raise BhoomiVerifyException(error_code=ErrorCode.NOT_FOUND, message=f"Case {case_id} not found.", status_code=status.HTTP_404_NOT_FOUND)

        case.status = "FLAGGED"
        case.requires_manual_verification = True

        decision = OfficerDecision(
            case_id=case_id,
            officer_id=officer_id,
            decision="FLAGGED",
            notes=notes,
            reason=reason
        )
        db.add(decision)

        # Record in ledger
        CryptographicLedgerService.record_event(
            db=db,
            case_id=case_id,
            actor_id=officer_id,
            event_type="OFFICER_FLAGGED",
            event_payload={"decision": "FLAGGED", "reason": reason, "notes": notes, "case_number": case.case_number}
        )

        db.commit()
        db.refresh(decision)
        return decision

    @classmethod
    def reject_case(cls, db: Session, case_id: str, officer_id: str, reason: str, notes: Optional[str] = None) -> OfficerDecision:
        case = db.query(Case).filter(Case.id == case_id).first()
        if not case:
            raise BhoomiVerifyException(error_code=ErrorCode.NOT_FOUND, message=f"Case {case_id} not found.", status_code=status.HTTP_404_NOT_FOUND)

        case.status = "REJECTED"
        case.requires_manual_verification = False

        decision = OfficerDecision(
            case_id=case_id,
            officer_id=officer_id,
            decision="REJECTED",
            notes=notes,
            reason=reason
        )
        db.add(decision)

        CryptographicLedgerService.record_event(
            db=db,
            case_id=case_id,
            actor_id=officer_id,
            event_type="OFFICER_REJECTED",
            event_payload={"decision": "REJECTED", "reason": reason, "notes": notes, "case_number": case.case_number}
        )

        db.commit()
        db.refresh(decision)
        return decision

    @classmethod
    def correct_field(
        cls,
        db: Session,
        case_id: str,
        officer_id: str,
        field_name: str,
        old_value: Any,
        new_value: Any,
        reason: str
    ) -> OfficerDecision:
        case = db.query(Case).filter(Case.id == case_id).first()
        if not case:
            raise BhoomiVerifyException(error_code=ErrorCode.NOT_FOUND, message=f"Case {case_id} not found.", status_code=status.HTTP_404_NOT_FOUND)

        decision = OfficerDecision(
            case_id=case_id,
            officer_id=officer_id,
            decision="FIELD_CORRECTED",
            field_corrected=field_name,
            old_value={"value": old_value},
            new_value={"value": new_value},
            reason=reason
        )
        db.add(decision)

        from app.models.document import Document
        extracted_fields = (
            db.query(ExtractedField)
            .join(Document, ExtractedField.document_id == Document.id)
            .filter(Document.case_id == case_id, ExtractedField.field_name == field_name)
            .all()
        )
        for ef in extracted_fields:
            ef.is_corrected = True
            ef.corrected_value = {"value": new_value}

        # Immutable ledger log of officer correction
        CryptographicLedgerService.record_event(
            db=db,
            case_id=case_id,
            actor_id=officer_id,
            event_type="OFFICER_FIELD_CORRECTION",
            event_payload={
                "field": field_name,
                "old_value": old_value,
                "new_value": new_value,
                "reason": reason,
                "case_number": case.case_number
            }
        )

        db.commit()
        db.refresh(decision)
        return decision
