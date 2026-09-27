from typing import Dict, Any
from app.states.base import StateAdapter, StateCapabilities
from app.schemas.provider import SourceType


class SikkimAdapter(StateAdapter):
    state_code = "SK"
    state_name = "Sikkim"

    def capabilities(self) -> StateCapabilities:
        return StateCapabilities(
            state_code="SK",
            state_name="Sikkim",
            official_portal_name="Land Revenue & Disaster Management Department",
            official_domain="sikkim.gov.in",
            primary_source_type=SourceType.OFFICIAL_PORTAL,
            supported_documents=["PARCHA", "KHATIYAN"],
            supported_identifiers=["PLOT_NUMBER", "KHATA_NUMBER"],
            can_search_ror=True,
            can_get_mutation=False,
            can_get_cadastral=True,
            notes="Sikkim Land Revenue portal records Parcha / Khatiyan."
        )

    async def _execute_search(self, request: Any) -> Dict[str, Any]:
        return {"status": "OFFICIAL_PORTAL", "state_code": "SK", "official_source": "https://sikkim.gov.in"}

    async def _execute_ror(self, request: Any) -> Dict[str, Any]:
        return {"status": "SUCCESS", "state_code": "SK", "document_type": "PARCHA", "source": "Sikkim LR&DM"}
