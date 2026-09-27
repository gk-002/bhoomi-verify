from typing import Optional, Dict, Any
from enum import Enum
from fastapi import HTTPException, status


class ErrorCode(str, Enum):
    INVALID_REQUEST = "INVALID_REQUEST"
    DOCUMENT_INVALID = "DOCUMENT_INVALID"
    OCR_FAILED = "OCR_FAILED"
    STATE_NOT_SUPPORTED = "STATE_NOT_SUPPORTED"
    PROVIDER_NOT_CONFIGURED = "PROVIDER_NOT_CONFIGURED"
    CREDENTIAL_MISSING = "CREDENTIAL_MISSING"
    SOURCE_UNAVAILABLE = "SOURCE_UNAVAILABLE"
    RATE_LIMITED = "RATE_LIMITED"
    TIMEOUT = "TIMEOUT"
    NOT_FOUND = "NOT_FOUND"
    NOT_SUPPORTED = "NOT_SUPPORTED"
    REQUIRES_REVIEW = "REQUIRES_REVIEW"
    INTERNAL_ERROR = "INTERNAL_ERROR"
    UNAUTHORIZED = "UNAUTHORIZED"
    FORBIDDEN = "FORBIDDEN"


class BhoomiVerifyException(HTTPException):
    def __init__(
        self,
        error_code: ErrorCode,
        message: str,
        status_code: int = status.HTTP_400_BAD_REQUEST,
        provider: Optional[str] = None,
        requires_manual_verification: bool = False,
        details: Optional[Dict[str, Any]] = None,
    ):
        self.error_code = error_code
        self.message = message
        self.provider = provider
        self.requires_manual_verification = requires_manual_verification
        self.details = details or {}
        
        super().__init__(
            status_code=status_code,
            detail={
                "status": error_code.value,
                "provider": provider,
                "message": message,
                "requires_manual_verification": requires_manual_verification,
                "details": self.details,
            }
        )


class SourceUnavailableException(BhoomiVerifyException):
    def __init__(self, provider: str, message: str = "Official government source could not be reached."):
        super().__init__(
            error_code=ErrorCode.SOURCE_UNAVAILABLE,
            message=message,
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            provider=provider,
            requires_manual_verification=True
        )


class NotSupportedException(BhoomiVerifyException):
    def __init__(self, message: str, provider: Optional[str] = None):
        super().__init__(
            error_code=ErrorCode.NOT_SUPPORTED,
            message=message,
            status_code=status.HTTP_501_NOT_IMPLEMENTED,
            provider=provider,
            requires_manual_verification=True
        )


class StateNotSupportedException(BhoomiVerifyException):
    def __init__(self, state_identifier: str):
        super().__init__(
            error_code=ErrorCode.STATE_NOT_SUPPORTED,
            message=f"State identifier '{state_identifier}' is not recognized in official DILRMP directory.",
            status_code=status.HTTP_404_NOT_FOUND,
            requires_manual_verification=True
        )
