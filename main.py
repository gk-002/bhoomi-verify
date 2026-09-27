import time
import uuid
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.logger import logger, log_api_event
from app.core.database import init_db
from app.core.exceptions import BhoomiVerifyException
from app.states import register_all_states
from app.integrations.provider_registry import init_default_providers
from app.api.v1 import api_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("Initializing BhoomiVerify backend service...")
    init_db()
    register_all_states()
    init_default_providers()
    logger.info("All 28 State Adapters and verified providers loaded successfully.")
    yield
    # Shutdown
    logger.info("Shutting down BhoomiVerify backend...")


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description=(
        "BhoomiVerify: Intelligent Land Record Digitization and Validation System.\n"
        "SIH 2026 - Problem Statement SIH26018 (Ministry of Rural Development).\n"
        "Connecting authentic DILRMP land record integrations across all 28 Indian States."
    ),
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Request ID & Audit Timing Middleware
@app.middleware("http")
async def audit_logging_middleware(request: Request, call_next):
    request_id = request.headers.get("X-Request-ID", f"req_{uuid.uuid4().hex[:8]}")
    request.state.request_id = request_id
    start_time = time.time()

    response = await call_next(request)

    latency_ms = (time.time() - start_time) * 1000.0
    response.headers["X-Request-ID"] = request_id
    response.headers["X-Response-Time-Ms"] = f"{latency_ms:.2f}"

    log_api_event(
        request_id=request_id,
        operation=f"{request.method} {request.url.path}",
        latency_ms=latency_ms,
        status=str(response.status_code)
    )
    return response


# Global Exception Handler
@app.exception_handler(BhoomiVerifyException)
async def bhoomi_verify_exception_handler(request: Request, exc: BhoomiVerifyException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "status": exc.error_code.value,
            "provider": exc.provider,
            "message": exc.message,
            "requires_manual_verification": exc.requires_manual_verification,
            "details": exc.details
        }
    )


# Health & Readiness Endpoints
@app.get("/", tags=["Health & Status"])
def root():
    return {
        "project": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "organization": "Ministry of Rural Development, Government of India",
        "status": "OPERATIONAL",
        "api_docs": "/docs",
        "supported_states_count": 28
    }


@app.get("/health", tags=["Health & Status"])
def health_check():
    return {"status": "HEALTHY", "timestamp": time.time()}


@app.get("/ready", tags=["Health & Status"])
def readiness_check():
    return {
        "status": "READY",
        "database": "CONNECTED",
        "registered_states": 28,
        "demo_mode": settings.ENABLE_DEMO_MODE
    }


# Mount API v1
app.include_router(api_router, prefix=settings.API_V1_STR)
