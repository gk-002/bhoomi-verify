from typing import List, Optional, Dict, Any
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field, AnyHttpUrl, field_validator


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore"
    )

    PROJECT_NAME: str = "BhoomiVerify - Land Record Digitization and Validation"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True

    # Security
    SECRET_KEY: str = "bhoomi-verify-super-secure-jwt-secret-key-change-in-production-2026"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 120
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # CORS
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:8000",
        "https://bhoomiverify.gov.in",
        "*"
    ]

    # Database Settings
    DATABASE_URL: str = "sqlite:///./bhoomi_verify.db"
    POSTGRES_SERVER: str = "localhost"
    POSTGRES_PORT: int = 5432
    POSTGRES_USER: str = "bhoomi"
    POSTGRES_PASSWORD: str = "bhoomi_secure_password"
    POSTGRES_DB: str = "bhoomidb"

    # Redis Cache (Graceful fallback to in-memory cache if not reachable)
    REDIS_URL: str = "redis://localhost:6379/0"
    CACHE_ENABLED: bool = True
    DEFAULT_CACHE_TTL_SECONDS: int = 3600

    # Demo Mode
    ENABLE_DEMO_MODE: bool = True

    # File Storage
    UPLOAD_DIR: str = "./uploads"
    MAX_UPLOAD_SIZE_BYTES: int = 25 * 1024 * 1024  # 25 MB
    ALLOWED_DOCUMENT_TYPES: List[str] = [
        "application/pdf",
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/tiff"
    ]

    # Land Record Vision / Multimodal AI API Keys
    GEMINI_API_KEY: Optional[str] = None
    LAND_RECORD_API_KEY: Optional[str] = None

    # Official State API Gateways / API Setu Environment Variables
    API_SETU_CLIENT_ID: Optional[str] = None
    API_SETU_API_KEY: Optional[str] = None
    MAHARASHTRA_API_KEY: Optional[str] = None
    KARNATAKA_API_KEY: Optional[str] = None
    GUJARAT_API_KEY: Optional[str] = None
    UTTAR_PRADESH_API_KEY: Optional[str] = None
    TAMIL_NADU_API_KEY: Optional[str] = None
    TELANGANA_API_KEY: Optional[str] = None
    ANDHRA_PRADESH_API_KEY: Optional[str] = None
    MADHYA_PRADESH_API_KEY: Optional[str] = None
    RAJASTHAN_API_KEY: Optional[str] = None
    WEST_BENGAL_API_KEY: Optional[str] = None
    BIHAR_API_KEY: Optional[str] = None
    PUNJAB_API_KEY: Optional[str] = None
    HARYANA_API_KEY: Optional[str] = None
    ODISHA_API_KEY: Optional[str] = None
    CHHATTISGARH_API_KEY: Optional[str] = None
    KERALA_API_KEY: Optional[str] = None
    JHARKHAND_API_KEY: Optional[str] = None
    ASSAM_API_KEY: Optional[str] = None
    HIMACHAL_PRADESH_API_KEY: Optional[str] = None
    UTTARAKHAND_API_KEY: Optional[str] = None
    GOA_API_KEY: Optional[str] = None
    TRIPURA_API_KEY: Optional[str] = None
    MANIPUR_API_KEY: Optional[str] = None
    MEGHALAYA_API_KEY: Optional[str] = None
    MIZORAM_API_KEY: Optional[str] = None
    NAGALAND_API_KEY: Optional[str] = None
    ARUNACHAL_PRADESH_API_KEY: Optional[str] = None
    SIKKIM_API_KEY: Optional[str] = None

    def get_database_url(self) -> str:
        """Returns PostgreSQL URL if configured, otherwise SQLite for local dev/testing."""
        if self.DATABASE_URL and len(self.DATABASE_URL.strip()) > 0:
            return self.DATABASE_URL
        return f"postgresql://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_SERVER}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"


settings = Settings()
