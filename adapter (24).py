from typing import Dict, Any
from app.states.base import StateAdapter, StateCapabilities
from app.schemas.provider import SourceType


class KeralaAdapter(StateAdapter):
    state_code = "KL"
    state_name = "Kerala"

    def capabilities(self) -> StateCapabilities:
        return StateCapabilities(
            state_code="KL",
            state_name="Kerala",
            official_portal_name="E-Rekha",
            official_domain="erekha.kerala.gov.in",
            primary_source_type=SourceType.OFFICIAL_PORTAL,
            supported_documents=["SETTLEMENT_REGISTER", "FMB_SKETCH", "RESURVEY_MAP"],
            supported_identifiers=["SURVEY_NUMBER", "RE_SURVEY_NUMBER", "BLOCK_NUMBER"],
            can_search_ror=True,
            can_get_mutation=False,
            can_get_cadastral=True,
            notes="Kerala E-Rekha web portal for survey and land records."
        )

    async def _execute_search(self, request: Any) -> Dict[str, Any]:
        return {"status": "OFFICIAL_PORTAL", "state_code": "KL", "official_source": "https://erekha.kerala.gov.in"}

    async def _execute_ror(self, request: Any) -> Dict[str, Any]:
        return {"status": "SUCCESS", "state_code": "KL", "document_type": "SETTLEMENT_REGISTER", "source": "E-Rekha"}
