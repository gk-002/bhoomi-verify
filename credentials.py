import os
from typing import Dict, Optional, List, Any
from app.schemas.provider import ProviderCredentialConfig, CredentialStatus


class ProviderCredentialRegistry:
    """Manages credentials exclusively via environment variables and inspects readiness."""

    _CREDENTIAL_SPECS: Dict[str, Dict[str, Any]] = {
        "maharashtra_mahabhumi_ror": {
            "credential_type": "NONE",
            "env_var": "MAHARASHTRA_API_KEY",
            "required": False
        },
        "karnataka_bhoomi_api": {
            "credential_type": "API_KEY",
            "env_var": "KARNATAKA_API_KEY",
            "required": False
        },
        "gujarat_anyror_portal": {
            "credential_type": "NONE",
            "env_var": "GUJARAT_API_KEY",
            "required": False
        },
        "up_bhulekh_api": {
            "credential_type": "API_KEY",
            "env_var": "UTTAR_PRADESH_API_KEY",
            "required": False
        },
        "central_apisetu_gateway": {
            "credential_type": "API_KEY",
            "env_var": "API_SETU_API_KEY",
            "required": False
        }
    }

    @classmethod
    def get_credential_config(cls, provider_id: str) -> ProviderCredentialConfig:
        spec = cls._CREDENTIAL_SPECS.get(provider_id, {
            "credential_type": "NONE",
            "env_var": None,
            "required": False
        })
        env_var = spec["env_var"]
        required = spec["required"]
        credential_type = spec["credential_type"]

        if credential_type == "NONE" and not required:
            status = CredentialStatus.CREDENTIAL_NOT_REQUIRED
            configured = True
        elif env_var and os.environ.get(env_var):
            status = CredentialStatus.CREDENTIAL_CONFIGURED
            configured = True
        else:
            status = CredentialStatus.CREDENTIAL_MISSING if required else CredentialStatus.CREDENTIAL_NOT_REQUIRED
            configured = False

        return ProviderCredentialConfig(
            provider_id=provider_id,
            credential_type=credential_type,
            environment_variable=env_var,
            required=required,
            configured=configured,
            status=status
        )

    @classmethod
    def get_secret(cls, provider_id: str) -> Optional[str]:
        """Retrieves raw credential string safely without exposing it in logs."""
        spec = cls._CREDENTIAL_SPECS.get(provider_id)
        if spec and spec["env_var"]:
            return os.environ.get(spec["env_var"])
        return None
