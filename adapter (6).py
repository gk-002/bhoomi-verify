from typing import Dict, Any
from app.states.base import StateAdapter, StateCapabilities
from app.schemas.provider import SourceType


class AssamAdapter(StateAdapter):
    state_code = "AS"
    state_name = "Assam"

    def capabilities(self) -> StateCapabilities:
        return StateCapabilities(
            state_code="AS",
            state_name="Assam",
            official_portal_name="Dharitree (ILRMS)",
            official_domain="revenueassam.nic.in",
            primary_source_type=SourceType.OFFICIAL_PORTAL,
            supported_documents=["JAMABANDI", "CHITHA"],
            supported_identifiers=["DAG_NUMBER", "PATTA_NUMBER"],
            can_search_ror=True,
            can_get_mutation=True,
            can_get_cadastral=True,
            notes="Assam Integrated Land Records Management System (ILRMS)."
        )

    async def _execute_search(self, request: Any) -> Dict[str, Any]:
        return {"status": "OFFICIAL_PORTAL", "state_code": "AS", "official_source": "https://revenueassam.nic.in"}

    async def _execute_ror(self, request: Any) -> Dict[str, Any]:
        return {"status": "SUCCESS", "state_code": "AS", "document_type": "JAMABANDI", "source": "Dharitree"}
