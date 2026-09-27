from typing import Dict, Any
from app.states.base import StateAdapter, StateCapabilities
from app.schemas.provider import SourceType


class MadhyaPradeshAdapter(StateAdapter):
    state_code = "MP"
    state_name = "Madhya Pradesh"

    def capabilities(self) -> StateCapabilities:
        return StateCapabilities(
            state_code="MP",
            state_name="Madhya Pradesh",
            official_portal_name="MP Bhulekh",
            official_domain="mpbhulekh.gov.in",
            primary_source_type=SourceType.OFFICIAL_PORTAL,
            supported_documents=["KHASRA", "KHATAUNI_B1"],
            supported_identifiers=["KHASRA_NUMBER", "KHATA_NUMBER"],
            can_search_ror=True,
            can_get_mutation=True,
            can_get_cadastral=True,
            notes="MP Bhulekh covers Khasra and B1 Khatauni."
        )

    async def _execute_search(self, request: Any) -> Dict[str, Any]:
        return {"status": "OFFICIAL_PORTAL", "state_code": "MP", "official_source": "https://mpbhulekh.gov.in"}

    async def _execute_ror(self, request: Any) -> Dict[str, Any]:
        return {"status": "SUCCESS", "state_code": "MP", "document_type": "KHASRA", "source": "MP Bhulekh"}
