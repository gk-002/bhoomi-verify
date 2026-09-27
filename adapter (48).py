from typing import Dict, Any
from app.states.base import StateAdapter, StateCapabilities
from app.schemas.provider import SourceType


class TelanganaAdapter(StateAdapter):
    state_code = "TG"
    state_name = "Telangana"

    def capabilities(self) -> StateCapabilities:
        return StateCapabilities(
            state_code="TG",
            state_name="Telangana",
            official_portal_name="Dharani Integrated Land Records Management System",
            official_domain="dharani.telangana.gov.in",
            primary_source_type=SourceType.OFFICIAL_PORTAL,
            supported_documents=["PATTADAR_PASSBOOK", "ROR_1B"],
            supported_identifiers=["SURVEY_NUMBER", "PASSBOOK_NUMBER"],
            can_search_ror=True,
            can_get_mutation=True,
            can_get_cadastral=True,
            notes="Telangana Dharani portal integrates registration and mutation."
        )

    async def _execute_search(self, request: Any) -> Dict[str, Any]:
        return {"status": "OFFICIAL_PORTAL", "state_code": "TG", "official_source": "https://dharani.telangana.gov.in"}

    async def _execute_ror(self, request: Any) -> Dict[str, Any]:
        return {"status": "SUCCESS", "state_code": "TG", "document_type": "ROR_1B", "source": "Dharani"}
