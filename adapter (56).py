from typing import Dict, Any
from app.states.base import StateAdapter, StateCapabilities
from app.schemas.provider import SourceType


class WestBengalAdapter(StateAdapter):
    state_code = "WB"
    state_name = "West Bengal"

    def capabilities(self) -> StateCapabilities:
        return StateCapabilities(
            state_code="WB",
            state_name="West Bengal",
            official_portal_name="Banglarbhumi",
            official_domain="banglarbhumi.gov.in",
            primary_source_type=SourceType.OFFICIAL_PORTAL,
            supported_documents=["KHATIAN", "PLOT_INFO", "MOUZA_MAP"],
            supported_identifiers=["KHATIAN_NUMBER", "PLOT_NUMBER"],
            can_search_ror=True,
            can_get_mutation=True,
            can_get_cadastral=True,
            notes="West Bengal Banglarbhumi land & land reforms portal."
        )

    async def _execute_search(self, request: Any) -> Dict[str, Any]:
        return {"status": "OFFICIAL_PORTAL", "state_code": "WB", "official_source": "https://banglarbhumi.gov.in"}

    async def _execute_ror(self, request: Any) -> Dict[str, Any]:
        return {"status": "SUCCESS", "state_code": "WB", "document_type": "KHATIAN", "source": "Banglarbhumi"}
