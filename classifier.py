import re
from typing import Dict, Any, Tuple


class DocumentClassifier:
    """Classifies land records based on multilingual keywords and structural patterns."""

    KEYWORDS = {
        "7_12": [
            r"७\s*/\s*१२", r"7\s*/\s*12", r"सातबारा", r"गाव\s*नमुना\s*सात", r"गाव\s*नमुना\s*बारा",
            r"village\s*form\s*vii", r"village\s*form\s*xii", r"अधिकार\s*अभिलेख\s*पत्रक"
        ],
        "8A": [
            r"८\s*अ", r"8\s*a", r"गाव\s*नमुना\s*आठ", r"village\s*form\s*viii", r"खातेदारांची\s*नोंदवही"
        ],
        "KHASRA": [
            r"खसरा", r"khasra", r"खसरा\s*खतौनी", r"गाँव\s*रजिस्टर", r"khasra\s*number"
        ],
        "KHATAUNI": [
            r"खतौनी", r"khatauni", r"खाता\s*संख्या", r"अधिकार\s*अभिलेख", r"record\s*of\s*rights"
        ],
        "JAMABANDI": [
            r"जमाबंदी", r"jamabandi", r"nakal\s*jamabandi", r"फरद\s*जमाबंदी", r"intkal"
        ],
        "RTC": [
            r"rtc", r"pahani", r"ಪಹಣಿ", r"ಹಕ್ಕುಗಳ\s*ದಾಖಲೆ", r"form\s*no\s*16", r"bhoomi"
        ],
        "MUTATION_FERFAR": [
            r"फेरफार", r"फेरेफार", r"mutation", r"दाखिल\s*खारिज", r"नामांतरण", r"ferfar\s*patrak"
        ],
        "SALE_DEED": [
            r"sale\s*deed", r"खरेदीखत", r"बैनामा", r"विक्रय\s*पत्र", r"conveyance\s*deed"
        ],
        "CADASTRAL_MAP": [
            r"भू\s*नक्शा", r"bhu\s*naksha", r"नक्शा", r"cadastral\s*map", r"village\s*map", r"fmb"
        ]
    }

    @classmethod
    def classify(cls, text: str) -> Tuple[str, float]:
        """Returns document classification type and confidence score."""
        normalized_text = text.lower()
        best_type = "UNKNOWN_LAND_DOCUMENT"
        max_matches = 0

        for doc_type, patterns in cls.KEYWORDS.items():
            matches = 0
            for pattern in patterns:
                if re.search(pattern, normalized_text, re.IGNORECASE):
                    matches += 1
            if matches > max_matches:
                max_matches = matches
                best_type = doc_type

        if max_matches >= 2:
            confidence = 0.95
        elif max_matches == 1:
            confidence = 0.80
        else:
            best_type = "LEGACY_LAND_RECORD"
            confidence = 0.50

        return best_type, confidence
