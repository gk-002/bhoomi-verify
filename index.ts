// BhoomiVerify Core TypeScript Type Definitions
// Aligned strictly with FastAPI Backend Schemas

export type RiskBand = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type CaseStatus = 
  | 'PENDING'
  | 'IN_PROGRESS'
  | 'AUTO_RECONCILED'
  | 'FLAGGED_FOR_OFFICER'
  | 'APPROVED'
  | 'REJECTED'
  | 'NEEDS_CLERICAL_CORRECTION';

export type OfficerActionType = 
  | 'INSPECT'
  | 'FLAG'
  | 'CLEAR'
  | 'APPROVE'
  | 'FLAG_FOR_INSPECTION'
  | 'REJECT'
  | 'REQUEST_CLERICAL';

export interface AuthUser {
  id: string;
  username: string;
  fullName: string;
  role: 'OFFICER' | 'CITIZEN';
  designation: string;
  caseNumber?: string;
  token?: string;
}

export interface Owner {
  name: string;
  share?: string;
  identifier_type?: string;
  identifier_hash?: string;
  ownership_nature?: string;
  father_or_husband_name?: string;
}

export interface Mutation {
  mutation_number: string;
  date?: string;
  type: string; // e.g. 'Inheritance (Virasat)', 'Sale Deed', 'Partition'
  buyer_or_heir: string;
  seller_or_deceased?: string;
  status: 'SANCTIONED' | 'DISPUTED' | 'PENDING' | 'REJECTED';
  remarks?: string;
}

export interface Encumbrance {
  lien_holder: string; // e.g., 'Bank of Maharashtra'
  amount_inr?: number;
  entry_date: string;
  status: 'ACTIVE' | 'RELEASED' | 'LITIGATION';
  court_case_ref?: string;
}

export interface ExtractedField {
  id: string;
  key: string;
  label: string;
  rawValue: string;
  normalizedValue: string;
  confidence: number; // 0.0 - 1.0
  indicOriginal?: string; // Text in Marathi/Hindi/Kannada
  bbox?: { x: number; y: number; width: number; height: number }; // normalized 0-100%
  status: 'CONFIRMED' | 'FLAGGED' | 'MANUALLY_EDITED';
}

export interface CanonicalLandRecord {
  case_number: string;
  state_code: string;
  state_name: string;
  district: string;
  taluka: string;
  village: string;
  survey_number: string;
  subdivision_number?: string;
  ulpin?: string;
  area_value: number;
  area_unit: string;
  area_in_sqm: number;
  land_usage: string;
  tenure_type: string;
  document_type: string;
  owners: Owner[];
  co_owners?: Owner[];
  mutations: Mutation[];
  encumbrances: Encumbrance[];
  normalized_at: string;
  raw_data_hash: string;
  source_portal: string;
}

export interface RiskFactor {
  factor: string;
  name: string;
  weight: number;
  score: number; // 0-100
  status: 'PASS' | 'WARNING' | 'FAIL';
  description: string;
  evidence: string[];
}

export interface RiskEvaluation {
  risk_score: number; // 0-100
  risk_band: RiskBand;
  factors: RiskFactor[];
  summary: string;
  recommendations: string[];
  evaluated_at: string;
}

export interface SpatialDiscrepancy {
  parcel_id: string;
  documented_area_sqm: number;
  geometry_area_sqm: number;
  deviation_percentage: number;
  tolerance_threshold_pct: number;
  exceeds_tolerance: boolean;
  status: 'WITHIN_TOLERANCE' | 'MARGINAL_EXCESS' | 'MAJOR_DISCREPANCY';
  message: string;
}

export interface OverlappingParcel {
  parcel_id: string;
  survey_number: string;
  overlap_area_sqm: number;
  overlap_percentage: number;
}

export interface SpatialOverlap {
  parcel_id: string;
  has_overlap: boolean;
  overlapping_parcels: OverlappingParcel[];
  message: string;
}

export interface ParcelGISData {
  parcel_id: string;
  survey_number: string;
  state_code: string;
  district: string;
  taluka: string;
  village: string;
  area_hectares: number;
  coordinates: [number, number]; // Center Lat, Lng
  geojson: any; // GeoJSON Feature or FeatureCollection
  adjacent_parcels: Array<{
    parcel_id: string;
    survey_number: string;
    shared_boundary_meters: number;
  }>;
  discrepancy: SpatialDiscrepancy;
  overlap: SpatialOverlap;
}

export interface LineageNode {
  id: string;
  label: string;
  generation: number;
  status: 'VALID' | 'DISPUTED' | 'MISSING_HEIR' | 'PENDING';
  transfer_type?: string;
  mutation_id?: string;
  year?: number;
  area_transferred?: string;
  is_current_claimant?: boolean;
}

export interface LineageEdge {
  id: string;
  source: string;
  target: string;
  transfer_type: string;
  date?: string;
  mutation_number?: string;
  deed_ref?: string;
}

export interface LineageAnomaly {
  anomaly_type: string;
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  affected_nodes: string[];
}

export interface LineageGraph {
  nodes: LineageNode[];
  edges: LineageEdge[];
  anomalies: LineageAnomaly[];
}

export interface LedgerBlock {
  block_height: number;
  block_hash: string;
  previous_hash: string;
  event_type: string;
  timestamp: string;
  payload: Record<string, any>;
  merkle_root: string;
  is_valid: boolean;
}

export interface FieldCorrectionRecord {
  id: string;
  case_number: string;
  field_name: string;
  field_label: string;
  old_value: string;
  new_value: string;
  reason: string;
  officer_name: string;
  officer_role: string;
  timestamp: string;
  status: 'ACCEPTED' | 'PENDING' | 'REJECTED';
}

export interface CaseDossier {
  id: string;
  case_number: string;
  title: string;
  state_code: string;
  state_name: string;
  district: string;
  taluka: string;
  village: string;
  survey_number: string;
  claimant_name: string;
  status: CaseStatus;
  risk_score: number;
  risk_band: RiskBand;
  document_type: string;
  document_url: string;
  created_at: string;
  updated_at: string;
  assigned_officer?: string;
  canonical_record: CanonicalLandRecord;
  extracted_fields: ExtractedField[];
  risk_evaluation: RiskEvaluation;
  gis_data: ParcelGISData;
  lineage_graph: LineageGraph;
  corrections: FieldCorrectionRecord[];
  ledger_blocks: LedgerBlock[];
}

export interface DashboardStats {
  total_digitized: number;
  auto_reconciled_count: number;
  auto_reconciled_pct: number;
  flagged_for_officer: number;
  avg_processing_time_sec: number;
  state_breakdown: Array<{
    state_code: string;
    state_name: string;
    total: number;
    flagged: number;
    verified: number;
  }>;
  risk_distribution: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  discrepancy_types: Array<{
    name: string;
    count: number;
  }>;
}

export interface CitizenTrackResponse {
  case_number: string;
  survey_number: string;
  state_name: string;
  district: string;
  village: string;
  claimant_name: string;
  status: CaseStatus;
  current_step: number; // 1 to 5
  steps: Array<{
    step: number;
    title: string;
    description: string;
    completed: boolean;
    timestamp?: string;
  }>;
  is_certificate_ready: boolean;
  qr_code_hash: string;
}
