from typing import Dict, Any
from app.states.base import StateAdapter, StateCapabilities
from app.schemas.provider import SourceType


class TripuraAdapter(StateAdapter):
    state_code = "TR"
    state_name = "Tripura"

    def capabilities(self) -> StateCapabilities:
        return StateCapabilities(
            state_code="TR",
            state_name="Tripura",
            official_portal_name="Jami Tripura",
            official_domain="jami.tripura.gov.in",
            primary_source_type=SourceType.OFFICIAL_PORTAL,
            supported_documents=["KHATIAN", "PLOT_INFO"],
            supported_identifiers=["KHATIAN_NUMBER", "PLOT_NUMBER"],
            can_search_ror=True,
            can_get_mutation=False,
            can_get_cadastral=True,
            notes="Tripura Jami land records portal."
        )

    async def _execute_search(self, request: Any) -> Dict[str, Any]:
        return {"status": "OFFICIAL_PORTAL", "state_code": "TR", "official_source": "https://jami.tripura.gov.in"}

    async def _execute_ror(self, request: Any) -> Dict[str, Any]:
        return {"status": "SUCCESS", "state_code": "TR", "document_type": "KHATIAN", "source": "Jami Tripura"}
