import pytest
from app.ocr.normalizer import FieldNormalizer
from app.ocr.classifier import DocumentClassifier
from app.schemas.document import ExtractedFieldSchema


def test_devanagari_numeral_conversion():
    raw_indic = "४२/१-अ"
    converted = FieldNormalizer.convert_indic_numerals(raw_indic)
    assert converted == "42/1-अ"


def test_survey_normalization_preserves_raw_value():
    field = ExtractedFieldSchema(
        field_name="survey_number",
        raw_value="गट क्र. ४२/१-A",
        normalized_value={},
        confidence=0.95,
        source="OCR",
        page=1,
        extraction_method="REGEX_PATTERN"
    )
    normalized_field = FieldNormalizer.normalize_field(field)

    # Raw value is preserved intact
    assert normalized_field.raw_value == "गट क्र. ४२/१-A"
    
    # Normalized value contains parsed components
    norm = normalized_field.normalized_value
    assert norm["base_survey_number"] == "42"
    assert norm["subdivision_number"] == "1"
    assert norm["canonical_identifier"] == "42/1"


def test_area_standardization():
    # Test Hectare conversion (1 Hectare = 10,000 sqm)
    hec_norm = FieldNormalizer.normalize_area("0.85 हेक्टर")
    assert hec_norm["unit"] == "HECTARE"
    assert hec_norm["standardized_sqm"] == 8500.0

    # Test Acre conversion (1 Acre = ~4046.86 sqm)
    acre_norm = FieldNormalizer.normalize_area("2.0 Acre")
    assert acre_norm["unit"] == "ACRE"
    assert acre_norm["standardized_sqm"] == 8093.72


def test_name_normalization_strips_honorifics():
    name_norm = FieldNormalizer.normalize_name("श्री गणेश रामचंद्र पाटील")
    assert name_norm["normalized_name"] == "गणेश रामचंद्र पाटील"


def test_document_classifier():
    satbara_sample = "महाराष्ट्र शासन गाव नमुना ७ अधिकार अभिलेख पत्रक सातबारा"
    doc_type, conf = DocumentClassifier.classify(satbara_sample)
    assert doc_type == "7_12"
    assert conf >= 0.80

    rtc_sample = "Government of Karnataka Bhoomi Form No 16 Record of Rights Pahani RTC"
    doc_type_rtc, conf_rtc = DocumentClassifier.classify(rtc_sample)
    assert doc_type_rtc == "RTC"
    assert conf_rtc >= 0.80
