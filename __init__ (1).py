from fastapi import APIRouter
from app.api.v1.auth import router as auth_router
from app.api.v1.documents import router as documents_router
from app.api.v1.parcel import router as parcel_router
from app.api.v1.verify import router as verify_router
from app.api.v1.cases import router as cases_router
from app.api.v1.gis import router as gis_router
from app.api.v1.review import router as review_router
from app.api.v1.ledger import router as ledger_router
from app.api.v1.providers import router as providers_router
from app.api.v1.dashboard import router as dashboard_router
from app.api.v1.citizen import router as citizen_router
from app.api.v1.jobs import router as jobs_router
from app.api.v1.demo import router as demo_router

api_router = APIRouter()

api_router.include_router(auth_router)
api_router.include_router(documents_router)
api_router.include_router(parcel_router)
api_router.include_router(verify_router)
api_router.include_router(cases_router)
api_router.include_router(gis_router)
api_router.include_router(review_router)
api_router.include_router(ledger_router)
api_router.include_router(providers_router)
api_router.include_router(dashboard_router)
api_router.include_router(citizen_router)
api_router.include_router(jobs_router)
api_router.include_router(demo_router)

__all__ = ["api_router"]
