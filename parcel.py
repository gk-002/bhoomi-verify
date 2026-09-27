from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.states.registry import StateRegistry
from app.integrations.capability_router import CapabilityRouter
from app.schemas.verification import VerificationRequest
from app.schemas.common import APIResponse

router = APIRouter(prefix="/parcel", tags=["Parcel Lookup"])


@router.post("/lookup", response_model=APIResponse[dict])
async def lookup_parcel(request: VerificationRequest, db: Session = Depends(get_db)):
    plan = CapabilityRouter.resolve_and_route(
        state=request.state,
        operation="ROR_LOOKUP",
        document_type=request.document_type,
        district=request.district,
        tehsil=request.tehsil,
        village=request.village,
        identifier=request.identifier
    )

    adapter = plan["adapter"]
    result = await adapter.search_land_record(request)

    return APIResponse(
        data={
            "state_code": plan["state_code"],
            "official_portal": plan["capabilities"].official_portal_name,
            "source_type": plan["capabilities"].primary_source_type.value,
            "result": result
        },
        message=f"Parcel search completed via {adapter.state_name} integration."
    )
