from datetime import timedelta
from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_password_hash, verify_password, create_access_token
from app.core.rbac import get_current_user, TokenData
from app.core.config import settings
from app.models.user import User, Role
from app.schemas.auth import UserCreate, UserLogin, Token, UserResponse
from app.schemas.common import APIResponse

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=APIResponse[UserResponse], status_code=status.HTTP_201_CREATED)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter((User.username == user_in.username) | (User.email == user_in.email)).first()
    if existing:
        raise HTTPException(status_code=400, detail="Username or email already registered.")

    role_obj = db.query(Role).filter(Role.name == user_in.role.upper()).first()
    if not role_obj:
        role_obj = Role(name=user_in.role.upper(), description=f"{user_in.role} role")
        db.add(role_obj)
        db.commit()
        db.refresh(role_obj)

    user = User(
        username=user_in.username,
        email=user_in.email,
        hashed_password=get_password_hash(user_in.password),
        full_name=user_in.full_name,
        designation=user_in.designation,
        state_code=user_in.state_code,
        roles=[role_obj]
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    resp_data = UserResponse(
        id=user.id,
        username=user.username,
        email=user.email,
        full_name=user.full_name,
        roles=[r.name for r in user.roles],
        designation=user.designation,
        state_code=user.state_code,
        created_at=user.created_at
    )
    return APIResponse(data=resp_data, message="User registered successfully.")


@router.post("/login", response_model=APIResponse[Token])
def login(login_in: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == login_in.username).first()
    if not user or not verify_password(login_in.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid username or password.")

    primary_role = user.roles[0].name if user.roles else "CITIZEN"
    access_token = create_access_token(
        subject=user.username,
        role=primary_role,
        user_id=user.id,
        expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )

    token_data = Token(
        access_token=access_token,
        token_type="bearer",
        expires_in_minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES,
        user_id=user.id,
        username=user.username,
        role=primary_role
    )
    return APIResponse(data=token_data, message="Login successful.")


@router.get("/me", response_model=APIResponse[TokenData])
def me(current_user: TokenData = Depends(get_current_user)):
    return APIResponse(data=current_user, message="Authenticated session active.")
