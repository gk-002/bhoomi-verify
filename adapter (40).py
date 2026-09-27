from typing import Dict, Any
from app.states.base import StateAdapter, StateCapabilities
from app.schemas.provider import SourceType


class PunjabAdapter(StateAdapter):
    state_code = "PB"
    state_name = "Punjab"

    def capabilities(self) -> StateCapabilities:
        return StateCapabilities(
            state_code="PB",
            state_name="Punjab",
            official_portal_name="PLRS Jamabandi",
            official_domain="jamabandi.punjab.gov.in",
            primary_source_type=SourceType.OFFICIAL_PORTAL,
            supported_documents=["JAMABANDI", "INTKAL", "ROZNAMCHA"],
            supported_identifiers=["KHASRA_NUMBER", "KHEWAT_NUMBER", "KHATONI_NUMBER"],
            can_search_ror=True,
            can_get_mutation=True,
            can_get_cadastral=True,
            notes="Punjab Land Records Society (PLRS) Nakal Jamabandi."
        )

    async def _execute_search(self, request: Any) -> Dict[str, Any]:
        return {"status": "OFFICIAL_PORTAL", "state_code": "PB", "official_source": "https://jamabandi.punjab.gov.in"}

    async def _execute_ror(self, request: Any) -> Dict[str, Any]:
        return {"status": "SUCCESS", "state_code": "PB", "document_type": "JAMABANDI", "source": "PLRS Jamabandi"}
