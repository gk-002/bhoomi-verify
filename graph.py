from typing import List, Dict, Any, Optional
import networkx as nx
from app.schemas.lineage import (
    LineageNodeSchema,
    LineageEdgeSchema,
    LineageAnomalySchema,
    LineageGraphResponse
)


class LineageGraph:
    """Directed Acyclic Graph representing the genealogical and ownership transmission chain (Vansh-Vruksha)."""

    def __init__(self, case_id: str):
        self.case_id = case_id
        self.nodes: Dict[str, LineageNodeSchema] = {}
        self.edges: List[LineageEdgeSchema] = []
        self._graph = nx.DiGraph()

    def add_node(
        self,
        node_id: str,
        label: str,
        node_type: str = "CURRENT_OWNER",
        generation: int = 0,
        deceased: bool = False,
        share: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None
    ):
        node = LineageNodeSchema(
            id=node_id,
            label=label,
            node_type=node_type,
            generation=generation,
            deceased=deceased,
            share=share,
            metadata=metadata or {}
        )
        self.nodes[node_id] = node
        self._graph.add_node(node_id, **node.model_dump())

    def add_edge(
        self,
        source: str,
        target: str,
        transition_type: str,
        mutation_number: Optional[str] = None,
        mutation_date: Optional[str] = None,
        is_disputed: bool = False,
        order_details: Optional[str] = None
    ):
        edge = LineageEdgeSchema(
            source=source,
            target=target,
            transition_type=transition_type,
            mutation_number=mutation_number,
            mutation_date=mutation_date,
            is_disputed=is_disputed,
            order_details=order_details
        )
        self.edges.append(edge)
        self._graph.add_edge(source, target, **edge.model_dump())

    def analyze_anomalies(self) -> List[LineageAnomalySchema]:
        """Detects missing links, loops, disputed mutations, or unexplained transfers in succession."""
        anomalies: List[LineageAnomalySchema] = []

        # 1. Check for cycles/loops (ownership cannot circular-transfer to ancestor)
        try:
            cycles = list(nx.simple_cycles(self._graph))
            if cycles:
                anomalies.append(
                    LineageAnomalySchema(
                        anomaly_type="OWNERSHIP_CYCLE_DETECTED",
                        severity="CRITICAL",
                        description=f"Invalid ownership transmission loop detected across nodes: {cycles[0]}.",
                        affected_nodes=cycles[0],
                        evidence={"cycles": cycles},
                        requires_review=True
                    )
                )
        except Exception:
            pass

        # 2. Check for disconnected nodes / missing lineage link
        if len(self.nodes) > 1:
            roots = [n for n, deg in self._graph.in_degree() if deg == 0]
            leafs = [n for n, deg in self._graph.out_degree() if deg == 0]
            for leaf in leafs:
                reachable_from_roots = any(nx.has_path(self._graph, r, leaf) for r in roots)
                if not reachable_from_roots:
                    anomalies.append(
                        LineageAnomalySchema(
                            anomaly_type="MISSING_LINEAGE_LINK",
                            severity="HIGH",
                            description=f"Current owner '{self.nodes[leaf].label}' cannot be traced to ancestor root.",
                            affected_nodes=[leaf],
                            requires_review=True
                        )
                    )

        # 3. Check for disputed edges
        for edge in self.edges:
            if edge.is_disputed:
                anomalies.append(
                    LineageAnomalySchema(
                        anomaly_type="DISPUTED_MUTATION",
                        severity="HIGH",
                        description=f"Mutation transition {edge.mutation_number} between {edge.source} and {edge.target} is disputed.",
                        affected_nodes=[edge.source, edge.target],
                        evidence={"mutation_number": edge.mutation_number},
                        requires_review=True
                    )
                )

        # 4. Check for potential missing co-heirs on inheritance
        for source_id in self.nodes:
            out_edges = [e for e in self.edges if e.source == source_id and e.transition_type == "INHERITANCE"]
            if len(out_edges) == 1:
                source_node = self.nodes[source_id]
                # If ancestor had multiple legal heirs noted in metadata
                known_heirs = source_node.metadata.get("known_heirs_count", 1)
                if known_heirs > 1:
                    anomalies.append(
                        LineageAnomalySchema(
                            anomaly_type="POSSIBLE_MISSING_COHEIR",
                            severity="HIGH",
                            description=f"Ancestor '{source_node.label}' has {known_heirs} recorded heirs, but mutation only names 1 heir.",
                            affected_nodes=[source_id, out_edges[0].target],
                            requires_review=True
                        )
                    )

        return anomalies

    def build_response(self) -> LineageGraphResponse:
        anomalies = self.analyze_anomalies()
        has_disputes = any(e.is_disputed for e in self.edges)
        integrity = "VERIFIED"
        if any(a.severity == "CRITICAL" for a in anomalies):
            integrity = "BROKEN_CHAIN"
        elif anomalies:
            integrity = "REQUIRES_REVIEW"

        return LineageGraphResponse(
            case_id=self.case_id,
            nodes=list(self.nodes.values()),
            edges=self.edges,
            anomalies=anomalies,
            has_disputes=has_disputes,
            integrity_status=integrity
        )
