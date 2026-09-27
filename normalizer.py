import re
from typing import Dict, Any, Optional
from app.schemas.document import ExtractedFieldSchema


class FieldNormalizer:
    """Normalizes raw extracted land record fields into standardized structured models."""

    DEVANAGARI_DIGITS = {
        '०': '0', '१': '1', '२': '2', '३': '3', '४': '4',
        '५': '5', '६': '6', '७': '7', '८': '8', '९': '9'
    }

    @classmethod
    def convert_indic_numerals(cls, text: str) -> str:
        """Transliterates Indic script numerals to standard ASCII digits."""
        res = []
        for ch in text:
            res.append(cls.DEVANAGARI_DIGITS.get(ch, ch))
        return "".join(res)

    @classmethod
    def normalize_survey_identifier(cls, raw_value: str) -> Dict[str, Any]:
        """Normalizes composite survey / gat / hissa / subdivision numbers."""
        ascii_text = cls.convert_indic_numerals(raw_value)
        # Match patterns like 42/1-A or 42/1 or 108/A
        match = re.search(r'([0-9]+)(?:[\/\-]([0-9]+))?(?:[\/\-]([a-zA-Z\u0900-\u097F]+))?', ascii_text)
        if match:
            main_no = match.group(1)
            sub_no = match.group(2)
            hissa = match.group(3)

            full_survey = f"{main_no}/{sub_no}" if sub_no else main_no
            return {
                "base_survey_number": main_no,
                "subdivision_number": sub_no,
                "hissa_number": hissa,
                "canonical_identifier": full_survey
            }
        return {"canonical_identifier": ascii_text.strip()}

    @classmethod
    def normalize_area(cls, raw_value: str) -> Dict[str, Any]:
        """Converts diverse land area units (Hectare-Are, Acre-Guntha, Bigha) to standardized sq. meters."""
        ascii_text = cls.convert_indic_numerals(raw_value).lower()
        
        # Check for Hectare.Are pattern e.g. "0.85 हेक्टर" or "1.24 Hectare"
        hec_match = re.search(r'([0-9]+(?:\.[0-9]+)?)\s*(?:हेक्टर|hec|ha)', ascii_text)
        if hec_match:
            val = float(hec_match.group(1))
            return {
                "original_value": val,
                "unit": "HECTARE",
                "standardized_sqm": round(val * 10000.0, 2)
            }

        # Check for Acre pattern e.g. "2.5 Acre"
        acre_match = re.search(r'([0-9]+(?:\.[0-9]+)?)\s*(?:एकर|acre)', ascii_text)
        if acre_match:
            val = float(acre_match.group(1))
            return {
                "original_value": val,
                "unit": "ACRE",
                "standardized_sqm": round(val * 4046.86, 2)
            }

        # Check for Guntha pattern (1 Guntha = 101.17 sqm)
        guntha_match = re.search(r'([0-9]+(?:\.[0-9]+)?)\s*(?:गुंठा|guntha|आर|are)', ascii_text)
        if guntha_match:
            val = float(guntha_match.group(1))
            return {
                "original_value": val,
                "unit": "ARE_GUNTHA",
                "standardized_sqm": round(val * 100.0, 2)
            }

        # Default fallback float extraction
        num_match = re.search(r'([0-9]+(?:\.[0-9]+)?)', ascii_text)
        if num_match:
            val = float(num_match.group(1))
            return {
                "original_value": val,
                "unit": "UNKNOWN",
                "standardized_sqm": val
            }

        return {"original_value": raw_value, "unit": "UNRESOLVED", "standardized_sqm": 0.0}

    @classmethod
    def normalize_name(cls, raw_value: str) -> Dict[str, Any]:
        """Cleans titles, honorifics, and relationship markers from owner names."""
        clean = re.sub(r'(?:श्री|श्रीमती|स्व\.|कै\.|shri|smt|late|mr\.|mrs\.)\s*', '', raw_value, flags=re.IGNORECASE)
        clean = re.sub(r'\s+', ' ', clean).strip()
        
        # Detect relationship (s/o, w/o, d/o, आत्मज, वारस)
        rel_type = None
        rel_name = None
        rel_match = re.search(r'(?:s\/o|w\/o|d\/o|आत्मज|वडील|पती)\s*([a-zA-Z\u0900-\u097F\s]+)', clean, re.IGNORECASE)
        if rel_match:
            rel_name = rel_match.group(1).strip()
            rel_type = "RELATIVE"

        return {
            "normalized_name": clean,
            "relationship_type": rel_type,
            "relative_name": rel_name
        }

    @classmethod
    def normalize_field(cls, field: ExtractedFieldSchema) -> ExtractedFieldSchema:
        """Applies field-specific normalization while preserving raw values."""
        name = field.field_name.lower()
        if "survey" in name or "gat" in name or "khasra" in name:
            field.normalized_value = cls.normalize_survey_identifier(field.raw_value)
        elif "area" in name:
            field.normalized_value = cls.normalize_area(field.raw_value)
        elif "owner" in name or "name" in name:
            field.normalized_value = cls.normalize_name(field.raw_value)
        else:
            field.normalized_value = {"value": cls.convert_indic_numerals(field.raw_value).strip()}
        return field
