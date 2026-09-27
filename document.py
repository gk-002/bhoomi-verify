import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, Float, DateTime, ForeignKey, Text, JSON, Boolean
from sqlalchemy.orm import relationship
from app.core.database import Base


class Document(Base):
    __tablename__ = "documents"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    case_id = Column(String(36), ForeignKey("cases.id", ondelete="SET NULL"), nullable=True, index=True)
    filename = Column(String(255), nullable=False)
    file_path = Column(String(512), nullable=False)
    file_size = Column(Integer, nullable=False)
    mime_type = Column(String(100), nullable=False)
    sha256_hash = Column(String(64), unique=True, nullable=False, index=True)
    document_type = Column(String(50), nullable=True)  # 7_12, 8A, KHASRA, KHATAUNI, JAMABANDI, RTC, SALE_DEED, etc.
    detected_language = Column(String(20), default="en")  # en, mr, hi, gu, kn, te, ta, ml, bn, or, pa, as
    total_pages = Column(Integer, default=1)
    status = Column(String(50), default="UPLOADED")  # UPLOADED, PROCESSING, PROCESSED, FAILED
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    processed_at = Column(DateTime, nullable=True)

    pages = relationship("DocumentPage", back_populates="document", cascade="all, delete-orphan")
    ocr_results = relationship("OCRResult", back_populates="document", cascade="all, delete-orphan")
    extracted_fields = relationship("ExtractedField", back_populates="document", cascade="all, delete-orphan")
    case = relationship("Case", back_populates="documents")


class DocumentPage(Base):
    __tablename__ = "document_pages"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    document_id = Column(String(36), ForeignKey("documents.id", ondelete="CASCADE"), nullable=False, index=True)
    page_number = Column(Integer, nullable=False)
    image_path = Column(String(512), nullable=True)
    width = Column(Integer, nullable=True)
    height = Column(Integer, nullable=True)
    dpi = Column(Integer, default=300)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    document = relationship("Document", back_populates="pages")


class OCRResult(Base):
    __tablename__ = "ocr_results"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    document_id = Column(String(36), ForeignKey("documents.id", ondelete="CASCADE"), nullable=False, index=True)
    page_number = Column(Integer, default=1)
    raw_text = Column(Text, nullable=False)
    language = Column(String(20), default="en")
    overall_confidence = Column(Float, default=0.0)
    blocks_json = Column(JSON, nullable=True)  # [{text, bbox: [x1,y1,x2,y2], confidence, language}]
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    document = relationship("Document", back_populates="ocr_results")


class ExtractedField(Base):
    __tablename__ = "extracted_fields"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    document_id = Column(String(36), ForeignKey("documents.id", ondelete="CASCADE"), nullable=False, index=True)
    field_name = Column(String(100), nullable=False, index=True)  # survey_number, owner_name, area, etc.
    raw_value = Column(Text, nullable=False)
    normalized_value = Column(JSON, nullable=False)  # Parsed structured representation
    confidence = Column(Float, default=0.0)
    source = Column(String(100), default="OCR")
    page = Column(Integer, default=1)
    bounding_box = Column(JSON, nullable=True)  # [x1, y1, x2, y2]
    extraction_method = Column(String(50), default="REGEX_PATTERN")
    is_corrected = Column(Boolean, default=False)
    corrected_value = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    document = relationship("Document", back_populates="extracted_fields")
