import hashlib
import json
from typing import Dict, Any, List, Optional, Tuple
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from app.models.ledger import LedgerEntry
from app.schemas.ledger import LedgerBlockResponse, ChainVerificationResponse

GENESIS_HASH = "0" * 64


class CryptographicLedgerService:
    """Manages an immutable, tamper-evident SHA-256 hash-chained audit ledger."""

    @staticmethod
    def canonical_json(payload: Dict[str, Any]) -> str:
        """Produces deterministic, canonically ordered JSON without whitespace variations."""
        return json.dumps(payload, sort_keys=True, separators=(',', ':'), default=str)

    @staticmethod
    def calculate_sha256(data: str) -> str:
        return hashlib.sha256(data.encode('utf-8')).hexdigest()

    @classmethod
    def record_event(
        cls,
        db: Session,
        case_id: str,
        actor_id: str,
        event_type: str,
        event_payload: Dict[str, Any]
    ) -> LedgerEntry:
        """Appends a new verified event block to the tamper-evident chain."""
        canonical_str = cls.canonical_json(event_payload)
        payload_hash = cls.calculate_sha256(canonical_str)

        # Get latest block in the chain to fetch its current_hash
        latest_entry = (
            db.query(LedgerEntry)
            .order_by(LedgerEntry.block_index.desc())
            .first()
        )

        if latest_entry is None:
            previous_hash = GENESIS_HASH
            block_index = 1
        else:
            previous_hash = latest_entry.current_hash
            block_index = latest_entry.block_index + 1

        # Calculate current hash: SHA256(previous_hash + canonical_str)
        hash_input = f"{previous_hash}{canonical_str}"
        current_hash = cls.calculate_sha256(hash_input)

        entry = LedgerEntry(
            block_index=block_index,
            case_id=case_id,
            actor_id=actor_id,
            event_type=event_type,
            canonical_payload=canonical_str,
            payload_hash=payload_hash,
            previous_hash=previous_hash,
            current_hash=current_hash,
            timestamp=datetime.now(timezone.utc)
        )
        db.add(entry)
        db.commit()
        db.refresh(entry)
        return entry

    @classmethod
    def verify_chain_integrity(cls, db: Session) -> ChainVerificationResponse:
        """Audits every block in the ledger, detecting any tampering or hash break."""
        entries = db.query(LedgerEntry).order_by(LedgerEntry.block_index.asc()).all()

        if not entries:
            return ChainVerificationResponse(
                is_valid=True,
                total_blocks=0,
                genesis_hash=GENESIS_HASH,
                latest_hash=GENESIS_HASH,
                message="Ledger is empty. Zero blocks recorded."
            )

        expected_prev_hash = GENESIS_HASH

        for entry in entries:
            # 1. Verify previous hash link
            if entry.previous_hash != expected_prev_hash:
                return ChainVerificationResponse(
                    is_valid=False,
                    total_blocks=len(entries),
                    genesis_hash=GENESIS_HASH,
                    latest_hash=entries[-1].current_hash,
                    tampered_block_index=entry.block_index,
                    message=f"Tampering detected at block #{entry.block_index}: previous_hash mismatch."
                )

            # 2. Re-compute payload hash
            recalc_payload_hash = cls.calculate_sha256(entry.canonical_payload)
            if recalc_payload_hash != entry.payload_hash:
                return ChainVerificationResponse(
                    is_valid=False,
                    total_blocks=len(entries),
                    genesis_hash=GENESIS_HASH,
                    latest_hash=entries[-1].current_hash,
                    tampered_block_index=entry.block_index,
                    message=f"Tampering detected at block #{entry.block_index}: payload content modified."
                )

            # 3. Re-compute current hash
            recalc_current_hash = cls.calculate_sha256(f"{entry.previous_hash}{entry.canonical_payload}")
            if recalc_current_hash != entry.current_hash:
                return ChainVerificationResponse(
                    is_valid=False,
                    total_blocks=len(entries),
                    genesis_hash=GENESIS_HASH,
                    latest_hash=entries[-1].current_hash,
                    tampered_block_index=entry.block_index,
                    message=f"Tampering detected at block #{entry.block_index}: current hash altered."
                )

            expected_prev_hash = entry.current_hash

        return ChainVerificationResponse(
            is_valid=True,
            total_blocks=len(entries),
            genesis_hash=GENESIS_HASH,
            latest_hash=entries[-1].current_hash,
            message=f"Ledger cryptographically verified across all {len(entries)} blocks. Chain intact."
        )
