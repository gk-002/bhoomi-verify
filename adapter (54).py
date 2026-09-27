from typing import Dict, Any
from app.states.base import StateAdapter, StateCapabilities
from app.schemas.provider import SourceType


class UttarPradeshAdapter(StateAdapter):
    state_code = "UP"
    state_name = "Uttar Pradesh"

    def capabilities(self) -> StateCapabilities:
        return StateCapabilities(
            state_code="UP",
            state_name="Uttar Pradesh",
            official_portal_name="UP Bhulekh",
            official_domain="upbhulekh.gov.in",
            primary_source_type=SourceType.OFFICIAL_PORTAL,
            supported_documents=["KHATAUNI", "KHASRA", "16_DIGIT_UNIQUE_CODE"],
            supported_identifiers=["KHASRA_NUMBER", "GATA_NUMBER", "UNIQUE_CODE", "KHATA_NUMBER"],
            can_search_ror=True,
            can_get_mutation=True,
            can_get_cadastral=True,
            can_get_registration=True,
            requires_captcha_or_session=True,
            notes="UP Bhulekh supports 16-digit unique land parcel code and Khatauni RoR."
        )

    async def _execute_search(self, request: Any) -> Dict[str, Any]:
        return {
            "status": "OFFICIAL_PORTAL",
            "state_code": "UP",
            "official_source": "https://upbhulekh.gov.in",
            "message": "UP Bhulekh search ready."
        }

    async def _execute_ror(self, request: Any) -> Dict[str, Any]:
        return {"status": "SUCCESS", "state_code": "UP", "document_type": "KHATAUNI", "source": "UP Bhulekh"}
