from typing import Dict, Any
from app.states.base import StateAdapter, StateCapabilities
from app.schemas.provider import SourceType


class BiharAdapter(StateAdapter):
    state_code = "BR"
    state_name = "Bihar"

    def capabilities(self) -> StateCapabilities:
        return StateCapabilities(
            state_code="BR",
            state_name="Bihar",
            official_portal_name="Bihar Bhumi",
            official_domain="biharbhumi.bihar.gov.in",
            primary_source_type=SourceType.OFFICIAL_PORTAL,
            supported_documents=["KHATIAN", "JAMABANDI_PANJI", "DAKHIL_KHARIJ"],
            supported_identifiers=["KHATA_NUMBER", "KHASRA_NUMBER"],
            can_search_ror=True,
            can_get_mutation=True,
            can_get_cadastral=False,
            notes="Bihar Bhumi Department of Revenue and Land Reforms."
        )

    async def _execute_search(self, request: Any) -> Dict[str, Any]:
        return {"status": "OFFICIAL_PORTAL", "state_code": "BR", "official_source": "https://biharbhumi.bihar.gov.in"}

    async def _execute_ror(self, request: Any) -> Dict[str, Any]:
        return {"status": "SUCCESS", "state_code": "BR", "document_type": "JAMABANDI_PANJI", "source": "Bihar Bhumi"}
