from typing import Dict, Optional, List
from app.states.base import StateAdapter
from app.core.exceptions import StateNotSupportedException


class StateRegistry:
    """Central registry for all 28 official Indian State Land Record Adapters."""
    _adapters: Dict[str, StateAdapter] = {}
    _name_to_code: Dict[str, str] = {}

    @classmethod
    def register(cls, adapter: StateAdapter):
        """Registers a state adapter instance by its ISO / standard code."""
        code = adapter.state_code.upper()
        cls._adapters[code] = adapter
        
        # Register full name and normalized variations
        clean_name = adapter.state_name.strip().lower()
        cls._name_to_code[clean_name] = code
        cls._name_to_code[code.lower()] = code

    @classmethod
    def get(cls, state_identifier: str) -> StateAdapter:
        """Retrieves an adapter dynamically. Raises StateNotSupportedException if unknown."""
        resolved_code = cls.resolve_code(state_identifier)
        if not resolved_code or resolved_code not in cls._adapters:
            raise StateNotSupportedException(state_identifier)
        return cls._adapters[resolved_code]

    @classmethod
    def resolve_code(cls, identifier: str) -> Optional[str]:
        """Resolves state name or code (e.g. 'Maharashtra', 'MH', 'maharashtra') to 'MH'."""
        if not identifier:
            return None
        clean = identifier.strip().lower().replace("_", " ").replace("-", " ")
        if clean.upper() in cls._adapters:
            return clean.upper()
        return cls._name_to_code.get(clean)

    @classmethod
    def list_all(cls) -> List[StateAdapter]:
        """Returns all registered state adapters."""
        return list(cls._adapters.values())

    @classmethod
    def count(cls) -> int:
        """Total registered states."""
        return len(cls._adapters)
