import math
from typing import Dict, Any, List, Optional, Tuple
from shapely.geometry import shape, mapping, Polygon, MultiPolygon
from shapely.ops import unary_union
from app.schemas.gis import (
    AreaDiscrepancyResponse,
    OverlapResponse,
    GeoJSONFeature,
    GeoJSONFeatureCollection
)


class GISEngine:
    """Performs spatial geometry comparisons, overlap analysis, and area discrepancy checks using Shapely."""

    @staticmethod
    def _projected_area_sqm(geom) -> float:
        """Approximates planar area in square meters for WGS84 geometries."""
        # Standard ellipsoidal approximation around India (~19° N latitude)
        centroid = geom.centroid
        lat_rad = math.radians(centroid.y)
        lat_scale = 111132.92 - 559.82 * math.cos(2 * lat_rad)
        lng_scale = 111412.84 * math.cos(lat_rad)
        
        # Scale coordinates into metres
        if geom.geom_type == 'Polygon':
            exterior_coords = [(x * lng_scale, y * lat_scale) for x, y in geom.exterior.coords]
            projected_poly = Polygon(exterior_coords)
            return abs(projected_poly.area)
        elif geom.geom_type == 'MultiPolygon':
            total = 0.0
            for poly in geom.geoms:
                exterior_coords = [(x * lng_scale, y * lat_scale) for x, y in poly.exterior.coords]
                total += abs(Polygon(exterior_coords).area)
            return total
        return abs(geom.area)

    @classmethod
    def calculate_area_discrepancy(
        cls,
        documented_area_sqm: float,
        geometry_geojson: Dict[str, Any]
    ) -> AreaDiscrepancyResponse:
        """Calculates deviation between documented land area and mapped cadastral boundary."""
        geom = shape(geometry_geojson)
        calculated_area = cls._projected_area_sqm(geom)

        diff = abs(calculated_area - documented_area_sqm)
        perc = (diff / documented_area_sqm * 100.0) if documented_area_sqm > 0 else 0.0

        if perc <= 5.0:
            status = "MATCH"
            message = "Documented area matches mapped cadastral boundary within statutory 5% tolerance."
        elif perc <= 15.0:
            status = "MINOR_DISCREPANCY"
            message = "Possible spatial discrepancy detected: Minor area variation (5-15%)."
        else:
            status = "SIGNIFICANT_DISCREPANCY"
            message = "Possible spatial discrepancy detected: Significant divergence (>15%) between document and cadastre."

        return AreaDiscrepancyResponse(
            documented_area_sqm=round(documented_area_sqm, 2),
            calculated_area_sqm=round(calculated_area, 2),
            discrepancy_sqm=round(diff, 2),
            discrepancy_percentage=round(perc, 2),
            status=status,
            message=message
        )

    @classmethod
    def calculate_overlap(
        cls,
        geometry_a_geojson: Dict[str, Any],
        geometry_b_geojson: Dict[str, Any]
    ) -> OverlapResponse:
        """Detects spatial boundary overlap between two land parcels."""
        geom_a = shape(geometry_a_geojson)
        geom_b = shape(geometry_b_geojson)

        if not geom_a.intersects(geom_b):
            return OverlapResponse(
                has_overlap=False,
                intersection_area_sqm=0.0,
                overlap_percentage_a=0.0,
                overlap_percentage_b=0.0,
                severity="NONE",
                message="Boundaries are spatially disjoint with no detected overlap.",
                intersection_geojson=None
            )

        intersection = geom_a.intersection(geom_b)
        intersection_sqm = cls._projected_area_sqm(intersection)
        area_a = cls._projected_area_sqm(geom_a)
        area_b = cls._projected_area_sqm(geom_b)

        perc_a = (intersection_sqm / area_a * 100.0) if area_a > 0 else 0.0
        perc_b = (intersection_sqm / area_b * 100.0) if area_b > 0 else 0.0

        # Language neutrality: Never declare "legal encroachment" purely from geometry
        if perc_a > 20.0 or perc_b > 20.0:
            severity = "CRITICAL"
            message = "Possible spatial discrepancy detected: Major boundary overlap observed."
        elif perc_a > 5.0 or perc_b > 5.0:
            severity = "HIGH"
            message = "Possible spatial discrepancy detected: Substantial boundary overlap observed."
        else:
            severity = "LOW"
            message = "Possible spatial discrepancy detected: Minor boundary contact/overlap within tolerance."

        return OverlapResponse(
            has_overlap=True,
            intersection_area_sqm=round(intersection_sqm, 2),
            overlap_percentage_a=round(perc_a, 2),
            overlap_percentage_b=round(perc_b, 2),
            severity=severity,
            message=message,
            intersection_geojson=mapping(intersection)
        )

    @classmethod
    def create_demo_polygon(
        cls, 
        center_lat: float, 
        center_lng: float, 
        size_delta: Optional[float] = None, 
        area_sqm: Optional[float] = None
    ) -> Dict[str, Any]:
        """Utility to generate a valid GeoJSON polygon around coordinates scaled to exact area in sqm."""
        phi = math.radians(center_lat)
        m_lat = 111132.92 - 559.82 * math.cos(2 * phi) + 1.175 * math.cos(4 * phi)
        m_lng = 111412.84 * math.cos(phi) - 93.5 * math.cos(3 * phi)

        if area_sqm is not None and area_sqm > 0:
            side = math.sqrt(area_sqm)
            d_lat = (side / 2.0) / m_lat
            d_lng = (side / 2.0) / m_lng
        elif size_delta is not None:
            d_lat = size_delta
            d_lng = size_delta
        else:
            # Default 400 sqm (20m x 20m)
            side = 20.0
            d_lat = (side / 2.0) / m_lat
            d_lng = (side / 2.0) / m_lng

        coords = [
            [round(center_lng - d_lng, 6), round(center_lat - d_lat, 6)],
            [round(center_lng + d_lng, 6), round(center_lat - d_lat, 6)],
            [round(center_lng + d_lng, 6), round(center_lat + d_lat, 6)],
            [round(center_lng - d_lng, 6), round(center_lat + d_lat, 6)],
            [round(center_lng - d_lng, 6), round(center_lat - d_lat, 6)]
        ]
        return {
            "type": "Polygon",
            "coordinates": [coords]
        }
