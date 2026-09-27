from typing import Dict, Any, List
from app.schemas.canonical import CanonicalLandRecord, OwnerInfo, MutationInfo
from app.schemas.verification import DiscrepancyDetail
from app.lineage.graph import LineageGraph
from app.gis.engine import GISEngine


class DemoScenarios:
    """Three official synthetic demonstration scenarios for BhoomiVerify.
    
    WARNING: ALL DATA BELOW IS DEMO / SYNTHETIC DATA CREATED FOR SOFTWARE EVALUATION.
    DO NOT CONFUSE WITH ACTIVE REAL-WORLD CITIZEN LAND RECORDS.
    """

    @classmethod
    def get_scenario_a(cls) -> Dict[str, Any]:
        """Scenario A: Clean Title & Unencumbered Inheritance (Low Risk).
        Gat 142/2, Hiware Bazar, Nagar (Rural), Ahilyanagar (Maharashtra).
        """
        poly = GISEngine.create_demo_polygon(19.0683, 74.8872, area_sqm=23500.0)
        
        lineage = LineageGraph(case_id="case_demo_scenario_a")
        lineage.add_node("node_1", "Tukaram Baburao Pawar", node_type="ANCESTOR", generation=1, deceased=True)
        lineage.add_node("node_2", "Balasaheb Tukaram Pawar", node_type="CURRENT_OWNER", generation=2, share="100%")
        lineage.add_edge("node_1", "node_2", transition_type="INHERITANCE", mutation_number="M-514", mutation_date="2019-06-18")

        return {
            "demo_label": "DEMO / SYNTHETIC DATA",
            "scenario_name": "Scenario A - Hiware Bazar Clean Rural Title (Low Risk)",
            "state": "Maharashtra",
            "state_code": "MH",
            "district": "Ahilyanagar",
            "tehsil": "Nagar (Rural)",
            "village": "Hiware Bazar",
            "survey_number": "142/2",
            "subdivision": "2",
            "canonical_record": CanonicalLandRecord(
                state="Maharashtra",
                state_code="MH",
                district="Ahilyanagar",
                tehsil="Nagar (Rural)",
                village="Hiware Bazar",
                survey_number="142/2",
                gat_number="142",
                hissa_number="2",
                owner_names=["Balasaheb Tukaram Pawar"],
                area=2.35,
                area_unit="HECTARE",
                standardized_area_sqm=23500.0,
                tenure_class="Bhogwatadar Class 1 (Occupant)",
                source="MahaBhulekh (DEMO / SYNTHETIC DATA)",
                source_type="OFFICIAL_PORTAL",
                confidence=0.98
            ),
            "documented_area_sqm": 23500.0,
            "calculated_area_sqm": 23500.0,
            "area_discrepancy_percentage": 0.0,
            "boundary_overlap_percentage": 0.0,
            "has_encumbrance": False,
            "risk_score": 5.0,
            "risk_band": "LOW",
            "requires_manual_review": False,
            "discrepancies": [],
            "polygon_geojson": poly,
            "lineage_response": lineage.build_response()
        }

    @classmethod
    def get_scenario_b(cls) -> Dict[str, Any]:
        """Scenario B: 400 sq.m (0.0400 Ha) Gat 215/1, Palashi, Koregaon, Satara."""
        poly_a = GISEngine.create_demo_polygon(17.7015, 74.1750, area_sqm=400.0)
        poly_b = GISEngine.create_demo_polygon(17.7015, 74.175156, area_sqm=400.0)
        overlap = GISEngine.calculate_overlap(poly_a, poly_b)

        lineage = LineageGraph(case_id="case_demo_scenario_b")
        lineage.add_node("node_10", "Babanrao Shankar Kadam", node_type="ANCESTOR", generation=1, deceased=True)
        lineage.add_node("node_11", "Suresh Babanrao Kadam", node_type="CURRENT_OWNER", generation=2, share="100%")
        lineage.add_edge("node_10", "node_11", transition_type="INHERITANCE", mutation_number="M-1042", mutation_date="2022-09-05")

        discrepancies = [
            f"Cadastral Boundary Dispute: Physical bund shifted westward. Adjoining Gat 215/2 overlaps {overlap.intersection_area_sqm} sq.m ({overlap.overlap_percentage_a}%) onto Gat 215/1."
        ]

        return {
            "demo_label": "DEMO / SYNTHETIC DATA",
            "scenario_name": "Scenario B - Palashi Agricultural Plot (Boundary Overlap Dispute)",
            "state": "Maharashtra",
            "state_code": "MH",
            "district": "Satara",
            "tehsil": "Koregaon",
            "village": "Palashi",
            "survey_number": "215/1",
            "canonical_record": CanonicalLandRecord(
                state="Maharashtra",
                state_code="MH",
                district="Satara",
                tehsil="Koregaon",
                village="Palashi",
                survey_number="215/1",
                owner_names=["Suresh Babanrao Kadam"],
                area=0.04,
                area_unit="HECTARE",
                standardized_area_sqm=400.0,
                source="MahaBhulekh (DEMO / SYNTHETIC DATA)",
                source_type="OFFICIAL_PORTAL",
                confidence=0.98
            ),
            "documented_area_sqm": 400.0,
            "calculated_area_sqm": 400.0,
            "area_discrepancy_percentage": 0.0,
            "boundary_overlap_percentage": overlap.overlap_percentage_a,
            "has_encumbrance": False,
            "risk_score": 68.0,
            "risk_band": "HIGH",
            "requires_manual_review": True,
            "discrepancies": discrepancies,
            "polygon_geojson": poly_a,
            "overlapping_polygon_geojson": poly_b,
            "lineage_response": lineage.build_response()
        }

    @classmethod
    def get_scenario_c(cls) -> Dict[str, Any]:
        """Scenario C: Lineage Break, Disputed Mutation & Missing Co-heir (Critical Risk).
        Gat 76/2, Wadner Gangai, Daryapur, Amravati (Maharashtra).
        """
        poly = GISEngine.create_demo_polygon(20.9520, 77.3480, area_sqm=38000.0)

        lineage = LineageGraph(case_id="case_demo_scenario_c")
        # Ancestor who had 3 legal heirs, but mutation only recorded 1
        lineage.add_node("node_20", "Govind Narayan Deshmukh", node_type="ANCESTOR", generation=1, deceased=True, metadata={"known_heirs_count": 3})
        lineage.add_node("node_21", "Rameshwar Govind Deshmukh", node_type="CURRENT_OWNER", generation=2, share="100%")
        # Disputed mutation edge
        lineage.add_edge(
            "node_20",
            "node_21",
            transition_type="INHERITANCE",
            mutation_number="M-789",
            mutation_date="2023-01-10",
            is_disputed=True,
            order_details="Challenged before SDO under RCS/Amravati/2024 by co-heir Anusaya Deshmukh."
        )

        discrepancies = [
            DiscrepancyDetail(
                discrepancy_type="MUTATION_DISPUTE",
                severity="HIGH",
                description="Active revenue dispute on Mutation #M-789 under SDO review.",
                source="E_FERFAR_LITIGATION"
            ),
            DiscrepancyDetail(
                discrepancy_type="POSSIBLE_MISSING_COHEIR",
                severity="HIGH",
                description="Deceased ancestor has recorded daughter Anusaya Deshmukh excluded from gift deed.",
                source="VANSH_VRUKSHA_ANALYSIS"
            ),
            DiscrepancyDetail(
                discrepancy_type="ACTIVE_ENCUMBRANCE",
                severity="HIGH",
                description="Active mortgage charge in favor of Daryapur Taluka PACS Cooperative Society.",
                source="7_12_OTHER_RIGHTS"
            )
        ]

        return {
            "demo_label": "DEMO / SYNTHETIC DATA",
            "scenario_name": "Scenario C - Wadner Gangai Rural Dispute (Critical Risk)",
            "state": "Maharashtra",
            "state_code": "MH",
            "district": "Amravati",
            "tehsil": "Daryapur",
            "village": "Wadner Gangai",
            "survey_number": "76/2",
            "canonical_record": CanonicalLandRecord(
                state="Maharashtra",
                state_code="MH",
                district="Amravati",
                tehsil="Daryapur",
                village="Wadner Gangai",
                survey_number="76/2",
                owner_names=["Rameshwar Govind Deshmukh"],
                area=3.80,
                area_unit="HECTARE",
                standardized_area_sqm=38000.0,
                encumbrance=True,
                mortgage_details={"bank_name": "Daryapur Taluka PACS Society", "amount": 450000},
                source="MahaBhulekh (DEMO / SYNTHETIC DATA)",
                source_type="OFFICIAL_PORTAL",
                confidence=0.74
            ),
            "documented_area_sqm": 38000.0,
            "calculated_area_sqm": 38000.0,
            "area_discrepancy_percentage": 0.0,
            "boundary_overlap_percentage": 0.0,
            "has_encumbrance": True,
            "risk_score": 89.0,
            "risk_band": "CRITICAL",
            "requires_manual_review": True,
            "discrepancies": discrepancies,
            "polygon_geojson": poly,
            "lineage_response": lineage.build_response()
        }
