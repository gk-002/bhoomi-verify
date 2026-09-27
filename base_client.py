import time
import httpx
from typing import Dict, Any, Optional
from app.integrations.provider_config import ProviderConfig
from app.integrations.circuit_breaker import CircuitBreakerRegistry
from app.integrations.credentials import ProviderCredentialRegistry
from app.core.exceptions import BhoomiVerifyException, SourceUnavailableException, ErrorCode
from app.core.logger import logger, log_api_event


class BaseProviderClient:
    """Base client for interacting with verified external land record endpoints."""

    def __init__(self, config: ProviderConfig):
        self.config = config
        self.breaker = CircuitBreakerRegistry.get_breaker(config.provider_id)

    async def execute_request(
        self,
        endpoint_url: str,
        params: Optional[Dict[str, Any]] = None,
        headers: Optional[Dict[str, str]] = None,
        request_id: str = "req_internal",
        case_id: str = "case_internal"
    ) -> Dict[str, Any]:
        """Executes HTTP request guarded by circuit breaker, timeout, and structured audit log."""
        if not self.breaker.can_execute():
            raise SourceUnavailableException(
                provider=self.config.provider_id,
                message=f"Circuit breaker is OPEN for {self.config.provider_name}. Service degraded."
            )

        start_time = time.time()
        client_headers = headers or {}
        
        # Attach authentic credential if configured
        secret = ProviderCredentialRegistry.get_secret(self.config.provider_id)
        if secret:
            client_headers["X-API-Key"] = secret

        try:
            async with httpx.AsyncClient(timeout=self.config.timeout_seconds) as client:
                response = await client.get(endpoint_url, params=params, headers=client_headers)
                latency_ms = (time.time() - start_time) * 1000.0

                if response.status_code == 200:
                    self.breaker.record_success()
                    log_api_event(
                        request_id=request_id,
                        case_id=case_id,
                        state=self.config.state,
                        provider_id=self.config.provider_id,
                        operation="HTTP_GET",
                        latency_ms=latency_ms,
                        status="SUCCESS"
                    )
                    return response.json()
                elif response.status_code == 429:
                    self.breaker.record_failure()
                    raise BhoomiVerifyException(
                        error_code=ErrorCode.RATE_LIMITED,
                        message=f"Rate limit exceeded on {self.config.provider_name}.",
                        status_code=429,
                        provider=self.config.provider_id
                    )
                else:
                    self.breaker.record_failure()
                    raise SourceUnavailableException(
                        provider=self.config.provider_id,
                        message=f"Official provider returned HTTP {response.status_code}."
                    )
        except httpx.TimeoutException:
            self.breaker.record_failure()
            latency_ms = (time.time() - start_time) * 1000.0
            log_api_event(
                request_id=request_id,
                case_id=case_id,
                state=self.config.state,
                provider_id=self.config.provider_id,
                operation="HTTP_GET",
                latency_ms=latency_ms,
                status="TIMEOUT",
                error_code="TIMEOUT"
            )
            raise BhoomiVerifyException(
                error_code=ErrorCode.TIMEOUT,
                message=f"Timeout communicating with {self.config.provider_name}.",
                status_code=504,
                provider=self.config.provider_id,
                requires_manual_verification=True
            )
        except Exception as e:
            self.breaker.record_failure()
            raise SourceUnavailableException(
                provider=self.config.provider_id,
                message=f"Connection failure with {self.config.provider_name}: {str(e)}"
            )
