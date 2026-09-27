from typing import Dict, List, Optional
from app.integrations.provider_config import ProviderConfig
from app.schemas.provider import SourceType, AuthType


class ProviderRegistry:
    """Central registry of verified government providers indexed by state and capability."""
    _providers: Dict[str, ProviderConfig] = {}

    @classmethod
    def register(cls, config: ProviderConfig):
        cls._providers[config.provider_id] = config

    @classmethod
    def get(cls, provider_id: str) -> Optional[ProviderConfig]:
        return cls._providers.get(provider_id)

    @classmethod
    def get_providers_for_state(cls, state_code: str) -> List[ProviderConfig]:
        target = state_code.upper()
        return [p for p in cls._providers.values() if p.state.upper() == target and p.enabled]

    @classmethod
    def find_providers(
        cls,
        state_code: str,
        operation: str,
        document_type: Optional[str] = None
    ) -> List[ProviderConfig]:
        """Finds eligible providers matching state, operation, and document type."""
        state_providers = cls.get_providers_for_state(state_code)
        eligible = []
        for p in state_providers:
            if operation in p.supported_operations:
                if document_type is None or document_type in p.supported_documents or "*" in p.supported_documents:
                    eligible.append(p)
        return eligible

    @classmethod
    def list_all(cls) -> List[ProviderConfig]:
        return list(cls._providers.values())


def init_default_providers():
    """Registers official verified DILRMP land record providers across states."""
    defaults = [
        # Maharashtra
        ProviderConfig(
            provider_id="maharashtra_mahabhumi_ror",
            provider_name="MahaBhulekh RoR Service",
            state="MH",
            source_type=SourceType.OFFICIAL_PORTAL,
            official_domain="bhulekh.mahabhumi.gov.in",
            supported_documents=["7_12", "8A"],
            supported_operations=["ROR_LOOKUP", "OWNERSHIP_VERIFY"],
            supported_identifiers=["SURVEY_NUMBER", "GAT_NUMBER"],
            authentication_type=AuthType.NONE,
            requires_credentials=False
        ),
        ProviderConfig(
            provider_id="maharashtra_bhunaksha_gis",
            provider_name="Maharashtra BhuNaksha GIS",
            state="MH",
            source_type=SourceType.OFFICIAL_DATA_SERVICE,
            official_domain="mahabhunaksha.mahabhumi.gov.in",
            supported_documents=["CADASTRAL_BHUNAKSHA"],
            supported_operations=["CADASTRAL_GIS", "SPATIAL_VERIFY"],
            supported_identifiers=["SURVEY_NUMBER", "GAT_NUMBER"],
            authentication_type=AuthType.NONE,
            requires_credentials=False
        ),
        ProviderConfig(
            provider_id="maharashtra_igrmaharashtra_sro",
            provider_name="IGR Maharashtra e-Search",
            state="MH",
            source_type=SourceType.OFFICIAL_PORTAL,
            official_domain="igrmaharashtra.gov.in",
            supported_documents=["SALE_DEED", "REGISTRATION"],
            supported_operations=["REGISTRATION_CHECK"],
            supported_identifiers=["SURVEY_NUMBER", "REGISTRATION_NUMBER"],
            authentication_type=AuthType.NONE,
            requires_credentials=False
        ),
        # Karnataka
        ProviderConfig(
            provider_id="karnataka_bhoomi_ror",
            provider_name="Karnataka Bhoomi RTC Service",
            state="KA",
            source_type=SourceType.OFFICIAL_PORTAL,
            official_domain="landrecords.karnataka.gov.in",
            supported_documents=["RTC", "FORM_16"],
            supported_operations=["ROR_LOOKUP", "OWNERSHIP_VERIFY"],
            supported_identifiers=["SURVEY_NUMBER", "HISSA_NUMBER"],
            authentication_type=AuthType.NONE,
            requires_credentials=False
        ),
        ProviderConfig(
            provider_id="karnataka_mojini_gis",
            provider_name="Karnataka Mojini Cadastral",
            state="KA",
            source_type=SourceType.OFFICIAL_DATA_SERVICE,
            official_domain="bhoomojankari.karnataka.gov.in",
            supported_documents=["MOJINI_SKETCH"],
            supported_operations=["CADASTRAL_GIS"],
            supported_identifiers=["SURVEY_NUMBER"],
            authentication_type=AuthType.NONE,
            requires_credentials=False
        ),
        # Gujarat
        ProviderConfig(
            provider_id="gujarat_anyror_portal",
            provider_name="Gujarat AnyROR Service",
            state="GJ",
            source_type=SourceType.OFFICIAL_PORTAL,
            official_domain="anyror.gujarat.gov.in",
            supported_documents=["VF_7", "VF_8A", "VF_6"],
            supported_operations=["ROR_LOOKUP", "MUTATION_CHECK"],
            supported_identifiers=["SURVEY_NUMBER", "KHATA_NUMBER"],
            authentication_type=AuthType.NONE,
            requires_credentials=False
        ),
        # Uttar Pradesh
        ProviderConfig(
            provider_id="up_bhulekh_portal",
            provider_name="UP Bhulekh Khatauni",
            state="UP",
            source_type=SourceType.OFFICIAL_PORTAL,
            official_domain="upbhulekh.gov.in",
            supported_documents=["KHATAUNI", "KHASRA"],
            supported_operations=["ROR_LOOKUP", "OWNERSHIP_VERIFY"],
            supported_identifiers=["KHASRA_NUMBER", "GATA_NUMBER"],
            authentication_type=AuthType.NONE,
            requires_credentials=False
        ),
    ]
    for p in defaults:
        ProviderRegistry.register(p)


init_default_providers()
