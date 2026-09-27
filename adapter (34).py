from typing import Dict, Any
from app.states.base import StateAdapter, StateCapabilities
from app.schemas.provider import SourceType


class MizoramAdapter(StateAdapter):
    state_code = "MZ"
    state_name = "Mizoram"

    def capabilities(self) -> StateCapabilities:
        return StateCapabilities(
            state_code="MZ",
            state_name="Mizoram",
            official_portal_name="Land Revenue and Settlement Department",
            official_domain="landrevenue.mizoram.gov.in",
            primary_source_type=SourceType.OFFICIAL_PORTAL,
            supported_documents=["LSC_CERTIFICATE", "PERIODIC_PATTA"],
            supported_identifiers=["LSC_NUMBER", "PASS_NUMBER"],
            can_search_ror=True,
            can_get_mutation=False,
            can_get_cadastral=False,
            notes="Mizoram Land Settlement Certificates (LSC) and Periodic Patta."
        )

    async def _execute_search(self, request: Any) -> Dict[str, Any]:
        return {"status": "OFFICIAL_PORTAL", "state_code": "MZ", "official_source": "https://landrevenue.mizoram.gov.in"}

    async def _execute_ror(self, request: Any) -> Dict[str, Any]:
        return {"status": "SUCCESS", "state_code": "MZ", "document_type": "LSC_CERTIFICATE", "source": "Mizoram LR&S"}
