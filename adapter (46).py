from typing import Dict, Any
from app.states.base import StateAdapter, StateCapabilities
from app.schemas.provider import SourceType


class TamilNaduAdapter(StateAdapter):
    state_code = "TN"
    state_name = "Tamil Nadu"

    def capabilities(self) -> StateCapabilities:
        return StateCapabilities(
            state_code="TN",
            state_name="Tamil Nadu",
            official_portal_name="Anytime Anywhere e-Services (Patta Chitta)",
            official_domain="eservices.tn.gov.in",
            primary_source_type=SourceType.OFFICIAL_PORTAL,
            supported_documents=["PATTA", "CHITTA", "FMB_SKETCH", "TSLR_EXTRACT"],
            supported_identifiers=["SURVEY_NUMBER", "SUBDIVISION_NUMBER", "PATTA_NUMBER"],
            can_search_ror=True,
            can_get_mutation=False,
            can_get_cadastral=True,
            notes="Tamil Nadu e-Services for Patta/Chitta and Field Measurement Book (FMB)."
        )

    async def _execute_search(self, request: Any) -> Dict[str, Any]:
        return {"status": "OFFICIAL_PORTAL", "state_code": "TN", "official_source": "https://eservices.tn.gov.in"}

    async def _execute_ror(self, request: Any) -> Dict[str, Any]:
        return {"status": "SUCCESS", "state_code": "TN", "document_type": "PATTA_CHITTA", "source": "TN e-Services"}
