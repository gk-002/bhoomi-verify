import os
import hashlib
from typing import Tuple, Dict, Any
from fastapi import UploadFile
from app.core.config import settings
from app.core.exceptions import BhoomiVerifyException, ErrorCode


class DocumentIngestionPipeline:
    def __init__(self, upload_dir: str = settings.UPLOAD_DIR):
        self.upload_dir = upload_dir
        os.makedirs(self.upload_dir, exist_ok=True)

    async def ingest_file(self, file: UploadFile) -> Dict[str, Any]:
        """Validates file mime type, size, calculates SHA256, and stores it."""
        # Check content type
        if file.content_type not in settings.ALLOWED_DOCUMENT_TYPES:
            raise BhoomiVerifyException(
                error_code=ErrorCode.DOCUMENT_INVALID,
                message=f"Unsupported file type: {file.content_type}. Allowed: PDF, JPG, PNG, TIFF."
            )

        contents = await file.read()
        file_size = len(contents)
        if file_size > settings.MAX_UPLOAD_SIZE_BYTES:
            raise BhoomiVerifyException(
                error_code=ErrorCode.DOCUMENT_INVALID,
                message=f"File exceeds maximum allowed size of {settings.MAX_UPLOAD_SIZE_BYTES // (1024*1024)}MB."
            )

        # Calculate SHA256
        sha256_hash = hashlib.sha256(contents).hexdigest()

        # Generate unique storage filename
        ext = os.path.splitext(file.filename)[1]
        stored_filename = f"{sha256_hash}{ext}"
        file_path = os.path.join(self.upload_dir, stored_filename)

        with open(file_path, "wb") as f:
            f.write(contents)

        # Estimate pages (if PDF, read pages; if image, 1 page)
        total_pages = 1
        if file.content_type == "application/pdf":
            try:
                import pypdf
                reader = pypdf.PdfReader(file_path)
                total_pages = len(reader.pages)
            except Exception:
                total_pages = 1

        return {
            "filename": file.filename,
            "file_path": file_path,
            "file_size": file_size,
            "mime_type": file.content_type,
            "sha256_hash": sha256_hash,
            "total_pages": total_pages,
            "status": "UPLOADED"
        }
