from datetime import datetime, timezone
from typing import List, Dict, Any
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.integrations.provider_registry import ProviderRegistry
from app.integrations.circuit_breaker import CircuitBreakerRegistry
from app.integrations.credentials import ProviderCredentialRegistry
from app.states.registry import StateRegistry
from app.schemas.provider import ProviderHealthResponse, ProviderConfigSchema
from app.schemas.common import APIResponse

router = APIRouter(prefix="/providers", tags=["Provider Registry & Health"])


@router.get("/health", response_model=APIResponse[List[ProviderHealthResponse]])
def get_providers_health():
    providers = ProviderRegistry.list_all()
    health_list: List[ProviderHealthResponse] = []

    for p in providers:
        breaker = CircuitBreakerRegistry.get_breaker(p.provider_id)
        cred_config = ProviderCredentialRegistry.get_credential_config(p.provider_id)

        health_list.append(
            ProviderHealthResponse(
                provider_id=p.provider_id,
                state_code=p.state,
                status="HEALTHY" if breaker.state == "CLOSED" else "DEGRADED",
                circuit_state=breaker.state,
                source_type=p.source_type,
                official_domain=p.official_domain,
                requires_credentials=p.requires_credentials,
                credential_status=cred_config.status,
                last_latency_ms=120.0,
                last_checked_at=datetime.now(timezone.utc)
            )
        )

    return APIResponse(data=health_list, message=f"Health status checked for {len(health_list)} providers.")


@router.get("/states", response_model=APIResponse[List[Dict[str, Any]]])
def list_registered_states():
    adapters = StateRegistry.list_all()
    states_data = []
    for a in adapters:
        cap = a.capabilities()
        states_data.append({
            "state_code": cap.state_code,
            "state_name": cap.state_name,
            "official_portal_name": cap.official_portal_name,
            "official_domain": cap.official_domain,
            "primary_source_type": cap.primary_source_type.value,
            "supported_documents": cap.supported_documents,
            "supported_identifiers": cap.supported_identifiers,
            "can_search_ror": cap.can_search_ror,
            "can_get_mutation": cap.can_get_mutation,
            "can_get_cadastral": cap.can_get_cadastral,
            "requires_captcha_or_session": cap.requires_captcha_or_session,
            "notes": cap.notes
        })

    return APIResponse(data=states_data, message=f"Total {len(states_data)} official Indian State adapters loaded.")
