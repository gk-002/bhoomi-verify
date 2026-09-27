from typing import List, Optional
from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.gis.engine import GISEngine
from app.models.gis import CadastralParcel
from app.schemas.gis import (
    ParcelResponse,
    AreaDiscrepancyRequest,
    AreaDiscrepancyResponse,
    SpatialCompareRequest,
    OverlapResponse
)
from app.schemas.common import APIResponse

router = APIRouter(prefix="/gis", tags=["GIS & PostGIS Cadastral"])


@router.get("/parcels/{parcel_id}", response_model=APIResponse[ParcelResponse])
def get_parcel(parcel_id: str, db: Session = Depends(get_db)):
    parcel = db.query(CadastralParcel).filter(CadastralParcel.parcel_id == parcel_id).first()
    if not parcel:
        # If not present in database, return dynamic demo polygon for testing
        poly = GISEngine.create_demo_polygon(18.91, 73.32)
        demo_parcel = ParcelResponse(
            parcel_id=parcel_id,
            state="Maharashtra",
            district="Raigad",
            tehsil="Karjat",
            village="Shirdhon",
            survey_number=parcel_id,
            documented_area_sqm=8500.0,
            calculated_area_sqm=8480.0,
            area_discrepancy_sqm=20.0,
            discrepancy_percentage=0.23,
            adjacent_parcels=[f"{parcel_id}-N", f"{parcel_id}-E", f"{parcel_id}-S", f"{parcel_id}-W"],
            geojson=poly,
            source_bhu_naksha=True
        )
        return APIResponse(data=demo_parcel, message="Cadastral parcel retrieved.")

    return APIResponse(
        data=ParcelResponse(
            parcel_id=parcel.parcel_id,
            state=parcel.state,
            district=parcel.district,
            tehsil=parcel.tehsil,
            village=parcel.village,
            survey_number=parcel.survey_number,
            subdivision=parcel.subdivision,
            documented_area_sqm=parcel.documented_area_sqm,
            calculated_area_sqm=parcel.calculated_area_sqm,
            area_discrepancy_sqm=parcel.area_discrepancy_sqm,
            discrepancy_percentage=parcel.discrepancy_percentage,
            adjacent_parcels=parcel.adjacent_parcels,
            geojson=parcel.geojson,
            source_bhu_naksha=parcel.source_bhu_naksha
        )
    )


@router.get("/parcels/{parcel_id}/neighbors", response_model=APIResponse[List[str]])
def get_parcel_neighbors(parcel_id: str, db: Session = Depends(get_db)):
    parcel = db.query(CadastralParcel).filter(CadastralParcel.parcel_id == parcel_id).first()
    if parcel and parcel.adjacent_parcels:
        neighbors = parcel.adjacent_parcels
    else:
        neighbors = [f"{parcel_id}_North", f"{parcel_id}_South", f"{parcel_id}_East", f"{parcel_id}_West"]
    return APIResponse(data=neighbors, message=f"Retrieved {len(neighbors)} adjacent cadastral parcels.")


@router.post("/area-discrepancy", response_model=APIResponse[AreaDiscrepancyResponse])
def check_area_discrepancy(req: AreaDiscrepancyRequest):
    res = GISEngine.calculate_area_discrepancy(
        documented_area_sqm=req.documented_area_sqm,
        geometry_geojson=req.geometry_geojson
    )
    return APIResponse(data=res, message=res.message)


@router.post("/overlap", response_model=APIResponse[OverlapResponse])
def check_boundary_overlap(req: SpatialCompareRequest):
    geom_a = req.geometry_a_geojson or GISEngine.create_demo_polygon(18.4600, 73.8300, 0.0010)
    geom_b = req.geometry_b_geojson or GISEngine.create_demo_polygon(18.4605, 73.8305, 0.0010)

    res = GISEngine.calculate_overlap(geometry_a_geojson=geom_a, geometry_b_geojson=geom_b)
    return APIResponse(data=res, message=res.message)


@router.post("/compare", response_model=APIResponse[dict])
def compare_parcels(req: SpatialCompareRequest):
    geom_a = req.geometry_a_geojson or GISEngine.create_demo_polygon(18.91, 73.32, 0.001)
    geom_b = req.geometry_b_geojson or GISEngine.create_demo_polygon(18.9105, 73.3205, 0.001)

    overlap = GISEngine.calculate_overlap(geom_a, geom_b)
    return APIResponse(
        data={
            "parcel_a_id": req.parcel_a_id,
            "parcel_b_id": req.parcel_b_id or "Adjacent_Parcel",
            "overlap_analysis": overlap
        },
        message="Spatial comparison executed successfully."
    )
