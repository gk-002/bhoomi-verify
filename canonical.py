from typing import Optional, List, Dict, Any, Union
from datetime import datetime, timezone
from pydantic import BaseModel, Field, ConfigDict


class RawNormalizedField(BaseModel):
    raw_value: str
    normalized_value: Any
    confidence: float = Field(ge=0.0, le=1.0, default=1.0)
    source: str = "OFFICIAL_RECORD"
    page: int = 1
    bounding_box: Optional[List[int]] = None  # [x1, y1, x2, y2]
    extraction_method: str = "OFFICIAL_PORTAL"


class OwnerInfo(BaseModel):
    name: str
    normalized_name: str
    relationship_type: Optional[str] = None
    relative_name: Optional[str] = None
    share_percentage: Optional[float] = None
    is_co_owner: bool = False


class MutationInfo(BaseModel):
    mutation_number: str
    mutation_date: Optional[Union[str, datetime]] = None
    mutation_type: Optional[str] = None
    source_party: Optional[str] = None
    target_party: Optional[str] = None
    status: str = "CERTIFIED"
    order_details: Optional[str] = None


class CanonicalLandRecord(BaseModel):
    id: Optional[str] = None
    case_id: Optional[str] = None
    
    # Administrative hierarchy
    state: str
    state_code: str
    district: str
    tehsil: str
    village: str

    # State-specific identifiers
    survey_number: Optional[str] = None
    gat_number: Optional[str] = None
    khasra_number: Optional[str] = None
    plot_number: Optional[str] = None
    dag_number: Optional[str] = None
    hissa_number: Optional[str] = None
    khata_number: Optional[str] = None
    unique_land_parcel_id: Optional[str] = None

    # Owners & Relations
    owner_names: List[str] = Field(default_factory=list)
    co_owner_names: List[str] = Field(default_factory=list)
    relation_names: List[str] = Field(default_factory=list)
    owners_detail: List[OwnerInfo] = Field(default_factory=list)

    # Area & Classification
    area: Optional[float] = None
    area_unit: str = "HECTARE"
    standardized_area_sqm: Optional[float] = None
    land_classification: Optional[str] = None
    tenure_class: Optional[str] = None

    # Mutations & History
    mutations: List[MutationInfo] = Field(default_factory=list)
    mutation_number: Optional[str] = None
    mutation_date: Optional[Union[str, datetime]] = None

    # Registration & Encumbrance
    registration_number: Optional[str] = None
    registration_date: Optional[Union[str, datetime]] = None
    encumbrance: bool = False
    mortgage_details: Optional[Dict[str, Any]] = None

    # Provenance & Raw/Normalized duality
    source: str
    source_type: str  # PUBLIC_API, AUTHENTICATED_API, OFFICIAL_PORTAL, etc.
    retrieved_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    confidence: float = 1.0

    model_config = ConfigDict(from_attributes=True)

    raw_record: Optional[Dict[str, Any]] = None
    normalized_record: Optional[Dict[str, Any]] = None
