from typing import Dict, Any, List, Optional
from app.integrations.provider_config import ProviderConfig
from app.integrations.base_client import BaseProviderClient
from app.integrations.circuit_breaker import CircuitBreakerRegistry
from app.core.exceptions import SourceUnavailableException, BhoomiVerifyException
from app.core.logger import logger


class ProviderManager:
    """Orchestrates provider execution with intelligent fallback and failure isolation."""

    @classmethod
    async def execute_with_fallback(
        cls,
        providers: List[ProviderConfig],
        execution_coroutine_builder: Any,
        fallback_default: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Tries primary provider; if failing, falls back to secondary without fabricating data."""
        if not providers:
            return {
                "status": "SOURCE_UNAVAILABLE",
                "requires_manual_verification": True,
                "message": "No verified online provider configured for this operation."
            }

        last_error = None
        for provider in providers:
            breaker = CircuitBreakerRegistry.get_breaker(provider.provider_id)
            if not breaker.can_execute():
                logger.info(f"Skipping degraded provider {provider.provider_id}")
                continue

            try:
                # Execute the provider call
                result = await execution_coroutine_builder(provider)
                breaker.record_success()
                return result
            except Exception as e:
                breaker.record_failure()
                last_error = str(e)
                logger.warning(f"Provider {provider.provider_id} failed ({str(e)}). Attempting fallback...")

        # If all providers fail, return clean SOURCE_UNAVAILABLE without crash
        if fallback_default:
            return fallback_default

        return {
            "status": "SOURCE_UNAVAILABLE",
            "provider": providers[0].provider_id if providers else "UNKNOWN",
            "message": f"Official source could not be reached. Last error: {last_error}",
            "requires_manual_verification": True
        }
