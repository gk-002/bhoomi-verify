from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field
from enum import Enum


class SourceType(str, Enum):
    PUBLIC_API = "PUBLIC_API"
    AUTHENTICATED_API = "AUTHENTICATED_API"
    OFFICIAL_PORTAL = "OFFICIAL_PORTAL"
    OFFICIAL_DATA_SERVICE = "OFFICIAL_DATA_SERVICE"
    OFFICIAL_DOWNLOAD = "OFFICIAL_DOWNLOAD"
    MANUAL_VERIFICATION = "MANUAL_VERIFICATION"
    UNAVAILABLE = "UNAVAILABLE"
    UNKNOWN = "UNKNOWN"


class AuthType(str, Enum):
    NONE = "NONE"
    API_KEY = "API_KEY"
    OAUTH2 = "OAUTH2"
    CAPTCHA_SESSION = "CAPTCHA_SESSION"
    IP_WHITELIST = "IP_WHITELIST"
    CERTIFICATE = "CERTIFICATE"


class CredentialStatus(str, Enum):
    CREDENTIAL_CONFIGURED = "CREDENTIAL_CONFIGURED"
    CREDENTIAL_NOT_REQUIRED = "CREDENTIAL_NOT_REQUIRED"
    CREDENTIAL_MISSING = "CREDENTIAL_MISSING"


class ProviderConfigSchema(BaseModel):
    provider_id: str
    provider_name: str
    state: str  # State Code (e.g. MH, KA, GJ)
    source_type: SourceType
    official_domain: str
    supported_documents: List[str]  # e.g., ["7_12", "8A"]
    supported_operations: List[str]  # e.g., ["ROR_LOOKUP", "MUTATION_CHECK"]
    supported_identifiers: List[str]  # e.g., ["SURVEY_NUMBER", "GAT_NUMBER"]
    authentication_type: AuthType = AuthType.NONE
    requires_credentials: bool = False
    endpoint: Optional[str] = None
    timeout_seconds: float = 10.0
    retry_policy: Dict[str, Any] = Field(default_factory=lambda: {"max_retries": 3, "backoff_factor": 1.5})
    rate_limit_per_minute: int = 60
    cache_ttl_seconds: int = 3600
    enabled: bool = True
    verification_status: str = "OFFICIAL_VERIFIED"


class ProviderCredentialConfig(BaseModel):
    provider_id: str
    credential_type: str  # API_KEY, CLIENT_SECRET, CERTIFICATE, NONE
    environment_variable: Optional[str] = None
    required: bool = False
    configured: bool = False
    status: CredentialStatus = CredentialStatus.CREDENTIAL_NOT_REQUIRED


class ProviderHealthResponse(BaseModel):
    provider_id: str
    state_code: str
    status: str  # HEALTHY, DEGRADED, RATE_LIMITED, UNAVAILABLE, DISABLED
    circuit_state: str  # CLOSED, OPEN, HALF_OPEN
    source_type: SourceType
    official_domain: str
    requires_credentials: bool
    credential_status: CredentialStatus
    last_latency_ms: float
    last_checked_at: datetime
