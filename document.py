from typing import Optional, List, Dict, Any
from datetime import datetime, timezone
from pydantic import BaseModel, Field, ConfigDict


class DocumentUploadResponse(BaseModel):
    document_id: str
    case_id: Optional[str] = None
    filename: str
    file_size: int
    mime_type: str
    sha256_hash: str
    status: str
    message: str


class OCRBlock(BaseModel):
    text: str
    language: str
    confidence: float
    page: int = 1
    bounding_box: Optional[List[int]] = None  # [x1, y1, x2, y2]


class OCRResultSchema(BaseModel):
    document_id: str
    page_number: int
    raw_text: str
    detected_language: str
    overall_confidence: float
    blocks: List[OCRBlock] = Field(default_factory=list)


class ExtractedFieldSchema(BaseModel):
    id: Optional[str] = None
    field_name: str
    raw_value: str
    normalized_value: Any
    confidence: float
    source: str
    page: int
    bounding_box: Optional[List[int]] = None
    extraction_method: str
    is_corrected: bool = False
    corrected_value: Optional[Any] = None


class DocumentDetailResponse(BaseModel):
    id: str
    case_id: Optional[str] = None
    filename: str
    file_size: int
    mime_type: str
    sha256_hash: str
    document_type: Optional[str] = None
    detected_language: str
    total_pages: int
    status: str
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

    ocr_results: List[OCRResultSchema] = Field(default_factory=list)
    extracted_fields: List[ExtractedFieldSchema] = Field(default_factory=list)
