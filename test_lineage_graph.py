import pytest
from app.lineage.graph import LineageGraph


def test_lineage_clean_chain():
    graph = LineageGraph("test_case_clean")
    graph.add_node("n1", "Ramchandra Patil", deceased=True)
    graph.add_node("n2", "Ganesh Patil", deceased=False)
    graph.add_edge("n1", "n2", transition_type="INHERITANCE", mutation_number="1001")

    res = graph.build_response()
    assert res.integrity_status == "VERIFIED"
    assert len(res.anomalies) == 0


def test_lineage_missing_coheir_anomaly():
    graph = LineageGraph("test_case_coheir")
    # Ancestor noted with 3 legal heirs
    graph.add_node("n1", "Dattatray Kulkarni", deceased=True, metadata={"known_heirs_count": 3})
    graph.add_node("n2", "Vijay Kulkarni", deceased=False)
    graph.add_edge("n1", "n2", transition_type="INHERITANCE", mutation_number="1289")

    res = graph.build_response()
    assert res.integrity_status == "REQUIRES_REVIEW"
    assert any(a.anomaly_type == "POSSIBLE_MISSING_COHEIR" for a in res.anomalies)


def test_lineage_cycle_anomaly():
    graph = LineageGraph("test_case_cycle")
    graph.add_node("n1", "Party A")
    graph.add_node("n2", "Party B")
    graph.add_edge("n1", "n2", transition_type="SALE")
    graph.add_edge("n2", "n1", transition_type="SALE")  # Cycle loop

    res = graph.build_response()
    assert res.integrity_status == "BROKEN_CHAIN"
    assert any(a.anomaly_type == "OWNERSHIP_CYCLE_DETECTED" for a in res.anomalies)
