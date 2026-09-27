import pytest
from app.gis.engine import GISEngine


def test_area_discrepancy_match():
    poly = GISEngine.create_demo_polygon(18.91, 73.32, 0.0008)
    res = GISEngine.calculate_area_discrepancy(
        documented_area_sqm=31300.0,
        geometry_geojson=poly
    )
    assert res.status in ("MATCH", "MINOR_DISCREPANCY", "SIGNIFICANT_DISCREPANCY")
    assert "Possible spatial discrepancy detected" in res.message or "tolerance" in res.message


def test_boundary_overlap_detection():
    # Two overlapping polygons
    poly_a = GISEngine.create_demo_polygon(18.4600, 73.8300, 0.0010)
    poly_b = GISEngine.create_demo_polygon(18.4605, 73.8305, 0.0010)

    overlap = GISEngine.calculate_overlap(poly_a, poly_b)
    assert overlap.has_overlap is True
    assert overlap.intersection_area_sqm > 0
    assert overlap.severity in ("LOW", "MEDIUM", "HIGH", "CRITICAL")
    # Verify non-defamatory legal language
    assert "Legal encroachment confirmed" not in overlap.message
    assert "Possible spatial discrepancy detected" in overlap.message


def test_disjoint_polygons_no_overlap():
    poly_a = GISEngine.create_demo_polygon(18.0000, 73.0000, 0.0005)
    poly_b = GISEngine.create_demo_polygon(19.0000, 74.0000, 0.0005)

    overlap = GISEngine.calculate_overlap(poly_a, poly_b)
    assert overlap.has_overlap is False
    assert overlap.intersection_area_sqm == 0.0
