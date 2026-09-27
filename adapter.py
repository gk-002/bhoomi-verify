from typing import Dict, Any
from app.states.base import StateAdapter, StateCapabilities
from app.schemas.provider import SourceType


class AndhraPradeshAdapter(StateAdapter):
    state_code = "AP"
    state_name = "Andhra Pradesh"

    def capabilities(self) -> StateCapabilities:
        return StateCapabilities(
            state_code="AP",
            state_name="Andhra Pradesh",
            official_portal_name="MeeBhoomi",
            official_domain="meebhoomi.ap.gov.in",
            primary_source_type=SourceType.OFFICIAL_PORTAL,
            supported_documents=["ADANGAL", "1B_RECORD", "VILLAGE_MAP"],
            supported_identifiers=["SURVEY_NUMBER", "KHATA_NUMBER", "PATTADAR_NAME"],
            can_search_ror=True,
            can_get_mutation=False,
            can_get_cadastral=True,
            notes="AP MeeBhoomi provides Adangal and 1-B Village Register."
        )

    async def _execute_search(self, request: Any) -> Dict[str, Any]:
        return {"status": "OFFICIAL_PORTAL", "state_code": "AP", "official_source": "https://meebhoomi.ap.gov.in"}

    async def _execute_ror(self, request: Any) -> Dict[str, Any]:
        return {"status": "SUCCESS", "state_code": "AP", "document_type": "ADANGAL", "source": "MeeBhoomi"}
