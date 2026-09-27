from typing import Dict, Any
from app.states.base import StateAdapter, StateCapabilities
from app.schemas.provider import SourceType


class NagalandAdapter(StateAdapter):
    state_code = "NL"
    state_name = "Nagaland"

    def capabilities(self) -> StateCapabilities:
        return StateCapabilities(
            state_code="NL",
            state_name="Nagaland",
            official_portal_name="Directorate of Land Records & Survey",
            official_domain="landrecords.nagaland.gov.in",
            primary_source_type=SourceType.MANUAL_VERIFICATION,
            supported_documents=["CADASTRAL_SURVEY_RECORD", "VILLAGE_COUNCIL_CERTIFICATE"],
            supported_identifiers=["PLOT_NUMBER", "PATTA_NUMBER"],
            can_search_ror=False,
            can_get_mutation=False,
            can_get_cadastral=False,
            notes="Under Article 371A of the Constitution of India, land and resources in Nagaland belong to the local community and individuals. No central online RoR database exists; requires physical village council verification."
        )

    async def _execute_search(self, request: Any) -> Dict[str, Any]:
        return {
            "status": "MANUAL_VERIFICATION",
            "state_code": "NL",
            "requires_manual_verification": True,
            "message": "Customary land holding under Article 371A requires village council verification."
        }
