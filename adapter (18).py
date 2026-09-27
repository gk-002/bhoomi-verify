from typing import Dict, Any
from app.states.base import StateAdapter, StateCapabilities
from app.schemas.provider import SourceType


class HimachalPradeshAdapter(StateAdapter):
    state_code = "HP"
    state_name = "Himachal Pradesh"

    def capabilities(self) -> StateCapabilities:
        return StateCapabilities(
            state_code="HP",
            state_name="Himachal Pradesh",
            official_portal_name="Himbhoomi",
            official_domain="lrc.hp.nic.in",
            primary_source_type=SourceType.OFFICIAL_PORTAL,
            supported_documents=["JAMABANDI", "SHAJRA_NASB"],
            supported_identifiers=["KHASRA_NUMBER", "KHEWAT_NUMBER"],
            can_search_ror=True,
            can_get_mutation=False,
            can_get_cadastral=True,
            notes="Himachal Pradesh Land Records Information System (Himbhoomi)."
        )

    async def _execute_search(self, request: Any) -> Dict[str, Any]:
        return {"status": "OFFICIAL_PORTAL", "state_code": "HP", "official_source": "https://lrc.hp.nic.in"}

    async def _execute_ror(self, request: Any) -> Dict[str, Any]:
        return {"status": "SUCCESS", "state_code": "HP", "document_type": "JAMABANDI", "source": "Himbhoomi"}
