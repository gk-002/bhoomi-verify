from typing import List, Dict, Any, Optional
from app.states.registry import StateRegistry
from app.integrations.provider_registry import ProviderRegistry
from app.integrations.provider_config import ProviderConfig
from app.integrations.circuit_breaker import CircuitBreakerRegistry, CircuitState
from app.integrations.credentials import ProviderCredentialRegistry
from app.core.exceptions import (
    BhoomiVerifyException,
    SourceUnavailableException,
    StateNotSupportedException,
    ErrorCode
)
from app.core.logger import logger


class CapabilityRouter:
    """Routes requests to the exact eligible state adapter and provider without bleed."""

    @classmethod
    def resolve_and_route(
        cls,
        state: str,
        operation: str,
        document_type: Optional[str] = None,
        district: Optional[str] = None,
        tehsil: Optional[str] = None,
        village: Optional[str] = None,
        identifier: Optional[str] = None
    ) -> Dict[str, Any]:
        """Resolves state, verifies capability, filters healthy providers, and returns execution plan."""
        # 1. Resolve State
        state_code = StateRegistry.resolve_code(state)
        if not state_code:
            raise StateNotSupportedException(state)

        adapter = StateRegistry.get(state_code)
        capabilities = adapter.capabilities()

        # 2. Find eligible providers for this state & operation
        eligible_providers = ProviderRegistry.find_providers(
            state_code=state_code,
            operation=operation,
            document_type=document_type
        )

        # 3. Filter by health (circuit breaker check)
        healthy_providers = []
        for p in eligible_providers:
            breaker = CircuitBreakerRegistry.get_breaker(p.provider_id)
            if breaker.can_execute():
                healthy_providers.append(p)
            else:
                logger.warning(f"Provider {p.provider_id} skipped: Circuit is {breaker.state}")

        selected_provider: Optional[ProviderConfig] = None
        if healthy_providers:
            selected_provider = healthy_providers[0]
        elif eligible_providers:
            selected_provider = eligible_providers[0]

        return {
            "state_code": state_code,
            "adapter": adapter,
            "capabilities": capabilities,
            "eligible_providers": eligible_providers,
            "selected_provider": selected_provider,
            "has_healthy_provider": len(healthy_providers) > 0
        }
