from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.rbac import get_current_user, TokenData
from app.workflows.orchestrator import LandVerificationWorkflow
from app.schemas.verification import VerificationRequest, VerificationResponse
from app.schemas.common import APIResponse

router = APIRouter(prefix="/verify", tags=["Verification Orchestration"])


@router.post("", response_model=APIResponse[VerificationResponse])
async def verify_land_record(
    request: VerificationRequest,
    db: Session = Depends(get_db),
    current_user: TokenData = Depends(get_current_user)
):
    result = await LandVerificationWorkflow.execute(
        db=db,
        request=request,
        actor_id=current_user.user_id
    )
    return APIResponse(
        data=result,
        message=f"Land record verification completed with status: {result.overall_status} (Risk: {result.risk_band})."
    )
