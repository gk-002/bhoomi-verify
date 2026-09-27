from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, ConfigDict


class UserCreate(BaseModel):
    username: str
    email: str
    password: str
    full_name: Optional[str] = None
    role: str = "CITIZEN"  # ADMIN, OFFICER, VERIFIER, CITIZEN
    designation: Optional[str] = None
    state_code: Optional[str] = None


class UserLogin(BaseModel):
    username: str
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in_minutes: int
    user_id: str
    username: str
    role: str


class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    username: str
    email: str
    full_name: Optional[str] = None
    roles: List[str]
    designation: Optional[str] = None
    state_code: Optional[str] = None
    created_at: datetime
