from typing import Dict, Any
from app.states.base import StateAdapter, StateCapabilities
from app.schemas.provider import SourceType


class ManipurAdapter(StateAdapter):
    state_code = "MN"
    state_name = "Manipur"

    def capabilities(self) -> StateCapabilities:
        return StateCapabilities(
            state_code="MN",
            state_name="Manipur",
            official_portal_name="Louchapathap",
            official_domain="louchapathap.nic.in",
            primary_source_type=SourceType.OFFICIAL_PORTAL,
            supported_documents=["JAMABANDI", "DAG_CHITHA"],
            supported_identifiers=["DAG_NUMBER", "PATTA_NUMBER"],
            can_search_ror=True,
            can_get_mutation=False,
            can_get_cadastral=True,
            notes="Manipur Louchapathap land records application."
        )

    async def _execute_search(self, request: Any) -> Dict[str, Any]:
        return {"status": "OFFICIAL_PORTAL", "state_code": "MN", "official_source": "https://louchapathap.nic.in"}

    async def _execute_ror(self, request: Any) -> Dict[str, Any]:
        return {"status": "SUCCESS", "state_code": "MN", "document_type": "JAMABANDI", "source": "Louchapathap"}
