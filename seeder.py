import uuid
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from app.models.case import Case
from app.models.verification import VerificationResult
from app.models.ledger import LedgerEntry
from app.models.user import User, Role
from app.core.security import get_password_hash
from app.core.logger import logger

def seed_demo_cases(db: Session):
    """Ensures default SIH demo cases exist in the database with complete audit trails."""
    demo_specs = [
        {
            "id": "case_demo_scenario_a",
            "case_number": "BV-2026-MH-4201",
            "state": "Maharashtra",
            "state_code": "MH",
            "district": "Ahilyanagar",
            "tehsil": "Nagar (Rural)",
            "village": "Hiware Bazar",
            "survey_number": "142/2",
            "subdivision": "2",
            "status": "VERIFIED",
            "risk_score": 12.0,
            "risk_band": "LOW",
            "requires_manual_verification": False,
            "summary": "Certified clean title with 100% cadastral match (23,500 sq.m) and unencumbered ownership for Balasaheb Tukaram Pawar.",
            "checks": [
                ("IDENTITY_ROR_MATCH", "MahaBhulekh 7/12 Adapter", "MATCH", 0.99, "Title holder Balasaheb Tukaram Pawar authenticated against MahaBhulekh official RoR database."),
                ("GIS_CADASTRAL_BOUNDARY", "DILRMP BhuNaksha GIS", "MATCH", 0.98, "Cadastral ground boundary conforms to documented 2.35 Ha with 0.0% deviation."),
                ("ENCUMBRANCE_AUDIT", "Sub-Registrar IGR Maharashtra", "MATCH", 0.99, "Zero pending mortgages or legal court freezes recorded.")
            ],
            "ledger": [
                (1, "DOCUMENT_INGESTION", "SYSTEM_GENESIS", "{\"action\": \"Parchment 7/12 Ingested\", \"survey\": \"142/2\"}", "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855", "0"*64, "a4f7819e6b2194883f3e2213e846059d3bc2891f1a5661d4cb8047db3379ac52"),
                (2, "AUTOMATED_VERIFICATION", "VERIFICATION_ENGINE", "{\"checks\": 3, \"status\": \"VERIFIED\", \"risk\": 12}", "b4c2910fae120894e63456789abcdef0123456789abcdef0123456789abcdef0", "a4f7819e6b2194883f3e2213e846059d3bc2891f1a5661d4cb8047db3379ac52", "c7d38910fae120894e63456789abcdef0123456789abcdef0123456789abcdef0"),
                (3, "OFFICER_SIGN_OFF", "OFFICER_TEHSILDAR", "{\"officer\": \"Shri. Rajesh Patil\", \"decision\": \"CERTIFIED_APPROVED\"}", "d9e48910fae120894e63456789abcdef0123456789abcdef0123456789abcdef0", "c7d38910fae120894e63456789abcdef0123456789abcdef0123456789abcdef0", "f1a28910fae120894e63456789abcdef0123456789abcdef0123456789abcdef0")
            ]
        },
        {
            "id": "case_demo_scenario_b",
            "case_number": "BV-2026-MH-1080",
            "state": "Maharashtra",
            "state_code": "MH",
            "district": "Satara",
            "tehsil": "Koregaon",
            "village": "Palashi",
            "survey_number": "215/1",
            "subdivision": "1",
            "status": "FLAGGED",
            "risk_score": 68.0,
            "risk_band": "HIGH",
            "requires_manual_verification": True,
            "summary": "Cadastral boundary overlap dispute (68.5 sq.m / 17.1%) detected with adjoining Gat 215/2 along eastern farm bund.",
            "checks": [
                ("IDENTITY_ROR_MATCH", "MahaBhulekh 7/12 Adapter", "MATCH", 0.95, "Title holder Suresh Babanrao Kadam confirmed in 7/12 records."),
                ("GIS_CADASTRAL_BOUNDARY", "DILRMP BhuNaksha GIS", "MISMATCH", 0.88, "Active boundary collision: 68.5 sq.m overlap with adjoining Gat 215/2."),
                ("SUCCESSION_MUTATION", "E-Ferfar Mutation Portal", "REQUIRES_REVIEW", 0.90, "Contested mutation M-1042 regarding succession rights.")
            ],
            "ledger": [
                (4, "DOCUMENT_INGESTION", "SYSTEM_GENESIS", "{\"action\": \"Tippan Record Ingested\", \"survey\": \"215/1\"}", "f3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855", "0"*64, "b5f7819e6b2194883f3e2213e846059d3bc2891f1a5661d4cb8047db3379ac52"),
                (5, "DISPUTE_FLAGGED", "SPATIAL_COLLISION_ENGINE", "{\"discrepancy\": \"OVERLAP_68.5_SQM\", \"neighbor\": \"215/2\"}", "e5c2910fae120894e63456789abcdef0123456789abcdef0123456789abcdef0", "b5f7819e6b2194883f3e2213e846059d3bc2891f1a5661d4cb8047db3379ac52", "d8e38910fae120894e63456789abcdef0123456789abcdef0123456789abcdef0")
            ]
        },
        {
            "id": "case_demo_scenario_c",
            "case_number": "BV-2026-MH-760",
            "state": "Maharashtra",
            "state_code": "MH",
            "district": "Amravati",
            "tehsil": "Daryapur",
            "village": "Wadner Gangai",
            "survey_number": "76/2",
            "subdivision": "2",
            "status": "REJECTED",
            "risk_score": 89.0,
            "risk_band": "CRITICAL",
            "requires_manual_verification": True,
            "summary": "Critical risk: Contested inheritance mutation M-789 omitting co-heir and Civil Court injunction RCS/142/2024.",
            "checks": [
                ("MUTATION_AUDIT", "E-Ferfar Maharashtra", "MISMATCH", 0.94, "Mutation M-789 omitted legal co-heir Anusaya Deshmukh."),
                ("COURT_CASE_REGISTRY", "e-Courts National Portal", "MISMATCH", 0.99, "Active Civil Court Injunction RCS/142/2024 restraining alienation.")
            ],
            "ledger": [
                (6, "DOCUMENT_INGESTION", "SYSTEM_GENESIS", "{\"action\": \"Khasra Record Ingested\", \"survey\": \"76/2\"}", "d2b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855", "0"*64, "c6f7819e6b2194883f3e2213e846059d3bc2891f1a5661d4cb8047db3379ac52"),
                (7, "LEGAL_FREEZE_APPLIED", "ECOURTS_INTEGRATION", "{\"court\": \"Civil Judge Senior Division Daryapur\", \"suit\": \"RCS/142/2024\"}", "a1c2910fae120894e63456789abcdef0123456789abcdef0123456789abcdef0", "c6f7819e6b2194883f3e2213e846059d3bc2891f1a5661d4cb8047db3379ac52", "e9f38910fae120894e63456789abcdef0123456789abcdef0123456789abcdef0")
            ]
        }
    ]

    for spec in demo_specs:
        existing = db.query(Case).filter((Case.id == spec["id"]) | (Case.case_number == spec["case_number"])).first()
        if not existing:
            c = Case(
                id=spec["id"],
                case_number=spec["case_number"],
                state=spec["state"],
                state_code=spec["state_code"],
                district=spec["district"],
                tehsil=spec["tehsil"],
                village=spec["village"],
                survey_number=spec["survey_number"],
                subdivision=spec["subdivision"],
                status=spec["status"],
                risk_score=spec["risk_score"],
                risk_band=spec["risk_band"],
                requires_manual_verification=spec["requires_manual_verification"],
                summary=spec["summary"]
            )
            db.add(c)
            db.flush()

            for vtype, provider, vstatus, conf, summary in spec["checks"]:
                vr = VerificationResult(
                    id=str(uuid.uuid4()),
                    case_id=c.id,
                    verification_type=vtype,
                    status=vstatus,
                    confidence=conf,
                    source_provider=provider,
                    summary=summary,
                    discrepancies=[]
                )
                db.add(vr)

            for b_idx, ev_type, actor, payload, p_hash, prev_h, cur_h in spec["ledger"]:
                le = LedgerEntry(
                    id=str(uuid.uuid4()),
                    block_index=b_idx,
                    case_id=c.id,
                    actor_id=actor,
                    event_type=ev_type,
                    canonical_payload=payload,
                    payload_hash=p_hash,
                    previous_hash=prev_h,
                    current_hash=cur_h
                )
                db.add(le)

    # Seed Default Roles
    officer_role = db.query(Role).filter(Role.name == "OFFICER").first()
    if not officer_role:
        officer_role = Role(name="OFFICER", description="Revenue Officer / Tahsildar with Adjudication Authority")
        db.add(officer_role)

    citizen_role = db.query(Role).filter(Role.name == "CITIZEN").first()
    if not citizen_role:
        citizen_role = Role(name="CITIZEN", description="Citizen / Landholder Applicant")
        db.add(citizen_role)

    db.flush()

    # Seed Default Officer User
    officer_user = db.query(User).filter(User.username == "officer").first()
    if not officer_user:
        officer_user = User(
            username="officer",
            email="officer.deshpande@mahabhumi.gov.in",
            hashed_password=get_password_hash("officer123"),
            full_name="Smt. Smita Deshpande",
            designation="Tahsildar & Revenue Adjudicator",
            state_code="MH",
            roles=[officer_role]
        )
        db.add(officer_user)

    # Seed Default Citizen User
    citizen_user = db.query(User).filter(User.username == "citizen").first()
    if not citizen_user:
        citizen_user = User(
            username="citizen",
            email="balasaheb.pawar@farmer.in",
            hashed_password=get_password_hash("citizen123"),
            full_name="Balasaheb Tukaram Pawar",
            designation="Landholder & Title Applicant",
            state_code="MH",
            roles=[citizen_role]
        )
        db.add(citizen_user)

    db.commit()
    logger.info("Demo cases, roles, and users seeded successfully into SQLite database.")
