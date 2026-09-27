from typing import Dict, Any
from app.states.base import StateAdapter, StateCapabilities
from app.schemas.provider import SourceType


class UttarakhandAdapter(StateAdapter):
    state_code = "UK"
    state_name = "Uttarakhand"

    def capabilities(self) -> StateCapabilities:
        return StateCapabilities(
            state_code="UK",
            state_name="Uttarakhand",
            official_portal_name="Devbhoomi (UK Bhulekh)",
            official_domain="bhulekh.uk.gov.in",
            primary_source_type=SourceType.OFFICIAL_PORTAL,
            supported_documents=["KHATAUNI", "ROR"],
            supported_identifiers=["KHASRA_NUMBER", "KHATA_NUMBER"],
            can_search_ror=True,
            can_get_mutation=False,
            can_get_cadastral=True,
            notes="Uttarakhand Devbhoomi portal."
        )

    async def _execute_search(self, request: Any) -> Dict[str, Any]:
        return {"status": "OFFICIAL_PORTAL", "state_code": "UK", "official_source": "https://bhulekh.uk.gov.in"}

    async def _execute_ror(self, request: Any) -> Dict[str, Any]:
        return {"status": "SUCCESS", "state_code": "UK", "document_type": "KHATAUNI", "source": "Devbhoomi"}
