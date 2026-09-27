from typing import Dict, Any
from app.states.base import StateAdapter, StateCapabilities
from app.schemas.provider import SourceType


class OdishaAdapter(StateAdapter):
    state_code = "OD"
    state_name = "Odisha"

    def capabilities(self) -> StateCapabilities:
        return StateCapabilities(
            state_code="OD",
            state_name="Odisha",
            official_portal_name="Bhulekh Odisha",
            official_domain="bhulekh.ori.nic.in",
            primary_source_type=SourceType.OFFICIAL_PORTAL,
            supported_documents=["ROR", "KHATA_EXTRACT", "BHU_NAKSHA"],
            supported_identifiers=["KHATA_NUMBER", "PLOT_NUMBER", "TENANT_NAME"],
            can_search_ror=True,
            can_get_mutation=False,
            can_get_cadastral=True,
            notes="Odisha Bhulekh portal maintained by Revenue & Disaster Management Department."
        )

    async def _execute_search(self, request: Any) -> Dict[str, Any]:
        return {"status": "OFFICIAL_PORTAL", "state_code": "OD", "official_source": "https://bhulekh.ori.nic.in"}

    async def _execute_ror(self, request: Any) -> Dict[str, Any]:
        return {"status": "SUCCESS", "state_code": "OD", "document_type": "ROR", "source": "Bhulekh Odisha"}
