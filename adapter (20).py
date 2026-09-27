from typing import Dict, Any
from app.states.base import StateAdapter, StateCapabilities
from app.schemas.provider import SourceType


class JharkhandAdapter(StateAdapter):
    state_code = "JH"
    state_name = "Jharkhand"

    def capabilities(self) -> StateCapabilities:
        return StateCapabilities(
            state_code="JH",
            state_name="Jharkhand",
            official_portal_name="Jharbhoomi",
            official_domain="jharbhoomi.jharkhand.gov.in",
            primary_source_type=SourceType.OFFICIAL_PORTAL,
            supported_documents=["KHATIAN", "REGISTER_II"],
            supported_identifiers=["KHATA_NUMBER", "PLOT_NUMBER"],
            can_search_ror=True,
            can_get_mutation=True,
            can_get_cadastral=True,
            notes="Jharkhand Jharbhoomi portal."
        )

    async def _execute_search(self, request: Any) -> Dict[str, Any]:
        return {"status": "OFFICIAL_PORTAL", "state_code": "JH", "official_source": "https://jharbhoomi.jharkhand.gov.in"}

    async def _execute_ror(self, request: Any) -> Dict[str, Any]:
        return {"status": "SUCCESS", "state_code": "JH", "document_type": "KHATIAN", "source": "Jharbhoomi"}
