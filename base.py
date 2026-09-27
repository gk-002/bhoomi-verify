from abc import ABC, abstractmethod
from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field
from app.schemas.provider import SourceType
from app.schemas.canonical import CanonicalLandRecord
from app.core.exceptions import BhoomiVerifyException, ErrorCode


class StateCapabilities(BaseModel):
    state_code: str
    state_name: str
    official_portal_name: str
    official_domain: str
    primary_source_type: SourceType
    supported_documents: List[str]
    supported_identifiers: List[str]
    can_search_ror: bool = True
    can_get_mutation: bool = False
    can_get_cadastral: bool = False
    can_get_registration: bool = False
    requires_captcha_or_session: bool = False
    notes: Optional[str] = None


class StateAdapter(ABC):
    """Abstract Base Class for all 28 State Land Record Integrations."""

    state_code: str
    state_name: str

    @abstractmethod
    def capabilities(self) -> StateCapabilities:
        """Returns the specific real capabilities and verified data sources for this state."""
        pass

    async def search_land_record(self, request: Any) -> Dict[str, Any]:
        """Searches for land record metadata using state-specific identifiers."""
        cap = self.capabilities()
        if not cap.can_search_ror:
            return {
                "status": "NOT_SUPPORTED",
                "state": self.state_code,
                "message": f"Online automated search not available for {self.state_name}.",
                "requires_manual_verification": True
            }
        return await self._execute_search(request)

    async def get_record_of_rights(self, request: Any) -> Dict[str, Any]:
        """Retrieves official Record of Rights (7/12, RTC, Khasra-Khatauni, Jamabandi, etc.)."""
        return await self._execute_ror(request)

    async def get_mutation(self, request: Any) -> Dict[str, Any]:
        """Retrieves mutation / ferfar / intkal history for the parcel."""
        cap = self.capabilities()
        if not cap.can_get_mutation:
            return {
                "status": "NOT_SUPPORTED",
                "state": self.state_code,
                "message": f"Mutation history API/service not available for {self.state_name}.",
                "requires_manual_verification": True
            }
        return await self._execute_mutation(request)

    async def get_cadastral_data(self, request: Any) -> Dict[str, Any]:
        """Retrieves cadastral / Bhu-Naksha spatial parcel geometry."""
        cap = self.capabilities()
        if not cap.can_get_cadastral:
            return {
                "status": "NOT_SUPPORTED",
                "state": self.state_code,
                "message": f"Cadastral spatial data service not available for {self.state_name}.",
                "requires_manual_verification": True
            }
        return await self._execute_cadastral(request)

    async def get_registration_data(self, request: Any) -> Dict[str, Any]:
        """Cross-references Sub-Registrar Office (SRO) deed registration data."""
        cap = self.capabilities()
        if not cap.can_get_registration:
            return {
                "status": "NOT_SUPPORTED",
                "state": self.state_code,
                "message": f"Registration deed lookup service not available for {self.state_name}.",
                "requires_manual_verification": True
            }
        return await self._execute_registration(request)

    async def verify_record(self, request: Any) -> Dict[str, Any]:
        """Performs state-specific end-to-end verification."""
        return await self._execute_verify(request)

    # Internal execution hooks implemented by concrete adapters
    async def _execute_search(self, request: Any) -> Dict[str, Any]:
        return {"status": "NOT_SUPPORTED", "state": self.state_code}

    async def _execute_ror(self, request: Any) -> Dict[str, Any]:
        return {"status": "NOT_SUPPORTED", "state": self.state_code}

    async def _execute_mutation(self, request: Any) -> Dict[str, Any]:
        return {"status": "NOT_SUPPORTED", "state": self.state_code}

    async def _execute_cadastral(self, request: Any) -> Dict[str, Any]:
        return {"status": "NOT_SUPPORTED", "state": self.state_code}

    async def _execute_registration(self, request: Any) -> Dict[str, Any]:
        return {"status": "NOT_SUPPORTED", "state": self.state_code}

    async def _execute_verify(self, request: Any) -> Dict[str, Any]:
        return {"status": "NOT_SUPPORTED", "state": self.state_code}
