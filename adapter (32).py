from typing import Dict, Any
from app.states.base import StateAdapter, StateCapabilities
from app.schemas.provider import SourceType


class MeghalayaAdapter(StateAdapter):
    state_code = "ML"
    state_name = "Meghalaya"

    def capabilities(self) -> StateCapabilities:
        return StateCapabilities(
            state_code="ML",
            state_name="Meghalaya",
            official_portal_name="Meghalaya Revenue and Disaster Management",
            official_domain="megrevenue.gov.in",
            primary_source_type=SourceType.MANUAL_VERIFICATION,
            supported_documents=["LAND_HOLDING_CERTIFICATE", "CADASTRE_SURVEY"],
            supported_identifiers=["HOLDING_NUMBER", "DISTRICT_COUNCIL_RECORD"],
            can_search_ror=False,
            can_get_mutation=False,
            can_get_cadastral=False,
            notes="Meghalaya operates predominantly under customary community tenure governed by Autonomous District Councils (ADCs). Online automated RoR is generally unavailable; requires field verification."
        )

    async def _execute_search(self, request: Any) -> Dict[str, Any]:
        return {
            "status": "MANUAL_VERIFICATION",
            "state_code": "ML",
            "requires_manual_verification": True,
            "message": "Customary land holding in Meghalaya requires physical verification via Autonomous District Council (ADC)."
        }
