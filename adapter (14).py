from typing import Dict, Any
from app.states.base import StateAdapter, StateCapabilities
from app.schemas.provider import SourceType


class GujaratAdapter(StateAdapter):
    state_code = "GJ"
    state_name = "Gujarat"

    def capabilities(self) -> StateCapabilities:
        return StateCapabilities(
            state_code="GJ",
            state_name="Gujarat",
            official_portal_name="AnyROR (Revenue Department)",
            official_domain="anyror.gujarat.gov.in",
            primary_source_type=SourceType.OFFICIAL_PORTAL,
            supported_documents=["VF_7", "VF_8A", "VF_6_MUTATION"],
            supported_identifiers=["SURVEY_NUMBER", "KHATA_NUMBER"],
            can_search_ror=True,
            can_get_mutation=True,
            can_get_cadastral=True,
            can_get_registration=False,
            requires_captcha_or_session=True,
            notes="AnyROR provides Village Form 7, 8A, and 6 (Notice of Mutation)."
        )

    async def _execute_search(self, request: Any) -> Dict[str, Any]:
        return {
            "status": "OFFICIAL_PORTAL",
            "state_code": "GJ",
            "official_source": "https://anyror.gujarat.gov.in",
            "message": "AnyROR lookup ready."
        }

    async def _execute_ror(self, request: Any) -> Dict[str, Any]:
        return {
            "status": "SUCCESS",
            "state_code": "GJ",
            "document_type": "VF_7",
            "source": "AnyROR"
        }
