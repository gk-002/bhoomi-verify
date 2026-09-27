from typing import Dict, Any
from app.states.base import StateAdapter, StateCapabilities
from app.schemas.provider import SourceType


class KarnatakaAdapter(StateAdapter):
    state_code = "KA"
    state_name = "Karnataka"

    def capabilities(self) -> StateCapabilities:
        return StateCapabilities(
            state_code="KA",
            state_name="Karnataka",
            official_portal_name="Bhoomi (Revenue Department)",
            official_domain="landrecords.karnataka.gov.in",
            primary_source_type=SourceType.OFFICIAL_PORTAL,
            supported_documents=["RTC", "MUTATION_EXTRACT", "KHATA_EXTRACT", "MOJINI"],
            supported_identifiers=["SURVEY_NUMBER", "HISSA_NUMBER", "HOBLI", "VILLAGE"],
            can_search_ror=True,
            can_get_mutation=True,
            can_get_cadastral=True,
            can_get_registration=True,
            requires_captcha_or_session=False,
            notes="Karnataka Bhoomi provides RTC (Pahani / Form 16) and Bhoomi Mutation extracts."
        )

    async def _execute_search(self, request: Any) -> Dict[str, Any]:
        return {
            "status": "OFFICIAL_PORTAL",
            "state_code": "KA",
            "official_source": "https://landrecords.karnataka.gov.in",
            "query": getattr(request, "identifier", str(request)),
            "message": "Bhoomi online RTC lookup ready."
        }

    async def _execute_ror(self, request: Any) -> Dict[str, Any]:
        return {
            "status": "SUCCESS",
            "state_code": "KA",
            "document_type": "RTC",
            "source": "Bhoomi RTC"
        }
