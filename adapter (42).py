from typing import Dict, Any
from app.states.base import StateAdapter, StateCapabilities
from app.schemas.provider import SourceType


class RajasthanAdapter(StateAdapter):
    state_code = "RJ"
    state_name = "Rajasthan"

    def capabilities(self) -> StateCapabilities:
        return StateCapabilities(
            state_code="RJ",
            state_name="Rajasthan",
            official_portal_name="Apna Khata (E-Dharti)",
            official_domain="apnakhata.rajasthan.gov.in",
            primary_source_type=SourceType.OFFICIAL_PORTAL,
            supported_documents=["JAMABANDI_NAKAL", "KHASRA_GIRDAWARI"],
            supported_identifiers=["KHASRA_NUMBER", "KHATA_NUMBER", "NAME"],
            can_search_ror=True,
            can_get_mutation=True,
            can_get_cadastral=True,
            notes="Apna Khata E-Dharti portal."
        )

    async def _execute_search(self, request: Any) -> Dict[str, Any]:
        return {"status": "OFFICIAL_PORTAL", "state_code": "RJ", "official_source": "https://apnakhata.rajasthan.gov.in"}

    async def _execute_ror(self, request: Any) -> Dict[str, Any]:
        return {"status": "SUCCESS", "state_code": "RJ", "document_type": "JAMABANDI_NAKAL", "source": "Apna Khata"}
