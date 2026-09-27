import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, status, HTTPException, Response
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.rbac import get_current_user, TokenData
from app.models.case import Case, AuditEvent
from app.schemas.case import CaseCreate, CaseResponse, CaseDetailResponse
from app.schemas.risk import RiskEvaluationResponse
from app.schemas.lineage import LineageGraphResponse
from app.schemas.common import APIResponse
from app.verification.risk_engine import TransparentRiskEngine
from app.lineage.graph import LineageGraph
from app.reports.pdf_generator import VerificationReportPDFGenerator

router = APIRouter(prefix="/cases", tags=["Case Management"])


@router.get("", response_model=APIResponse[List[CaseResponse]])
def list_cases(
    skip: int = 0,
    limit: int = 50,
    status_filter: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Case)
    if status_filter:
        query = query.filter(Case.status == status_filter.upper())
    cases = query.order_by(Case.created_at.desc()).offset(skip).limit(limit).all()

    resp_data = [CaseResponse(
        id=c.id,
        case_number=c.case_number,
        state=c.state,
        state_code=c.state_code,
        district=c.district,
        tehsil=c.tehsil,
        village=c.village,
        survey_number=c.survey_number,
        subdivision=c.subdivision,
        status=c.status,
        risk_score=c.risk_score,
        risk_band=c.risk_band,
        requires_manual_verification=c.requires_manual_verification,
        summary=c.summary,
        created_at=c.created_at,
        updated_at=c.updated_at
    ) for c in cases]

    return APIResponse(data=resp_data, message=f"Retrieved {len(resp_data)} cases.")


@router.post("", response_model=APIResponse[CaseResponse], status_code=status.HTTP_201_CREATED)
def create_case(
    case_in: CaseCreate,
    db: Session = Depends(get_db),
    current_user: TokenData = Depends(get_current_user)
):
    case_number = f"BV-{case_in.state_code.upper()}-{uuid.uuid4().hex[:6].upper()}"
    case = Case(
        case_number=case_number,
        state=case_in.state,
        state_code=case_in.state_code.upper(),
        district=case_in.district,
        tehsil=case_in.tehsil,
        village=case_in.village,
        survey_number=case_in.survey_number,
        subdivision=case_in.subdivision,
        status="SUBMITTED"
    )
    db.add(case)
    db.commit()
    db.refresh(case)

    return APIResponse(
        data=CaseResponse(
            id=case.id,
            case_number=case.case_number,
            state=case.state,
            state_code=case.state_code,
            district=case.district,
            tehsil=case.tehsil,
            village=case.village,
            survey_number=case.survey_number,
            subdivision=case.subdivision,
            status=case.status,
            risk_score=case.risk_score,
            risk_band=case.risk_band,
            requires_manual_verification=case.requires_manual_verification,
            summary=case.summary,
            created_at=case.created_at,
            updated_at=case.updated_at
        ),
        message="Case registered successfully."
    )


def find_case_by_identifier(case_id: str, db: Session) -> Optional[Case]:
    """Finds a case by primary UUID or public case_number (e.g. BV-2026-MH-4201)."""
    case = db.query(Case).filter((Case.id == case_id) | (Case.case_number == case_id)).first()
    if not case:
        from app.core.seeder import seed_demo_cases
        seed_demo_cases(db)
        case = db.query(Case).filter((Case.id == case_id) | (Case.case_number == case_id)).first()
    return case


@router.get("/{case_id}", response_model=APIResponse[CaseDetailResponse])
def get_case(case_id: str, db: Session = Depends(get_db)):
    case = find_case_by_identifier(case_id, db)
    if not case:
        raise HTTPException(status_code=404, detail="Case not found.")

    return APIResponse(
        data=CaseDetailResponse(
            id=case.id,
            case_number=case.case_number,
            state=case.state,
            state_code=case.state_code,
            district=case.district,
            tehsil=case.tehsil,
            village=case.village,
            survey_number=case.survey_number,
            subdivision=case.subdivision,
            status=case.status,
            risk_score=case.risk_score,
            risk_band=case.risk_band,
            requires_manual_verification=case.requires_manual_verification,
            summary=case.summary,
            created_at=case.created_at,
            updated_at=case.updated_at,
            documents_count=len(case.documents),
            verification_count=len(case.verification_results),
            risk_factors_count=len(case.risk_evaluations),
            officer_decisions_count=len(case.decisions)
        )
    )


@router.get("/{case_id}/risk", response_model=APIResponse[RiskEvaluationResponse])
def get_case_risk(case_id: str, db: Session = Depends(get_db)):
    case = find_case_by_identifier(case_id, db)
    if not case:
        raise HTTPException(status_code=404, detail="Case not found.")

    all_discrepancies = []
    for v in case.verification_results:
        all_discrepancies.extend(v.discrepancies)

    risk_eval = TransparentRiskEngine.evaluate(case_id=case.id, discrepancies=all_discrepancies)
    return APIResponse(data=risk_eval)


@router.get("/{case_id}/lineage", response_model=APIResponse[LineageGraphResponse])
def get_case_lineage(case_id: str, db: Session = Depends(get_db)):
    case = find_case_by_identifier(case_id, db)
    if not case:
        raise HTTPException(status_code=404, detail="Case not found.")

    graph = LineageGraph(case_id=case.id)
    graph.add_node("node_root", "Ancestral Title Holder", node_type="ANCESTOR", generation=1, deceased=True)
    graph.add_node("node_current", "Current Recorded Owner", node_type="CURRENT_OWNER", generation=2)
    graph.add_edge("node_root", "node_current", transition_type="INHERITANCE", mutation_number="1042")

    return APIResponse(data=graph.build_response())


@router.get("/{case_id}/audit", response_model=APIResponse[List[dict]])
def get_case_audit(case_id: str, db: Session = Depends(get_db)):
    case = find_case_by_identifier(case_id, db)
    if not case:
        raise HTTPException(status_code=404, detail="Case not found.")

    events = db.query(AuditEvent).filter(AuditEvent.case_id == case.id).order_by(AuditEvent.timestamp.asc()).all()
    data = [{
        "id": e.id,
        "actor_id": e.actor_id,
        "event_type": e.event_type,
        "description": e.description,
        "timestamp": e.timestamp
    } for e in events]
    return APIResponse(data=data, message=f"Retrieved {len(data)} audit events.")


@router.get("/{case_id}/report")
def download_verification_report(case_id: str, db: Session = Depends(get_db)):
    case = find_case_by_identifier(case_id, db)
    if not case:
        raise HTTPException(status_code=404, detail="Case not found.")

    pdf_bytes = VerificationReportPDFGenerator.generate_report(case)
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f"inline; filename=BhoomiVerify_{case.case_number}.pdf",
            "Content-Type": "application/pdf"
        }
    )
