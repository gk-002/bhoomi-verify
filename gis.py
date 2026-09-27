from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field, ConfigDict


class GeoJSONGeometry(BaseModel):
    type: str  # Polygon, MultiPolygon, Point
    coordinates: Any


class GeoJSONFeature(BaseModel):
    type: str = "Feature"
    geometry: GeoJSONGeometry
    properties: Dict[str, Any] = Field(default_factory=dict)


class GeoJSONFeatureCollection(BaseModel):
    type: str = "FeatureCollection"
    features: List[GeoJSONFeature] = Field(default_factory=list)


class ParcelResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    parcel_id: str
    state: str
    district: str
    tehsil: str
    village: str
    survey_number: str
    subdivision: Optional[str] = None
    documented_area_sqm: float
    calculated_area_sqm: float
    area_discrepancy_sqm: float
    discrepancy_percentage: float
    adjacent_parcels: List[str] = Field(default_factory=list)
    geojson: Dict[str, Any]
    source_bhu_naksha: bool = True


class AreaDiscrepancyRequest(BaseModel):
    documented_area_sqm: float
    geometry_geojson: Dict[str, Any]


class AreaDiscrepancyResponse(BaseModel):
    documented_area_sqm: float
    calculated_area_sqm: float
    discrepancy_sqm: float
    discrepancy_percentage: float
    status: str  # MATCH, MINOR_DISCREPANCY, SIGNIFICANT_DISCREPANCY
    message: str  # e.g., "Possible spatial discrepancy detected."


class SpatialCompareRequest(BaseModel):
    parcel_a_id: str
    parcel_b_id: Optional[str] = None
    geometry_a_geojson: Optional[Dict[str, Any]] = None
    geometry_b_geojson: Optional[Dict[str, Any]] = None


class OverlapResponse(BaseModel):
    has_overlap: bool
    intersection_area_sqm: float
    overlap_percentage_a: float
    overlap_percentage_b: float
    severity: str  # NONE, LOW, MEDIUM, HIGH, CRITICAL
    message: str  # e.g., "Possible spatial boundary overlap detected between parcels."
    intersection_geojson: Optional[Dict[str, Any]] = None
