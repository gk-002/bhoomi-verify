import re
from typing import List, Dict, Any, Optional
from app.schemas.document import ExtractedFieldSchema, OCRResultSchema


class FieldExtractor:
    """Extracts raw key-value fields from OCR text with regex and positional patterns."""

    PATTERNS = {
        "survey_number": [
            r"(?:भूमापन\s*क्रमांक|गट\s*क्रमांक|survey\s*no\.?|gat\s*no\.?|khasra\s*no\.?|खसरा\s*नं\.?|ಸರ್ವೆ\s*ನಂ)\s*[:\-]?\s*([0-9\/\.\-\u0966-\u096F]+[a-zA-Z\u0900-\u097F]*)",
            r"(?:सर्व्हे\s*नंबर|गट\s*नं|khasra|dag\s*no)\s*[:\-]?\s*([0-9\/\.\-\u0966-\u096F]+)"
        ],
        "khata_number": [
            r"(?:खाते\s*क्रमांक|khata\s*no\.?|खाता\s*संख्या|ಖಾತಾ\s*ಸಂಖ್ಯೆ)\s*[:\-]?\s*([0-9\u0966-\u096F]+)"
        ],
        "village": [
            r"(?:गाव|गाँव|village|ಗ್ರಾಮ)\s*[:\-]?\s*([a-zA-Z\u0900-\u097F\u0C80-\u0CFF]+)",
        ],
        "tehsil": [
            r"(?:तालुका|तहसील|tehsil|taluka|ತಾಲೂಕು)\s*[:\-]?\s*([a-zA-Z\u0900-\u097F\u0C80-\u0CFF]+)",
        ],
        "district": [
            r"(?:जिल्हा|जिला|district|ಜಿಲ್ಲೆ)\s*[:\-]?\s*([a-zA-Z\u0900-\u097F\u0C80-\u0CFF]+)",
        ],
        "owner_name": [
            r"(?:भोगवटादाराचे\s*नाव|खातेदाराचे\s*नाव|खातेदार|pattadar\s*name|owner\s*name|ಭೂಮಾಲೀಕರ\s*ಹೆಸರು)\s*[:\-]?\s*([a-zA-Z\u0900-\u097F\s\.]+)",
            r"(?:कास्तकार|मालिक\s*का\s*नाम)\s*[:\-]?\s*([a-zA-Z\u0900-\u097F\s\.]+)"
        ],
        "area": [
            r"(?:क्षेत्र|area|ವಿಸ್ತೀರ್ಣ)\s*[:\-]?\s*([0-9\.\,\u0966-\u096F]+\s*(?:हेक्टर|आर|एकर|hec|are|acre|sq\.?\s*m|bigha)?)",
        ],
        "mutation_number": [
            r"(?:फेरफार\s*क्र\.?|mutation\s*no\.?|नामांतरण\s*संख्या|ದಾಖಲಾತಿ\s*ಸಂ)\s*[:\-]?\s*([0-9\u0966-\u096F]+)"
        ]
    }

    def extract_fields(self, ocr_results: List[OCRResultSchema]) -> List[ExtractedFieldSchema]:
        """Scans OCR pages and extracts raw fields with spatial and confidence data."""
        extracted: List[ExtractedFieldSchema] = []

        for page in ocr_results:
            full_text = page.raw_text

            for field_name, patterns in self.PATTERNS.items():
                found_match = False
                for pattern in patterns:
                    match = re.search(pattern, full_text, re.IGNORECASE)
                    if match:
                        raw_val = match.group(0).strip()
                        extracted_val = match.group(1).strip()
                        
                        # Find block coordinates matching this text
                        bbox = [50, 100, 750, 140]
                        for block in page.blocks:
                            if extracted_val in block.text or raw_val in block.text:
                                bbox = block.bounding_box
                                break

                        extracted.append(
                            ExtractedFieldSchema(
                                field_name=field_name,
                                raw_value=raw_val,
                                normalized_value={"raw_extracted": extracted_val},
                                confidence=page.overall_confidence,
                                source="OCR",
                                page=page.page_number,
                                bounding_box=bbox,
                                extraction_method="REGEX_PATTERN"
                            )
                        )
                        found_match = True
                        break

        return extracted
