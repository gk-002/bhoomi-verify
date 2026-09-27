import pytest
from app.ledger.cryptographic_ledger import CryptographicLedgerService, GENESIS_HASH
from app.models.ledger import LedgerEntry


def test_cryptographic_chain_creation_and_integrity(db):
    # 1. Record Block 1
    block1 = CryptographicLedgerService.record_event(
        db=db,
        case_id="case_001",
        actor_id="officer_01",
        event_type="INGESTION",
        event_payload={"filename": "7_12.pdf", "hash": "abc1234"}
    )
    assert block1.block_index == 1
    assert block1.previous_hash == GENESIS_HASH
    assert len(block1.current_hash) == 64

    # 2. Record Block 2
    block2 = CryptographicLedgerService.record_event(
        db=db,
        case_id="case_001",
        actor_id="verifier_02",
        event_type="VERIFICATION",
        event_payload={"status": "VERIFIED", "risk": 5.0}
    )
    assert block2.block_index == 2
    assert block2.previous_hash == block1.current_hash

    # 3. Verify Chain Integrity
    verification = CryptographicLedgerService.verify_chain_integrity(db)
    assert verification.is_valid is True
    assert verification.total_blocks == 2
    assert verification.latest_hash == block2.current_hash


def test_cryptographic_tampering_detection(db):
    # Record two valid blocks
    b1 = CryptographicLedgerService.record_event(
        db=db, case_id="c1", actor_id="a1", event_type="E1", event_payload={"val": 100}
    )
    b2 = CryptographicLedgerService.record_event(
        db=db, case_id="c1", actor_id="a1", event_type="E2", event_payload={"val": 200}
    )

    # Maliciously mutate block 1 payload directly in database
    b1.canonical_payload = '{"val":999}'
    db.commit()

    # Audit chain
    verification = CryptographicLedgerService.verify_chain_integrity(db)
    assert verification.is_valid is False
    assert verification.tampered_block_index == 1
    assert "Tampering detected" in verification.message
