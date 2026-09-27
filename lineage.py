from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field


class LineageNodeSchema(BaseModel):
    id: str
    label: str  # Owner / Transferor / Transferee name
    node_type: str  # ANCESTOR, DECEASED, CURRENT_OWNER, CO_HEIR, BUYER, INSTITUTION
    generation: int = 0
    gender: Optional[str] = None
    share: Optional[str] = None
    deceased: bool = False
    metadata: Dict[str, Any] = Field(default_factory=dict)


class LineageEdgeSchema(BaseModel):
    source: str
    target: str
    transition_type: str  # INHERITANCE, PARTITION, SALE, GIFT, SUCCESSION, MUTATION, TRANSFER, MORTGAGE
    mutation_number: Optional[str] = None
    mutation_date: Optional[str] = None
    order_details: Optional[str] = None
    is_disputed: bool = False


class LineageAnomalySchema(BaseModel):
    anomaly_type: str  # MISSING_LINEAGE_LINK, DUPLICATE_MUTATION, POSSIBLE_MISSING_COHEIR, DISPUTED_MUTATION, UNEXPLAINED_TRANSFER
    severity: str  # MEDIUM, HIGH, CRITICAL
    description: str
    affected_nodes: List[str] = Field(default_factory=list)
    evidence: Dict[str, Any] = Field(default_factory=dict)
    requires_review: bool = True


class LineageGraphResponse(BaseModel):
    case_id: str
    nodes: List[LineageNodeSchema] = Field(default_factory=list)
    edges: List[LineageEdgeSchema] = Field(default_factory=list)
    anomalies: List[LineageAnomalySchema] = Field(default_factory=list)
    has_disputes: bool = False
    integrity_status: str  # VERIFIED, REQUIRES_REVIEW, BROKEN_CHAIN
