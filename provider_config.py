from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field
from app.schemas.provider import SourceType, AuthType


class ProviderConfig(BaseModel):
    provider_id: str
    provider_name: str
    state: str  # State code (e.g. MH, KA, GJ, etc.)
    source_type: SourceType
    official_domain: str
    supported_documents: List[str]
    supported_operations: List[str]  # ROR_LOOKUP, MUTATION_CHECK, CADASTRAL_GIS, REGISTRATION_CHECK
    supported_identifiers: List[str]  # SURVEY_NUMBER, GAT_NUMBER, KHASRA_NUMBER, PLOT_NUMBER
    authentication_type: AuthType = AuthType.NONE
    requires_credentials: bool = False
    endpoint: Optional[str] = None
    timeout_seconds: float = 10.0
    retry_policy: Dict[str, Any] = Field(default_factory=lambda: {"max_retries": 3, "backoff_factor": 1.5})
    rate_limit_per_minute: int = 60
    cache_ttl_seconds: int = 3600
    enabled: bool = True
    verification_status: str = "OFFICIAL_VERIFIED"
