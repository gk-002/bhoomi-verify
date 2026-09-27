from typing import Dict, Any
from app.states.base import StateAdapter, StateCapabilities
from app.schemas.provider import SourceType


class ChhattisgarhAdapter(StateAdapter):
    state_code = "CG"
    state_name = "Chhattisgarh"

    def capabilities(self) -> StateCapabilities:
        return StateCapabilities(
            state_code="CG",
            state_name="Chhattisgarh",
            official_portal_name="Bhuiyan",
            official_domain="bhuiyan.cg.nic.in",
            primary_source_type=SourceType.OFFICIAL_PORTAL,
            supported_documents=["KHASRA_B1", "PII_RECORD"],
            supported_identifiers=["KHASRA_NUMBER"],
            can_search_ror=True,
            can_get_mutation=True,
            can_get_cadastral=True,
            notes="Chhattisgarh Bhuiyan land records portal."
        )

    async def _execute_search(self, request: Any) -> Dict[str, Any]:
        return {"status": "OFFICIAL_PORTAL", "state_code": "CG", "official_source": "https://bhuiyan.cg.nic.in"}

    async def _execute_ror(self, request: Any) -> Dict[str, Any]:
        return {"status": "SUCCESS", "state_code": "CG", "document_type": "KHASRA_B1", "source": "Bhuiyan"}
