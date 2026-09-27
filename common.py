from typing import Generic, TypeVar, Optional, Any, Dict, List
from pydantic import BaseModel, Field

DataT = TypeVar("DataT")


class APIResponse(BaseModel, Generic[DataT]):
    success: bool = True
    message: str = "Operation completed successfully"
    data: Optional[DataT] = None
    errors: Optional[List[Dict[str, Any]]] = None


class ErrorResponseDetail(BaseModel):
    status: str
    provider: Optional[str] = None
    message: str
    requires_manual_verification: bool = False
    details: Dict[str, Any] = Field(default_factory=dict)
