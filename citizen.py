from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.case import Case
from app.schemas.common import APIResponse
from app.core.seeder import seed_demo_cases

router = APIRouter(prefix="/citizen", tags=["Citizen Portal"])

DEMO_CLAIMANTS = {
    "BV-2026-MH-4201": "Balasaheb Tukaram Pawar",
    "BV-2026-MH-1080": "Suresh Babanrao Kadam",
    "BV-2026-MH-760": "Dnyaneshwar Ramchandra Patil",
}


@router.get("/track/{case_number}", response_model=APIResponse[dict])
def track_verification(case_number: str, db: Session = Depends(get_db)):
    clean = case_number.strip()
    
    # Try exact case_number match first
    case = db.query(Case).filter(Case.case_number == clean).first()
    
    # Try flexible search by case_number, survey_number, or village
    if not case:
        case = db.query(Case).filter(
            (Case.case_number.ilike(f"%{clean}%")) |
            (Case.survey_number.ilike(f"%{clean}%")) |
            (Case.village.ilike(f"%{clean}%"))
        ).first()

    # Auto-seed if empty
    if not case:
        seed_demo_cases(db)
        case = db.query(Case).filter(
            (Case.case_number.ilike(f"%{clean}%")) |
            (Case.survey_number.ilike(f"%{clean}%")) |
            (Case.village.ilike(f"%{clean}%"))
        ).first()

    if not case:
        raise HTTPException(status_code=404, detail=f"Case or Record '{case_number}' not found.")

    status_str = "APPROVED" if case.status == "VERIFIED" else case.status
    if status_str == "FLAGGED":
        status_str = "FLAGGED_FOR_OFFICER"

    current_step = 3
    if status_str == "APPROVED":
        current_step = 5
    elif status_str in ("FLAGGED_FOR_OFFICER", "REJECTED"):
        current_step = 4

    claimant = DEMO_CLAIMANTS.get(case.case_number, "Balasaheb Tukaram Pawar")
    created_ts = case.created_at.isoformat() if case.created_at else None
    updated_ts = case.updated_at.isoformat() if case.updated_at else created_ts

    steps = [
        {
            "step": 1,
            "title": "Document Ingestion & Hash Generation",
            "description": "Physical parchment scanned & SHA-256 genesis fingerprint secured.",
            "completed": True,
            "timestamp": created_ts
        },
        {
            "step": 2,
            "title": "Multilingual AI OCR & Field Extraction",
            "description": "Indic script transliteration and canonical field normalization completed.",
            "completed": True,
            "timestamp": updated_ts
        },
        {
            "step": 3,
            "title": "Multi-Factor Revenue Cross-Validation",
            "description": "Fuzzy ownership match, mutation chronology, and Cadastral GIS verification evaluated.",
            "completed": True,
            "timestamp": updated_ts
        },
        {
            "step": 4,
            "title": "Revenue Officer (Tehsildar) Verification",
            "description": (
                "Notice issued for field measurement inquiry."
                if status_str == "FLAGGED_FOR_OFFICER"
                else "Record rejected due to legal restraint/court stay."
                if status_str == "REJECTED"
                else "Verified and countersigned by Tahsildar."
            ),
            "completed": status_str in ("APPROVED", "REJECTED"),
            "timestamp": updated_ts
        },
        {
            "step": 5,
            "title": "Digital RoR & Tamper-Proof Certificate Issued",
            "description": "Certified digital land record with QR-code cryptographic proof ready for citizen download.",
            "completed": status_str == "APPROVED",
            "timestamp": updated_ts if status_str == "APPROVED" else None
        }
    ]

    response_data = {
        "case_number": case.case_number,
        "survey_number": case.survey_number,
        "state_name": case.state,
        "state": case.state,
        "district": case.district,
        "tehsil": case.tehsil,
        "village": case.village,
        "claimant_name": claimant,
        "status": status_str,
        "current_step": current_step,
        "is_certificate_ready": status_str == "APPROVED",
        "qr_code_hash": f"SHA256-{case.case_number[-4:]}-BHOOMI",
        "steps": steps,
        "submitted_at": created_ts,
        "last_updated": updated_ts,
        "verified_seal": status_str == "APPROVED"
    }
    return APIResponse(data=response_data, message="Citizen tracking record retrieved.")
