import pytest
from app.integrations.capability_router import CapabilityRouter
from app.integrations.provider_registry import ProviderRegistry


def test_maharashtra_routing_isolation():
    """CRITICAL TEST: Maharashtra request must NOT execute Karnataka, Gujarat, or other unrelated providers."""
    plan = CapabilityRouter.resolve_and_route(
        state="Maharashtra",
        operation="ROR_LOOKUP",
        document_type="7_12"
    )

    assert plan["state_code"] == "MH"
    assert plan["adapter"].state_code == "MH"

    # Ensure every single eligible provider returned is strictly for Maharashtra
    for provider in plan["eligible_providers"]:
        assert provider.state == "MH"
        assert provider.state != "KA"
        assert provider.state != "GJ"
        assert provider.state != "UP"

    assert plan["selected_provider"].state == "MH"
    assert plan["selected_provider"].provider_id == "maharashtra_mahabhumi_ror"


def test_karnataka_routing_isolation():
    """CRITICAL TEST: Karnataka request must NOT execute all 28 providers."""
    plan = CapabilityRouter.resolve_and_route(
        state="Karnataka",
        operation="ROR_LOOKUP",
        document_type="RTC"
    )

    assert plan["state_code"] == "KA"
    assert plan["adapter"].state_code == "KA"

    # Eligible providers count must NOT be 28 or contain other states
    assert len(plan["eligible_providers"]) < 5
    for provider in plan["eligible_providers"]:
        assert provider.state == "KA"
        assert provider.state != "MH"

    assert plan["selected_provider"].provider_id == "karnataka_bhoomi_ror"


def test_unsupported_operation_returns_empty_provider_list():
    """Verify that an operation not supported in a state returns empty eligible list without crashing."""
    eligible = ProviderRegistry.find_providers(
        state_code="MH",
        operation="NON_EXISTENT_SPACE_OPERATION"
    )
    assert len(eligible) == 0
