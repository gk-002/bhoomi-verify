from enum import Enum
from typing import List
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from app.core.security import decode_token
from app.core.exceptions import ErrorCode, BhoomiVerifyException

from pydantic import BaseModel

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login", auto_error=False)


class UserRole(str, Enum):
    ADMIN = "ADMIN"
    OFFICER = "OFFICER"
    VERIFIER = "VERIFIER"
    CITIZEN = "CITIZEN"


class TokenData(BaseModel):
    username: str
    user_id: str
    role: str


async def get_current_user(token: str = Depends(oauth2_scheme)) -> TokenData:
    if not token:
        # In demo mode, if unauthenticated, provide an anonymous verifier identity for quick evaluation
        from app.core.config import settings
        if settings.ENABLE_DEMO_MODE:
            return TokenData(username="demo_verifier", user_id="usr_demo_001", role=UserRole.VERIFIER.value)
        raise BhoomiVerifyException(
            error_code=ErrorCode.UNAUTHORIZED,
            message="Not authenticated. Bearer token missing.",
            status_code=status.HTTP_401_UNAUTHORIZED
        )
    
    payload = decode_token(token)
    if not payload:
        raise BhoomiVerifyException(
            error_code=ErrorCode.UNAUTHORIZED,
            message="Invalid or expired authentication token.",
            status_code=status.HTTP_401_UNAUTHORIZED
        )
    
    username: str = payload.get("sub")
    user_id: str = payload.get("user_id")
    role: str = payload.get("role")
    if not username or not user_id or not role:
        raise BhoomiVerifyException(
            error_code=ErrorCode.UNAUTHORIZED,
            message="Malformed authentication token payload.",
            status_code=status.HTTP_401_UNAUTHORIZED
        )
        
    return TokenData(username=username, user_id=user_id, role=role)


class RequireRoles:
    def __init__(self, allowed_roles: List[UserRole]):
        self.allowed_roles = [r.value if isinstance(r, UserRole) else r for r in allowed_roles]

    def __call__(self, current_user: TokenData = Depends(get_current_user)) -> TokenData:
        if current_user.role not in self.allowed_roles:
            raise BhoomiVerifyException(
                error_code=ErrorCode.FORBIDDEN,
                message=f"Access denied. Requires one of roles: {', '.join(self.allowed_roles)}.",
                status_code=status.HTTP_403_FORBIDDEN
            )
        return current_user
