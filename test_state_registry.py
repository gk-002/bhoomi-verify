import pytest
from app.states.registry import StateRegistry
from app.core.exceptions import StateNotSupportedException
from app.schemas.provider import SourceType


def test_all_28_states_registered():
    """Verify that exactly 28 official Indian state adapters are registered."""
    adapters = StateRegistry.list_all()
    assert len(adapters) == 28
    assert StateRegistry.count() == 28


def test_state_code_resolution():
    """Verify robust state code and name resolution."""
    assert StateRegistry.resolve_code("Maharashtra") == "MH"
    assert StateRegistry.resolve_code("maharashtra") == "MH"
    assert StateRegistry.resolve_code("MH") == "MH"
    assert StateRegistry.resolve_code("Karnataka") == "KA"
    assert StateRegistry.resolve_code("Uttar Pradesh") == "UP"
    assert StateRegistry.resolve_code("Gujarat") == "GJ"
    assert StateRegistry.resolve_code("Tamil Nadu") == "TN"
    assert StateRegistry.resolve_code("West Bengal") == "WB"


def test_adapter_retrieval():
    """Verify retrieving adapters by code or name."""
    mh_adapter = StateRegistry.get("Maharashtra")
    assert mh_adapter.state_code == "MH"
    assert mh_adapter.state_name == "Maharashtra"
    assert "7_12" in mh_adapter.capabilities().supported_documents

    ka_adapter = StateRegistry.get("KA")
    assert ka_adapter.state_code == "KA"
    assert "RTC" in ka_adapter.capabilities().supported_documents


def test_unknown_state_raises_exception():
    """Verify that an unsupported/unknown state raises StateNotSupportedException."""
    with pytest.raises(StateNotSupportedException):
        StateRegistry.get("Atlantis")


def test_customary_tenure_states_are_manual_verification():
    """Verify that north-eastern customary tenure states (Nagaland, Meghalaya, Arunachal) require manual verification."""
    nl_adapter = StateRegistry.get("NL")
    assert nl_adapter.capabilities().primary_source_type == SourceType.MANUAL_VERIFICATION
    assert nl_adapter.capabilities().can_search_ror is False

    ml_adapter = StateRegistry.get("ML")
    assert ml_adapter.capabilities().primary_source_type == SourceType.MANUAL_VERIFICATION

    ar_adapter = StateRegistry.get("AR")
    assert ar_adapter.capabilities().primary_source_type == SourceType.MANUAL_VERIFICATION
