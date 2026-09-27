from typing import Optional, List, Dict, Any
from datetime import datetime, timezone
from pydantic import BaseModel, ConfigDict


class LedgerBlockResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    block_index: int
    case_id: str
    actor_id: str
    event_type: str
    payload_hash: str
    previous_hash: str
    current_hash: str
    timestamp: datetime


class ChainVerificationResponse(BaseModel):
    is_valid: bool
    total_blocks: int
    genesis_hash: str
    latest_hash: str
    tampered_block_index: Optional[int] = None
    message: str
