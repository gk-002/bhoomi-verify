from typing import Dict, Any
from app.states.base import StateAdapter, StateCapabilities
from app.schemas.provider import SourceType


class GoaAdapter(StateAdapter):
    state_code = "GA"
    state_name = "Goa"

    def capabilities(self) -> StateCapabilities:
        return StateCapabilities(
            state_code="GA",
            state_name="Goa",
            official_portal_name="Dharnakshatra (DSLR Goa)",
            official_domain="dslr.goa.gov.in",
            primary_source_type=SourceType.OFFICIAL_PORTAL,
            supported_documents=["FORM_I_XIV", "FORM_D"],
            supported_identifiers=["SURVEY_NUMBER", "SUBDIVISION"],
            can_search_ror=True,
            can_get_mutation=False,
            can_get_cadastral=True,
            notes="Directorate of Settlement and Land Records (DSLR) Goa Form I & XIV."
        )

    async def _execute_search(self, request: Any) -> Dict[str, Any]:
        return {"status": "OFFICIAL_PORTAL", "state_code": "GA", "official_source": "https://dslr.goa.gov.in"}

    async def _execute_ror(self, request: Any) -> Dict[str, Any]:
        return {"status": "SUCCESS", "state_code": "GA", "document_type": "FORM_I_XIV", "source": "DSLR Goa"}
