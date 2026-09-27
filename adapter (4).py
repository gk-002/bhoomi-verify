from typing import Dict, Any
from app.states.base import StateAdapter, StateCapabilities
from app.schemas.provider import SourceType


class ArunachalPradeshAdapter(StateAdapter):
    state_code = "AR"
    state_name = "Arunachal Pradesh"

    def capabilities(self) -> StateCapabilities:
        return StateCapabilities(
            state_code="AR",
            state_name="Arunachal Pradesh",
            official_portal_name="Department of Land Management",
            official_domain="landrecords.arunachal.gov.in",
            primary_source_type=SourceType.MANUAL_VERIFICATION,
            supported_documents=["LPC", "LAND_POSSESSION_CERTIFICATE"],
            supported_identifiers=["LPC_NUMBER", "APPLICANT_NAME"],
            can_search_ror=False,
            can_get_mutation=False,
            can_get_cadastral=False,
            notes="Land in Arunachal Pradesh is customary community/clan owned with Land Possession Certificates (LPC) issued by Deputy Commissioners. Requires manual verification."
        )

    async def _execute_search(self, request: Any) -> Dict[str, Any]:
        return {
            "status": "MANUAL_VERIFICATION",
            "state_code": "AR",
            "requires_manual_verification": True,
            "message": "Arunachal LPC requires physical district administration verification."
        }
