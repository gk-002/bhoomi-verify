from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Depends, UploadFile, File, Form, Header, status, HTTPException
from sqlalchemy.orm import Session
from app.core.config import settings
from app.core.database import get_db
from app.core.rbac import get_current_user, TokenData
from app.ocr.pipeline import DocumentIngestionPipeline
from app.ocr.classifier import DocumentClassifier
from app.ocr.engine import MultilingualOCREngine
from app.ocr.extractor import FieldExtractor
from app.ocr.normalizer import FieldNormalizer
from app.models.document import Document, OCRResult, ExtractedField
from app.models.case import Case
from app.schemas.common import APIResponse
from app.schemas.document import DocumentUploadResponse, DocumentDetailResponse, ExtractedFieldSchema

router = APIRouter(prefix="/documents", tags=["Document Ingestion & OCR"])
pipeline = DocumentIngestionPipeline()
ocr_engine = MultilingualOCREngine()
field_extractor = FieldExtractor()


@router.post("/upload", response_model=APIResponse[DocumentUploadResponse], status_code=status.HTTP_201_CREATED)
async def upload_document(
    file: UploadFile = File(...),
    case_id: Optional[str] = Form(None),
    db: Session = Depends(get_db),
    current_user: TokenData = Depends(get_current_user)
):
    ingested = await pipeline.ingest_file(file)

    # Check for existing document with identical sha256
    existing_doc = db.query(Document).filter(Document.sha256_hash == ingested["sha256_hash"]).first()
    if existing_doc:
        return APIResponse(
            data=DocumentUploadResponse(
                document_id=existing_doc.id,
                case_id=existing_doc.case_id,
                filename=existing_doc.filename,
                file_size=existing_doc.file_size,
                mime_type=existing_doc.mime_type,
                sha256_hash=existing_doc.sha256_hash,
                status=existing_doc.status,
                message="Identical document already ingested (deduplicated by SHA256)."
            ),
            message="Document deduplicated."
        )

    doc = Document(
        case_id=case_id,
        filename=ingested["filename"],
        file_path=ingested["file_path"],
        file_size=ingested["file_size"],
        mime_type=ingested["mime_type"],
        sha256_hash=ingested["sha256_hash"],
        total_pages=ingested["total_pages"],
        status="UPLOADED"
    )
    db.add(doc)
    db.commit()
    db.refresh(doc)

    return APIResponse(
        data=DocumentUploadResponse(
            document_id=doc.id,
            case_id=doc.case_id,
            filename=doc.filename,
            file_size=doc.file_size,
            mime_type=doc.mime_type,
            sha256_hash=doc.sha256_hash,
            status=doc.status,
            message="Document uploaded and validated successfully."
        ),
        message="Document uploaded."
    )


@router.post("/{document_id}/process", response_model=APIResponse[DocumentDetailResponse])
def process_document(
    document_id: str,
    db: Session = Depends(get_db),
    current_user: TokenData = Depends(get_current_user)
):
    doc = db.query(Document).filter(Document.id == document_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found.")

    doc.status = "PROCESSING"
    db.commit()

    # 1. OCR Execution
    ocr_results = ocr_engine.process_document(doc.file_path, doc.mime_type)
    full_text = " ".join(p.raw_text for p in ocr_results)

    # 2. Document Classification
    doc_type, classification_conf = DocumentClassifier.classify(full_text)
    doc.document_type = doc_type
    doc.detected_language = ocr_results[0].detected_language if ocr_results else "en"

    # Store OCR Results
    for res in ocr_results:
        ocr_db = OCRResult(
            document_id=doc.id,
            page_number=res.page_number,
            raw_text=res.raw_text,
            language=res.detected_language,
            overall_confidence=res.overall_confidence,
            blocks_json=[b.model_dump() for b in res.blocks]
        )
        db.add(ocr_db)

    # 3. Field Extraction & Normalization
    extracted = field_extractor.extract_fields(ocr_results)
    for ef in extracted:
        normalized_ef = FieldNormalizer.normalize_field(ef)
        db_field = ExtractedField(
            document_id=doc.id,
            field_name=normalized_ef.field_name,
            raw_value=normalized_ef.raw_value,
            normalized_value=normalized_ef.normalized_value,
            confidence=normalized_ef.confidence,
            source=normalized_ef.source,
            page=normalized_ef.page,
            bounding_box=normalized_ef.bounding_box,
            extraction_method=normalized_ef.extraction_method
        )
        db.add(db_field)

    doc.status = "PROCESSED"
    db.commit()
    db.refresh(doc)

    return APIResponse(
        data=DocumentDetailResponse(
            id=doc.id,
            case_id=doc.case_id,
            filename=doc.filename,
            file_size=doc.file_size,
            mime_type=doc.mime_type,
            sha256_hash=doc.sha256_hash,
            document_type=doc.document_type,
            detected_language=doc.detected_language,
            total_pages=doc.total_pages,
            status=doc.status,
            created_at=doc.created_at,
            ocr_results=ocr_results,
            extracted_fields=[ExtractedFieldSchema(
                field_name=f.field_name,
                raw_value=f.raw_value,
                normalized_value=f.normalized_value,
                confidence=f.confidence,
                source=f.source,
                page=f.page,
                bounding_box=f.bounding_box,
                extraction_method=f.extraction_method
            ) for f in doc.extracted_fields]
        ),
        message="Document processed and fields normalized."
    )


@router.get("/{document_id}", response_model=APIResponse[DocumentDetailResponse])
def get_document(document_id: str, db: Session = Depends(get_db)):
    doc = db.query(Document).filter(Document.id == document_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found.")

    return APIResponse(
        data=DocumentDetailResponse(
            id=doc.id,
            case_id=doc.case_id,
            filename=doc.filename,
            file_size=doc.file_size,
            mime_type=doc.mime_type,
            sha256_hash=doc.sha256_hash,
            document_type=doc.document_type,
            detected_language=doc.detected_language,
            total_pages=doc.total_pages,
            status=doc.status,
            created_at=doc.created_at,
            extracted_fields=[ExtractedFieldSchema(
                field_name=f.field_name,
                raw_value=f.raw_value,
                normalized_value=f.normalized_value,
                confidence=f.confidence,
                source=f.source,
                page=f.page,
                bounding_box=f.bounding_box,
                extraction_method=f.extraction_method
            ) for f in doc.extracted_fields]
        )
    )


@router.get("/{document_id}/fields", response_model=APIResponse[List[ExtractedFieldSchema]])
def get_document_fields(document_id: str, db: Session = Depends(get_db)):
    doc = db.query(Document).filter(Document.id == document_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found.")

    fields = [ExtractedFieldSchema(
        id=f.id,
        field_name=f.field_name,
        raw_value=f.raw_value,
        normalized_value=f.normalized_value,
        confidence=f.confidence,
        source=f.source,
        page=f.page,
        bounding_box=f.bounding_box,
        extraction_method=f.extraction_method,
        is_corrected=f.is_corrected,
        corrected_value=f.corrected_value
    ) for f in doc.extracted_fields]

    return APIResponse(data=fields, message=f"Retrieved {len(fields)} fields.")


@router.post("/analyze-ror", response_model=APIResponse[Dict[str, Any]])
async def analyze_uploaded_ror(
    file: UploadFile = File(...),
    api_key: Optional[str] = Header(None, alias="X-API-Key"),
    form_api_key: Optional[str] = Form(None, alias="api_key")
):
    """
    Intelligent RoR / 7/12 Upload & Recognition Endpoint:
    - Recognizes State authority across all 28 states
    - Uses Google Gemini Multimodal Vision API when API key is provided
    - Strictly preserves non-hallucinated dates (null if not in scan)
    - Returns full CaseDossier ready to render in all 7 frontend workspaces
    """
    import hashlib
    from app.ocr.ai_recognizer import IntelligentLandRecordRecognizer

    content = await file.read()
    file_hash = hashlib.sha256(content).hexdigest()

    # Determine effective API key
    effective_api_key = api_key or form_api_key or settings.GEMINI_API_KEY or settings.LAND_RECORD_API_KEY
    if effective_api_key:
        effective_api_key = effective_api_key.strip()
        if len(effective_api_key) == 0:
            effective_api_key = None

    is_ai = False
    recognized_data = None

    # 1. Try Gemini Vision if key provided
    if effective_api_key:
        recognized_data = await IntelligentLandRecordRecognizer.analyze_with_gemini(
            image_bytes=content,
            mime_type=file.content_type or "image/jpeg",
            api_key=effective_api_key
        )
        if recognized_data:
            is_ai = True

    # 2. Resilient local fallback if Gemini is not used or returned null
    if not recognized_data:
        extracted_text = ""
        # If PDF, extract native text
        if (file.content_type == "application/pdf" or file.filename.lower().endswith(".pdf")):
            try:
                import io, pypdf
                pdf_reader = pypdf.PdfReader(io.BytesIO(content))
                extracted_text = " ".join([page.extract_text() or "" for page in pdf_reader.pages])
            except Exception:
                extracted_text = ""

        if not extracted_text:
            # Check if image format (PNG, JPG, WEBP, BMP, etc.)
            is_img = (
                (file.content_type and file.content_type.startswith("image/"))
                or any(file.filename.lower().endswith(ext) for ext in [".png", ".jpg", ".jpeg", ".webp", ".bmp", ".tiff"])
            )
            if is_img:
                extracted_text = await IntelligentLandRecordRecognizer.extract_text_from_image(content)

        if not extracted_text:
            try:
                decoded = content.decode("utf-8", errors="ignore")
                if any(c.isalnum() for c in decoded):
                    extracted_text = decoded
            except Exception:
                extracted_text = ""

        if not extracted_text:
            extracted_text = file.filename

        recognized_data = IntelligentLandRecordRecognizer.analyze_locally(
            raw_text=extracted_text,
            filename=file.filename
        )

    # 3. Assemble full dossier
    dossier = IntelligentLandRecordRecognizer.assemble_full_dossier(
        data=recognized_data,
        file_hash=file_hash,
        filename=file.filename,
        is_ai_recognized=is_ai
    )

    return APIResponse(
        data=dossier,
        message=f"Land record recognized: {dossier['canonical_record']['document_type']} ({dossier['state_name']}) - Survey {dossier['survey_number']}."
    )

