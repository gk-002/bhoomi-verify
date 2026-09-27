from typing import Dict, Any
from app.states.base import StateAdapter, StateCapabilities
from app.schemas.provider import SourceType


class HaryanaAdapter(StateAdapter):
    state_code = "HR"
    state_name = "Haryana"

    def capabilities(self) -> StateCapabilities:
        return StateCapabilities(
            state_code="HR",
            state_name="Haryana",
            official_portal_name="Jamabandi Haryana (HALRIS)",
            official_domain="jamabandi.nic.in",
            primary_source_type=SourceType.OFFICIAL_PORTAL,
            supported_documents=["NAKAL_JAMABANDI", "KHASRA_GIRDAWARI", "INTEQAL"],
            supported_identifiers=["KHASRA_NUMBER", "KHEWAT_NUMBER", "OWNER_NAME"],
            can_search_ror=True,
            can_get_mutation=True,
            can_get_cadastral=True,
            notes="Haryana Land Records Information System (HALRIS)."
        )

    async def _execute_search(self, request: Any) -> Dict[str, Any]:
        return {"status": "OFFICIAL_PORTAL", "state_code": "HR", "official_source": "https://jamabandi.nic.in"}

    async def _execute_ror(self, request: Any) -> Dict[str, Any]:
        return {"status": "SUCCESS", "state_code": "HR", "document_type": "NAKAL_JAMABANDI", "source": "HALRIS"}
