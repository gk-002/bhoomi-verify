from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.ledger.cryptographic_ledger import CryptographicLedgerService
from app.models.ledger import LedgerEntry
from app.schemas.ledger import LedgerBlockResponse, ChainVerificationResponse
from app.schemas.common import APIResponse

router = APIRouter(prefix="/ledger", tags=["Cryptographic Audit Ledger"])


@router.get("/verify", response_model=APIResponse[ChainVerificationResponse])
def verify_ledger(db: Session = Depends(get_db)):
    result = CryptographicLedgerService.verify_chain_integrity(db)
    return APIResponse(
        data=result,
        message="Cryptographic audit ledger integrity check complete."
    )


@router.get("/entries", response_model=APIResponse[List[LedgerBlockResponse]])
def get_ledger_entries(skip: int = 0, limit: int = 50, db: Session = Depends(get_db)):
    entries = db.query(LedgerEntry).order_by(LedgerEntry.block_index.desc()).offset(skip).limit(limit).all()
    resp_data = [LedgerBlockResponse(
        id=e.id,
        block_index=e.block_index,
        case_id=e.case_id,
        actor_id=e.actor_id,
        event_type=e.event_type,
        payload_hash=e.payload_hash,
        previous_hash=e.previous_hash,
        current_hash=e.current_hash,
        timestamp=e.timestamp
    ) for e in entries]

    return APIResponse(data=resp_data, message=f"Retrieved {len(resp_data)} ledger blocks.")
