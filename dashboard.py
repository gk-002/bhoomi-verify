from typing import Dict, Any, List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.core.database import get_db
from app.models.case import Case
from app.models.document import Document
from app.schemas.case import CaseResponse
from app.schemas.common import APIResponse

router = APIRouter(prefix="/dashboard", tags=["Dashboard & Analytics"])


@router.get("/metrics", response_model=APIResponse[Dict[str, Any]])
def get_dashboard_metrics(db: Session = Depends(get_db)):
    total_cases = db.query(Case).count()
    verified_count = db.query(Case).filter(Case.status == "VERIFIED").count()
    flagged_count = db.query(Case).filter(Case.status == "FLAGGED").count()
    rejected_count = db.query(Case).filter(Case.status == "REJECTED").count()
    triage_required = db.query(Case).filter(Case.requires_manual_verification == True).count()
    total_documents = db.query(Document).count()

    avg_risk = db.query(func.avg(Case.risk_score)).scalar() or 0.0

    state_breakdown = (
        db.query(Case.state_code, func.count(Case.id))
        .group_by(Case.state_code)
        .all()
    )

    metrics = {
        "total_cases": total_cases,
        "verified_cases": verified_count,
        "flagged_cases": flagged_count,
        "rejected_cases": rejected_count,
        "triage_queue_count": triage_required,
        "total_documents_ingested": total_documents,
        "average_risk_score": round(float(avg_risk), 2),
        "cases_by_state": {state: count for state, count in state_breakdown}
    }
    return APIResponse(data=metrics, message="Dashboard metrics computed.")


@router.get("/triage", response_model=APIResponse[List[CaseResponse]])
def get_triage_queue(db: Session = Depends(get_db)):
    pending = (
        db.query(Case)
        .filter(Case.requires_manual_verification == True)
        .order_by(Case.risk_score.desc())
        .limit(20)
        .all()
    )
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
    ) for c in pending]

    return APIResponse(data=resp_data, message=f"Retrieved {len(resp_data)} cases requiring officer triage.")
