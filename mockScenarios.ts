// Mock Scenarios for BhoomiVerify Frontend Demo Mode
// Focused exclusively on authentic RURAL agricultural villages of Maharashtra (Gramin Revenue Records)
// Preset A: Hiware Bazar (Ahilyanagar Rural) - Model Village Clean Succession
// Preset B: Palashi (Satara Rural) - Sugarcane Farmland Boundary Overlap
// Preset C: Wadner Gangai (Amravati Rural) - Cotton Belt PACS Loan Lien & Disputed Title

import { CaseDossier, DashboardStats } from '../types';

export const SCENARIO_A: CaseDossier = {
  id: 'case-a-4201',
  case_number: 'BV-2026-MH-4201',
  title: 'Rural Satbara RoR Digitization & Clean Succession (Hiware Bazar)',
  state_code: 'MH',
  state_name: 'Maharashtra',
  district: 'Ahilyanagar',
  taluka: 'Nagar (Rural)',
  village: 'Hiware Bazar',
  survey_number: '142/2',
  claimant_name: 'Balasaheb Tukaram Pawar',
  status: 'APPROVED',
  risk_score: 12,
  risk_band: 'LOW',
  document_type: 'Maharashtra 7/12 (गावं नमुना ७/१२ - अधिकार अभिलेख पत्रक)',
  document_url: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=1200',
  created_at: '2026-03-12T10:15:00Z',
  updated_at: '2026-03-12T11:42:00Z',
  assigned_officer: 'Shri Sanjay V. Raut (Tahsildar Nagar Rural)',
  canonical_record: {
    case_number: 'BV-2026-MH-4201',
    state_code: 'MH',
    state_name: 'Maharashtra',
    district: 'Ahilyanagar',
    taluka: 'Nagar (Rural)',
    village: 'Hiware Bazar',
    survey_number: '142/2',
    subdivision_number: '2',
    ulpin: 'MH27030142000200',
    area_value: 2.350,
    area_unit: 'Hectares',
    area_in_sqm: 23500,
    land_usage: 'Rural Agricultural (Jirayat / Rainfed Farmland - कोरडवाहू शेती)',
    tenure_type: 'Occupant Class I (Bhogavatdar Varg 1 - भोगवटदार वर्ग १)',
    document_type: '7/12 Extract (Record of Rights)',
    owners: [
      {
        name: 'Balasaheb Tukaram Pawar',
        share: '1/1 (Full Share)',
        identifier_type: 'AADHAAR_HASH',
        identifier_hash: '8f7a9...d3b1',
        ownership_nature: 'Sole Inherited Agrarian Landholder',
        father_or_husband_name: 'Tukaram Baburao Pawar'
      }
    ],
    mutations: [
      {
        mutation_number: 'M-514',
        date: '2019-06-18',
        type: 'Succession / Virasat (वारस नोंद)',
        buyer_or_heir: 'Balasaheb Tukaram Pawar',
        seller_or_deceased: 'Tukaram Baburao Pawar (Deceased)',
        status: 'SANCTIONED',
        remarks: 'Order passed by Naib Tehsildar Nagar Rural; sanctioned after statutory 15-day notice period at Hiware Bazar Gram Chawdi'
      },
      {
        mutation_number: 'M-208',
        date: '1988-02-14',
        type: 'Ancestral Partition (कुटुंब वाटप)',
        buyer_or_heir: 'Tukaram Baburao Pawar',
        seller_or_deceased: 'Baburao Mahadev Pawar',
        status: 'SANCTIONED',
        remarks: 'Ancestral farmland partition sanctioned under Section 85 of Maharashtra Land Revenue Code 1966'
      }
    ],
    encumbrances: [],
    normalized_at: '2026-03-12T10:15:30Z',
    raw_data_hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    source_portal: 'MahaBhulekh (https://bhulekh.mahabhumi.gov.in)'
  },
  extracted_fields: [
    {
      id: 'f1',
      key: 'village_name',
      label: 'Village Name (गाव)',
      rawValue: 'हिवरे बाजार',
      normalizedValue: 'Hiware Bazar',
      indicOriginal: 'हिवरे बाजार',
      confidence: 0.99,
      bbox: { x: 12, y: 14, width: 22, height: 5 },
      status: 'CONFIRMED'
    },
    {
      id: 'f2',
      key: 'taluka_name',
      label: 'Taluka / Tehsil (तालुका)',
      rawValue: 'नगर (ग्रामीण)',
      normalizedValue: 'Nagar (Rural)',
      indicOriginal: 'नगर (ग्रामीण)',
      confidence: 0.99,
      bbox: { x: 38, y: 14, width: 20, height: 5 },
      status: 'CONFIRMED'
    },
    {
      id: 'f3',
      key: 'district_name',
      label: 'District (जिल्हा)',
      rawValue: 'अहिल्यानगर',
      normalizedValue: 'Ahilyanagar',
      indicOriginal: 'अहिल्यानगर',
      confidence: 0.98,
      bbox: { x: 62, y: 14, width: 20, height: 5 },
      status: 'CONFIRMED'
    },
    {
      id: 'f4',
      key: 'survey_number',
      label: 'Gat / Survey Number (गट क्रमांक)',
      rawValue: '१४२/२',
      normalizedValue: '142/2',
      indicOriginal: '१४२/२',
      confidence: 0.99,
      bbox: { x: 12, y: 22, width: 18, height: 6 },
      status: 'CONFIRMED'
    },
    {
      id: 'f5',
      key: 'khata_number',
      label: 'Khata Number (खाते क्रमांक)',
      rawValue: '४१८',
      normalizedValue: '418',
      indicOriginal: '४१८',
      confidence: 0.97,
      bbox: { x: 32, y: 22, width: 15, height: 6 },
      status: 'CONFIRMED'
    },
    {
      id: 'f6',
      key: 'primary_owner',
      label: 'Khatedar / Cultivator (खातेदाराचे नाव)',
      rawValue: 'बाळासाहेब तुकाराम पवार',
      normalizedValue: 'Balasaheb Tukaram Pawar',
      indicOriginal: 'बाळासाहेब तुकाराम पवार',
      confidence: 0.98,
      bbox: { x: 12, y: 30, width: 35, height: 6 },
      status: 'CONFIRMED'
    },
    {
      id: 'f7',
      key: 'father_name',
      label: 'Father / Ancestor (वडिलांचे नाव)',
      rawValue: 'तुकाराम बाबुराव पवार',
      normalizedValue: 'Tukaram Baburao Pawar',
      indicOriginal: 'तुकाराम बाबुराव पवार',
      confidence: 0.96,
      bbox: { x: 50, y: 30, width: 35, height: 6 },
      status: 'CONFIRMED'
    },
    {
      id: 'f8',
      key: 'total_area',
      label: 'Cultivable Area (एकूण शेती क्षेत्र)',
      rawValue: '२ हे. ३५ आर (२३५०० चौ.मी.)',
      normalizedValue: '2.350 Hectares (5 Acres 32 Gunthas)',
      indicOriginal: '२ हे. ३५ आर',
      confidence: 0.98,
      bbox: { x: 12, y: 38, width: 25, height: 6 },
      status: 'CONFIRMED'
    },
    {
      id: 'f9',
      key: 'land_assessment',
      label: 'Land Revenue Assessment (जुमला आकारणी)',
      rawValue: 'रु. १४.५०',
      normalizedValue: 'INR 14.50',
      indicOriginal: 'रु. १४.५०',
      confidence: 0.95,
      bbox: { x: 40, y: 38, width: 20, height: 6 },
      status: 'CONFIRMED'
    },
    {
      id: 'f10',
      key: 'crop_pahani',
      label: 'Crop Pahani (पीक पाहणी नोंदणी)',
      rawValue: 'बाजरी (१.२० हे.), कांदा (०.८० हे.), हरभरा (०.३५ हे.)',
      normalizedValue: 'Bajra 1.20 Ha (Kharif), Onion 0.80 Ha (Rabi), Gram 0.35 Ha',
      indicOriginal: 'बाजरी, कांदा, हरभरा',
      confidence: 0.94,
      bbox: { x: 12, y: 46, width: 65, height: 6 },
      status: 'CONFIRMED'
    },
    {
      id: 'f11',
      key: 'water_source',
      label: 'Irrigation Source (पाणी पुरवठा)',
      rawValue: 'शेततळे व विहीर (Dug Well & Farm Pond)',
      normalizedValue: 'Farm Pond & Dug Well (Organic Watershed)',
      indicOriginal: 'शेततळे व विहीर',
      confidence: 0.93,
      bbox: { x: 12, y: 54, width: 50, height: 6 },
      status: 'CONFIRMED'
    },
    {
      id: 'f12',
      key: 'last_mutation',
      label: 'Sanctioned Mutation (मंजूर फेरफार)',
      rawValue: 'फेरफार क्र. ५१४ (वारस नोंद)',
      normalizedValue: 'Mutation M-514 (Succession / Virasat)',
      indicOriginal: 'फेरफार क्र. ५१४',
      confidence: 0.98,
      bbox: { x: 12, y: 62, width: 45, height: 6 },
      status: 'CONFIRMED'
    }
  ],
  corrections: [],
  risk_evaluation: {
    risk_score: 12,
    risk_band: 'LOW',
    summary: 'Clear title and undisputed succession confirmed for rural agricultural land in Hiware Bazar.',
    recommendations: ['Proceed with automated certification and e-Chawdi ledger seal.'],
    evaluated_at: '2026-03-12T10:15:30Z',
    factors: [
      {
        factor: 'IDENTITY_VALIDATION',
        name: 'UIDAI Aadhaar Khatedar Linkage',
        weight: 0.20,
        score: 10,
        status: 'PASS',
        description: 'Biometric cryptographic verification matched claimant against rural census registry.',
        evidence: ['Aadhaar SHA-256 hash match: 8f7a9...d3b1', 'Name phonetically aligned: Balasaheb Tukaram Pawar']
      },
      {
        factor: 'LINEAGE_CONTINUITY',
        name: 'Vansh-Vruksha Genealogical Integrity',
        weight: 0.25,
        score: 5,
        status: 'PASS',
        description: 'Complete unbroken chain of succession from ancestral partition (1988) to Virasat (2019).',
        evidence: ['Deceased father Tukaram Baburao Pawar death certificate verified', 'No unrecorded heirs or missing partition branches']
      },
      {
        factor: 'MUTATION_TRACEABILITY',
        name: 'E-Chawdi Mutation Register Validation',
        weight: 0.20,
        score: 8,
        status: 'PASS',
        description: 'Sanctioned mutation M-514 is cryptographically sealed in Hiware Bazar e-Chawdi register.',
        evidence: ['15-day statutory objection period completed with zero civil caveats', 'Sanctioning authority: Naib Tehsildar Nagar Rural']
      },
      {
        factor: 'ENCUMBRANCE_STATUS',
        name: 'Rural Bank Loans & PACS Mortgages',
        weight: 0.15,
        score: 0,
        status: 'PASS',
        description: 'Sub-Registrar Index-II and District Central Cooperative Bank confirm unencumbered agricultural land.',
        evidence: ['No active crop loan mortgage', 'Clear Title Certificate issued by Gram Talathi']
      },
      {
        factor: 'GIS_SPATIAL_DISCREPANCY',
        name: 'Cadastral Boundary & Farm Bund Survey',
        weight: 0.20,
        score: 14,
        status: 'PASS',
        description: 'Spatial deviation is -0.38%, strictly below statutory tolerance ceiling of 1.50%.',
        evidence: [
          'Documented Area: 23,500.00 sq.m (2.350 Hectares)',
          'Digitized Cadastral Polygon Area: 23,410.50 sq.m',
          'Delta: -89.50 sq.m (-0.38%) within permissible limits'
        ]
      }
    ]
  },
  gis_data: {
    parcel_id: 'MH-AHIL-NGR-142-2',
    survey_number: '142/2',
    state_code: 'MH',
    district: 'Ahilyanagar',
    taluka: 'Nagar (Rural)',
    village: 'Hiware Bazar',
    area_hectares: 2.341,
    coordinates: [19.0683, 74.8872],
    geojson: {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {
            parcel_id: 'MH-AHIL-NGR-142-2',
            survey_number: '142/2',
            owner: 'Balasaheb Tukaram Pawar',
            fillColor: '#10b981',
            status: 'VALID'
          },
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [74.886472, 19.067608],
                [74.887928, 19.067608],
                [74.887928, 19.068992],
                [74.886472, 19.068992],
                [74.886472, 19.067608]
              ]
            ]
          }
        },
        {
          type: 'Feature',
          properties: {
            parcel_id: 'MH-AHIL-NGR-142-3',
            survey_number: '142/3 (Adjoining Farmland)',
            owner: 'Namdeo Bhikaji Zaware',
            fillColor: '#94a3b8',
            status: 'NEIGHBOR'
          },
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [74.887928, 19.067608],
                [74.889385, 19.067608],
                [74.889385, 19.068992],
                [74.887928, 19.068992],
                [74.887928, 19.067608]
              ]
            ]
          }
        }
      ]
    },
    adjacent_parcels: [
      { parcel_id: 'MH-AHIL-NGR-142-3', survey_number: '142/3', shared_boundary_meters: 153.3 },
      { parcel_id: 'MH-AHIL-NGR-141', survey_number: '141', shared_boundary_meters: 120.5 },
      { parcel_id: 'MH-AHIL-NGR-143', survey_number: '143', shared_boundary_meters: 140.2 }
    ],
    discrepancy: {
      parcel_id: 'MH-AHIL-NGR-142-2',
      documented_area_sqm: 23500,
      geometry_area_sqm: 23500.0,
      deviation_percentage: 0.00,
      tolerance_threshold_pct: 1.5,
      exceeds_tolerance: false,
      status: 'WITHIN_TOLERANCE',
      message: 'Spatial polygon area (23,500.0 sq.m) precisely matches legal 7/12 area records.'
    },
    overlap: {
      parcel_id: 'MH-AHIL-NGR-142-2',
      has_overlap: false,
      overlapping_parcels: [],
      message: 'No boundary overlap or encroachment detected along agricultural farm bunds.'
    }
  },
  lineage_graph: {
    nodes: [
      {
        id: 'node-anc-1',
        label: 'Baburao Mahadev Pawar (Patriarch, Deceased 1988)',
        generation: 1,
        status: 'VALID',
        transfer_type: 'Ancestral Baseline',
        year: 1988
      },
      {
        id: 'node-anc-2',
        label: 'Tukaram Baburao Pawar (Father, Deceased 2019)',
        generation: 2,
        status: 'VALID',
        transfer_type: 'Partition Deed',
        mutation_id: 'M-208',
        year: 1988
      },
      {
        id: 'node-cur-1',
        label: 'Balasaheb Tukaram Pawar (Current Khatedar)',
        generation: 3,
        status: 'VALID',
        transfer_type: 'Succession (Virasat)',
        mutation_id: 'M-514',
        year: 2019,
        area_transferred: '2.350 Hectares',
        is_current_claimant: true
      },
      {
        id: 'node-joint-1',
        label: 'Sunita Balasaheb Pawar (Joint Registered Nominee)',
        generation: 3,
        status: 'VALID',
        transfer_type: 'Family Endorsement',
        year: 2021
      }
    ],
    edges: [
      {
        id: 'edge-1-2',
        source: 'node-anc-1',
        target: 'node-anc-2',
        transfer_type: 'Ancestral Partition (कुटुंब वाटप)',
        date: '1988-02-14',
        mutation_number: 'M-208'
      },
      {
        id: 'edge-2-3',
        source: 'node-anc-2',
        target: 'node-cur-1',
        transfer_type: 'Succession / Virasat (वारस नोंद)',
        date: '2019-06-18',
        mutation_number: 'M-514'
      },
      {
        id: 'edge-3-4',
        source: 'node-cur-1',
        target: 'node-joint-1',
        transfer_type: 'Joint Spousal Title Endorsement',
        date: '2021-04-10'
      }
    ],
    anomalies: []
  },
  ledger_blocks: [
    {
      block_height: 1,
      block_hash: '9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b',
      previous_hash: '0000000000000000000000000000000000000000000000000000000000000000',
      event_type: 'INGEST_VILLAGE_712',
      timestamp: '2026-03-12T10:15:00Z',
      payload: { document_hash: 'e3b0c442...', case_number: 'BV-2026-MH-4201', village: 'Hiware Bazar' },
      merkle_root: '9a8b7c...6d5e',
      is_valid: true
    },
    {
      block_height: 2,
      block_hash: '1f2e3d4c5b6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c',
      previous_hash: '9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b',
      event_type: 'OCR_EXTRACTION_VERIFIED',
      timestamp: '2026-03-12T10:30:00Z',
      payload: { extracted_fields_count: 12, mean_confidence: 0.98, actor: 'Talathi Chawdi Officer' },
      merkle_root: '1f2e3d...4c5b',
      is_valid: true
    },
    {
      block_height: 3,
      block_hash: '8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a0f9e8d7c',
      previous_hash: '1f2e3d4c5b6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c',
      event_type: 'CADASTRE_SPATIAL_ALIGNMENT',
      timestamp: '2026-03-12T11:00:00Z',
      payload: { deviation_pct: -0.38, tolerance_ok: true, engine: 'BhuNaksha GIS Engine' },
      merkle_root: '8d7c6b...5a4f',
      is_valid: true
    },
    {
      block_height: 4,
      block_hash: '4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b',
      previous_hash: '8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a0f9e8d7c',
      event_type: 'OFFICER_APPROVAL_ISSUED',
      timestamp: '2026-03-12T11:42:00Z',
      payload: { decision: 'APPROVED', digital_token: 'MH-REV-2026-CERT-9941', officer: 'Shri Sanjay V. Raut (Tahsildar Nagar Rural)' },
      merkle_root: '4a5b6c...7d8e',
      is_valid: true
    }
  ]
};

export const SCENARIO_B: CaseDossier = {
  id: 'case-b-1080',
  case_number: 'BV-2026-MH-1080',
  title: 'Rural Agricultural Boundary Overlap & Farm Bund Discrepancy (Palashi)',
  state_code: 'MH',
  state_name: 'Maharashtra',
  district: 'Satara',
  taluka: 'Koregaon',
  village: 'Palashi',
  survey_number: '215/1',
  claimant_name: 'Suresh Babanrao Kadam',
  status: 'FLAGGED_FOR_OFFICER',
  risk_score: 68,
  risk_band: 'HIGH',
  document_type: 'Maharashtra 7/12 & Cadastral Tippan',
  document_url: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&q=80&w=1200',
  created_at: '2026-03-14T08:30:00Z',
  updated_at: '2026-03-14T09:45:00Z',
  assigned_officer: 'Shri Arvind G. Jagtap (Sub-Divisional Officer Koregaon)',
  canonical_record: {
    case_number: 'BV-2026-MH-1080',
    state_code: 'MH',
    state_name: 'Maharashtra',
    district: 'Satara',
    taluka: 'Koregaon',
    village: 'Palashi',
    survey_number: '215/1',
    subdivision_number: '1',
    ulpin: 'MH25010021500001',
    area_value: 0.0400,
    area_unit: 'Hectares (400 sq.m / 4 Gunthas / ४ आर)',
    area_in_sqm: 400,
    land_usage: 'Rural Agricultural (Palashi Bagayat Farmland / बागायत शेती)',
    tenure_type: 'Occupant Class I (Bhogavatdar Varg 1)',
    document_type: '7/12 RoR & Cadastral Map',
    owners: [
      {
        name: 'Suresh Babanrao Kadam',
        share: '1/1',
        identifier_type: 'PAN_CARD',
        identifier_hash: '3c4d5...8e9f',
        ownership_nature: 'Sole Agricultural Cultivator',
        father_or_husband_name: 'Babanrao Shankar Kadam'
      }
    ],
    mutations: [
      {
        mutation_number: 'M-1042',
        date: '2022-09-05',
        type: 'Succession (वारस नोंद)',
        buyer_or_heir: 'Suresh Babanrao Kadam',
        seller_or_deceased: 'Babanrao Shankar Kadam (Deceased)',
        status: 'SANCTIONED',
        remarks: 'Succession sanctioned; co-heir objection pending in Koregaon Revenue Court'
      }
    ],
    encumbrances: [],
    normalized_at: '2026-03-14T08:31:15Z',
    raw_data_hash: 'fa39487c92b8d4e78f9021c3b54e76a9...',
    source_portal: 'MahaBhulekh'
  },
  extracted_fields: [
    {
      id: 'fb1',
      key: 'village_name',
      label: 'Village Name (गाव)',
      rawValue: 'पळशी',
      normalizedValue: 'Palashi',
      indicOriginal: 'पळशी',
      confidence: 0.98,
      bbox: { x: 12, y: 14, width: 22, height: 5 },
      status: 'CONFIRMED'
    },
    {
      id: 'fb2',
      key: 'taluka_name',
      label: 'Taluka / Tehsil (तालुका)',
      rawValue: 'कोरेगाव',
      normalizedValue: 'Koregaon',
      indicOriginal: 'कोरेगाव',
      confidence: 0.99,
      bbox: { x: 38, y: 14, width: 20, height: 5 },
      status: 'CONFIRMED'
    },
    {
      id: 'fb3',
      key: 'district_name',
      label: 'District (जिल्हा)',
      rawValue: 'सातारा',
      normalizedValue: 'Satara',
      indicOriginal: 'सातारा',
      confidence: 0.99,
      bbox: { x: 62, y: 14, width: 20, height: 5 },
      status: 'CONFIRMED'
    },
    {
      id: 'fb4',
      key: 'survey_number',
      label: 'Gat / Survey Number (गट क्रमांक)',
      rawValue: '२१५/१',
      normalizedValue: '215/1',
      indicOriginal: '२१५/१',
      confidence: 0.98,
      bbox: { x: 12, y: 22, width: 18, height: 6 },
      status: 'CONFIRMED'
    },
    {
      id: 'fb5',
      key: 'total_area',
      label: 'Documented Area (नोंदणीकृत क्षेत्र)',
      rawValue: '४ आर (४०० चौ.मी.)',
      normalizedValue: '0.0400 Hectares (400 sq.m / 4 Gunthas)',
      indicOriginal: '४ आर',
      confidence: 0.99,
      bbox: { x: 12, y: 38, width: 25, height: 6 },
      status: 'CONFIRMED'
    },
    {
      id: 'fb6',
      key: 'crop_pahani',
      label: 'Crop Cultivation (पीक पाहणी)',
      rawValue: 'ऊस (४ आर)',
      normalizedValue: 'Sugarcane 0.04 Ha (400 sq.m)',
      indicOriginal: 'ऊस',
      confidence: 0.95,
      bbox: { x: 12, y: 46, width: 50, height: 6 },
      status: 'CONFIRMED'
    }
  ],
  corrections: [],
  risk_evaluation: {
    risk_score: 28,
    risk_band: 'LOW',
    summary: 'Cadastral boundary and area (400 sq.m) match 7/12 records with 100% precision. Co-heir succession notice pending in Koregaon Revenue Court.',
    recommendations: ['Proceed with mutation certification subject to resolving sibling succession caveat.'],
    evaluated_at: '2026-03-14T08:32:00Z',
    factors: [
      {
        factor: 'IDENTITY_VALIDATION',
        name: 'Landholder Identity Integrity',
        weight: 0.20,
        score: 15,
        status: 'PASS',
        description: 'Identity confirmed via PAN & Voter ID record.',
        evidence: ['Farmer PAN verified']
      },
      {
        factor: 'LINEAGE_CONTINUITY',
        name: 'Vansh-Vruksha Succession Completeness',
        weight: 0.25,
        score: 45,
        status: 'WARNING',
        description: 'Notice of contest filed by sibling regarding ancestral sugarcane share.',
        evidence: ['Pending caveat filed by Nitin Babanrao Kadam at Koregaon Tahsil']
      },
      {
        factor: 'MUTATION_TRACEABILITY',
        name: 'Mutation Notice & Entry Traceability',
        weight: 0.20,
        score: 25,
        status: 'PASS',
        description: 'Mutation M-1042 entered but requires joint inquiry.',
        evidence: ['Mutation sanctioned subject to joint survey']
      },
      {
        factor: 'ENCUMBRANCE_STATUS',
        name: 'Financial Liens & Crop Loans',
        weight: 0.15,
        score: 10,
        status: 'PASS',
        description: 'Koregaon Taluka Sahakari Bank crop loan active and regularized.',
        evidence: ['Crop hypothecation Rs 1,80,000 active']
      },
      {
        factor: 'GIS_SPATIAL_DISCREPANCY',
        name: 'Cadastral Boundary Metes & Bounds Conformity',
        weight: 0.20,
        score: 85,
        status: 'FAIL',
        description: 'Critical boundary overlap detected: 68.5 sq.m (17.1%) encroachment collision with adjoining Gat 215/2 along eastern farm bund.',
        evidence: [
          'Documented RoR Area: 400.0 sq.m (0.0400 Ha / 4 Gunthas)',
          'Mapped Polygon Area: 400.0 sq.m (20.0m x 20.0m, Perimeter 79.8m)',
          'Spatial Overlap with Gat 215/2: 68.5 sq.m (17.1% boundary collision)',
          'Dispute Status: Active boundary conflict with Patil family (Gat 215/2) pending TILR joint measurement'
        ]
      }
    ]
  },
  gis_data: {
    parcel_id: 'MH-SAT-KOR-215-1',
    survey_number: '215/1',
    state_code: 'MH',
    district: 'Satara',
    taluka: 'Koregaon',
    village: 'Palashi',
    area_hectares: 0.0400,
    coordinates: [17.7015, 74.1750],
    geojson: {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {
            parcel_id: 'MH-SAT-KOR-215-1',
            survey_number: '215/1',
            owner: 'Suresh Babanrao Kadam',
            fillColor: '#10b981',
            status: 'VALID'
          },
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [74.174906, 17.701410],
                [74.175094, 17.701410],
                [74.175094, 17.701590],
                [74.174906, 17.701590],
                [74.174906, 17.701410]
              ]
            ]
          }
        },
        {
          type: 'Feature',
          properties: {
            parcel_id: 'MH-SAT-KOR-215-2',
            survey_number: '215/2 (Adjoining Claimant: Patil)',
            owner: 'Dattatray Anandrao Patil',
            fillColor: '#94a3b8',
            status: 'NEIGHBOR'
          },
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [74.175032, 17.701410],
                [74.175282, 17.701410],
                [74.175282, 17.701590],
                [74.175032, 17.701590],
                [74.175032, 17.701410]
              ]
            ]
          }
        },
        {
          type: 'Feature',
          properties: {
            parcel_id: 'OVERLAP-215-1-2',
            survey_number: 'Disputed Overlap Zone (215/1 ∩ 215/2)',
            owner: 'Boundary Encroachment Zone (अतिक्रमित क्षेत्र)',
            fillColor: '#dc2626',
            status: 'OVERLAP',
            overlap_area_sqm: 68.5
          },
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [74.175032, 17.701410],
                [74.175094, 17.701410],
                [74.175094, 17.701590],
                [74.175032, 17.701590],
                [74.175032, 17.701410]
              ]
            ]
          }
        }
      ]
    },
    adjacent_parcels: [
      { parcel_id: 'MH-SAT-KOR-215-2', survey_number: '215/2', shared_boundary_meters: 20.0 }
    ],
    discrepancy: {
      parcel_id: 'MH-SAT-KOR-215-1',
      documented_area_sqm: 400,
      geometry_area_sqm: 400.0,
      deviation_percentage: 0.00,
      tolerance_threshold_pct: 1.5,
      exceeds_tolerance: false,
      status: 'MAJOR_DISCREPANCY',
      message: 'Spatial polygon area (400.0 sq.m) matches RoR, but active boundary overlap of 68.5 sq.m (17.1%) is detected along the eastern boundary.'
    },
    overlap: {
      parcel_id: 'MH-SAT-KOR-215-1',
      has_overlap: true,
      overlapping_parcels: [
        {
          parcel_id: 'MH-SAT-KOR-215-2',
          survey_number: '215/2 (Adjoining Claimant: Dattatray Patil)',
          overlap_area_sqm: 68.5,
          overlap_percentage: 17.1
        }
      ],
      message: 'CRITICAL DISPUTE: Encroachment / boundary collision detected. Physical sugarcane farm bund shifted 3.4m westward; adjoining Gat 215/2 overlaps 68.5 sq.m (17.1%) onto Gat 215/1.'
    }
  },
  lineage_graph: {
    nodes: [
      {
        id: 'node-b-1',
        label: 'Babanrao Shankar Kadam (Father, Deceased)',
        generation: 1,
        status: 'VALID',
        transfer_type: 'Original Landholder'
      },
      {
        id: 'node-b-2',
        label: 'Suresh Babanrao Kadam (Claimant / Elder Son)',
        generation: 2,
        status: 'DISPUTED',
        transfer_type: 'Contested Succession',
        mutation_id: 'M-1042',
        is_current_claimant: true
      },
      {
        id: 'node-b-3',
        label: 'Nitin Babanrao Kadam (Sibling / Omitted Co-heir)',
        generation: 2,
        status: 'MISSING_HEIR',
        transfer_type: 'Statutory Claim'
      }
    ],
    edges: [
      {
        id: 'edge-b-1-2',
        source: 'node-b-1',
        target: 'node-b-2',
        transfer_type: 'Contested Succession (वारस नोंद)',
        date: '2022-09-05',
        mutation_number: 'M-1042'
      }
    ],
    anomalies: [
      {
        anomaly_type: 'MISSING_BRANCH',
        description: 'Co-heir Nitin Babanrao Kadam omitted from registered 7/12 succession entry.',
        severity: 'HIGH',
        affected_nodes: ['node-b-3']
      }
    ]
  },
  ledger_blocks: [
    {
      block_height: 1,
      block_hash: 'fa39487c92b8d4e78f9021c3b54e76a91b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e',
      previous_hash: '0000000000000000000000000000000000000000000000000000000000000000',
      event_type: 'INGEST_SATBARA_RECORD',
      timestamp: '2026-03-14T08:30:00Z',
      payload: { document_hash: 'fa39487...', case_number: 'BV-2026-MH-1080', village: 'Palashi' },
      merkle_root: '3b4c5d...6e7f',
      is_valid: true
    },
    {
      block_height: 2,
      block_hash: '5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f',
      previous_hash: 'fa39487c92b8d4e78f9021c3b54e76a91b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e',
      event_type: 'SPATIAL_ENCROACHMENT_FLAGGED',
      timestamp: '2026-03-14T09:15:00Z',
      payload: { overlap_pct: 14.2, affected_neighbor: '215/2', actor: 'BhuNaksha GIS Engine' },
      merkle_root: '5e6f7a...8b9c',
      is_valid: true
    }
  ]
};

export const SCENARIO_C: CaseDossier = {
  id: 'case-c-760',
  case_number: 'BV-2026-MH-760',
  title: 'Critical Rural Title Fraud: Active PACS Mortgage Lien & Civil Injunction (Wadner Gangai)',
  state_code: 'MH',
  state_name: 'Maharashtra',
  district: 'Amravati',
  taluka: 'Daryapur',
  village: 'Wadner Gangai',
  survey_number: '76/2',
  claimant_name: 'Rameshwar Govind Deshmukh',
  status: 'REJECTED',
  risk_score: 89,
  risk_band: 'CRITICAL',
  document_type: 'Maharashtra 7/12 & Khasra Register',
  document_url: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&q=80&w=1200',
  created_at: '2026-03-15T14:10:00Z',
  updated_at: '2026-03-15T16:20:00Z',
  assigned_officer: 'Shri Vikram R. More (Sub-Divisional Magistrate Daryapur)',
  canonical_record: {
    case_number: 'BV-2026-MH-760',
    state_code: 'MH',
    state_name: 'Maharashtra',
    district: 'Amravati',
    taluka: 'Daryapur',
    village: 'Wadner Gangai',
    survey_number: '76/2',
    subdivision_number: '2',
    ulpin: 'MH26040007600002',
    area_value: 3.800,
    area_unit: 'Hectares',
    area_in_sqm: 38000,
    land_usage: 'Rural Agricultural (Black Cotton Soil - Cotton & Soybean / काळी कसदार जिरायत शेती)',
    tenure_type: 'Occupant Class I (Bhogavatdar Varg 1)',
    document_type: '7/12 Extract (Record of Rights)',
    owners: [
      {
        name: 'Rameshwar Govind Deshmukh',
        share: '1/1',
        identifier_type: 'AADHAAR_HASH',
        identifier_hash: '1a2b3...4c5d',
        ownership_nature: 'Disputed Single Khatedar Claim',
        father_or_husband_name: 'Govind Narayan Deshmukh'
      }
    ],
    mutations: [
      {
        mutation_number: 'M-789',
        date: '2023-01-10',
        type: 'Purported Gift Deed (बक्षीसपत्र)',
        buyer_or_heir: 'Rameshwar Govind Deshmukh',
        seller_or_deceased: 'Govind Narayan Deshmukh',
        status: 'DISPUTED',
        remarks: 'Gift deed challenged by co-parceners; active status freeze ordered by Daryapur Civil Court'
      }
    ],
    encumbrances: [
      {
        lien_holder: 'Daryapur Taluka Primary Agricultural Cooperative Credit Society (PACS / वि. का. सेवा संस्था)',
        amount_inr: 450000,
        entry_date: '2021-08-14',
        status: 'ACTIVE',
        court_case_ref: 'Civil Suit RCS/142/2024 (Injunction Restraining Alienation)'
      }
    ],
    normalized_at: '2026-03-15T14:12:00Z',
    raw_data_hash: '99887766554433221100aabbccddeeff...',
    source_portal: 'MahaBhulekh'
  },
  extracted_fields: [
    {
      id: 'fc1',
      key: 'village_name',
      label: 'Village Name (गाव)',
      rawValue: 'वडनेर गंगाई',
      normalizedValue: 'Wadner Gangai',
      indicOriginal: 'वडनेर गंगाई',
      confidence: 0.99,
      bbox: { x: 12, y: 14, width: 22, height: 5 },
      status: 'CONFIRMED'
    },
    {
      id: 'fc2',
      key: 'taluka_name',
      label: 'Taluka / Tehsil (तालुका)',
      rawValue: 'दर्यापूर',
      normalizedValue: 'Daryapur',
      indicOriginal: 'दर्यापूर',
      confidence: 0.99,
      bbox: { x: 38, y: 14, width: 20, height: 5 },
      status: 'CONFIRMED'
    },
    {
      id: 'fc3',
      key: 'district_name',
      label: 'District (जिल्हा)',
      rawValue: 'अमरावती',
      normalizedValue: 'Amravati',
      indicOriginal: 'अमरावती',
      confidence: 0.99,
      bbox: { x: 62, y: 14, width: 20, height: 5 },
      status: 'CONFIRMED'
    },
    {
      id: 'fc4',
      key: 'survey_number',
      label: 'Gat / Survey Number (गट क्रमांक)',
      rawValue: '७६/२',
      normalizedValue: '76/2',
      indicOriginal: '७६/२',
      confidence: 0.99,
      bbox: { x: 12, y: 22, width: 18, height: 6 },
      status: 'CONFIRMED'
    },
    {
      id: 'fc5',
      key: 'crop_pahani',
      label: 'Crop Cultivation (पीक पाहणी)',
      rawValue: 'कापूस (२.५० हे.), सोयाबीन (१.३० हे.)',
      normalizedValue: 'Cotton 2.50 Ha, Soybean 1.30 Ha (Black Cotton Soil)',
      indicOriginal: 'कापूस, सोयाबीन',
      confidence: 0.96,
      bbox: { x: 12, y: 46, width: 60, height: 6 },
      status: 'CONFIRMED'
    }
  ],
  corrections: [],
  risk_evaluation: {
    risk_score: 89,
    risk_band: 'CRITICAL',
    summary: 'Critical title breach: Daughter excluded from ancestral property and active PACS agricultural loan mortgage.',
    recommendations: ['Maintain strict registry freeze; notify Daryapur Civil Court and Taluka PACS society.'],
    evaluated_at: '2026-03-15T14:15:00Z',
    factors: [
      {
        factor: 'IDENTITY_VALIDATION',
        name: 'Claimant Title Authenticity',
        weight: 0.20,
        score: 30,
        status: 'PASS',
        description: 'Biometric identity verified but claimant title is subject to lis pendens.',
        evidence: ['Identity verified against Aadhaar']
      },
      {
        factor: 'LINEAGE_CONTINUITY',
        name: 'Vansh-Vruksha Succession Legitimacy',
        weight: 0.25,
        score: 95,
        status: 'FAIL',
        description: 'Fraudulent exclusion of co-heirs on ancestral agrarian land.',
        evidence: ['Two legal daughters excluded in purported gift deed (Section 6 Hindu Succession Act)']
      },
      {
        factor: 'MUTATION_TRACEABILITY',
        name: 'Mutation Integrity & Revenue Order Trace',
        weight: 0.20,
        score: 85,
        status: 'FAIL',
        description: 'Mutation entry M-789 stayed by Sub-Divisional Magistrate Daryapur.',
        evidence: ['Stay order dated 2024-02-12 on record']
      },
      {
        factor: 'ENCUMBRANCE_STATUS',
        name: 'PACS Credit Society Loan & Judicial Injunction',
        weight: 0.15,
        score: 100,
        status: 'FAIL',
        description: 'Active financial charge of INR 4,50,000 to Daryapur Taluka PACS.',
        evidence: ['Active mortgage recorded in Other Rights (इतर हक्क) column', 'Court Stay RCS/142/2024']
      },
      {
        factor: 'GIS_SPATIAL_DISCREPANCY',
        name: 'Cadastral Boundary Conformity',
        weight: 0.20,
        score: 15,
        status: 'PASS',
        description: 'Spatial boundaries conform to village map.',
        evidence: ['Area divergence 0.42% within limits']
      }
    ]
  },
  gis_data: {
    parcel_id: 'MH-AMR-DAR-76-2',
    survey_number: '76/2',
    state_code: 'MH',
    district: 'Amravati',
    taluka: 'Daryapur',
    village: 'Wadner Gangai',
    area_hectares: 3.800,
    coordinates: [20.9520, 77.3480],
    geojson: {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {
            parcel_id: 'MH-AMR-DAR-76-2',
            survey_number: '76/2',
            owner: 'Rameshwar Govind Deshmukh',
            fillColor: '#991b1b',
            status: 'FROZEN'
          },
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [77.347063, 20.951120],
                [77.348937, 20.951120],
                [77.348937, 20.952880],
                [77.347063, 20.952880],
                [77.347063, 20.951120]
              ]
            ]
          }
        }
      ]
    },
    adjacent_parcels: [],
    discrepancy: {
      parcel_id: 'MH-AMR-DAR-76-2',
      documented_area_sqm: 38000,
      geometry_area_sqm: 38000.0,
      deviation_percentage: 0.00,
      tolerance_threshold_pct: 1.5,
      exceeds_tolerance: false,
      status: 'WITHIN_TOLERANCE',
      message: 'Spatial polygon area (38,000.0 sq.m) precisely matches documented revenue register (38,000 sq.m).'
    },
    overlap: {
      parcel_id: 'MH-AMR-DAR-76-2',
      has_overlap: false,
      overlapping_parcels: [],
      message: 'No boundary overlap.'
    }
  },
  lineage_graph: {
    nodes: [
      {
        id: 'node-c-1',
        label: 'Govind Narayan Deshmukh (Patriarch, Deceased)',
        generation: 1,
        status: 'VALID',
        transfer_type: 'Ancestral Baseline'
      },
      {
        id: 'node-c-2',
        label: 'Rameshwar Govind Deshmukh (Claimant Son)',
        generation: 2,
        status: 'DISPUTED',
        transfer_type: 'Challenged Gift Deed',
        mutation_id: 'M-789',
        is_current_claimant: true
      },
      {
        id: 'node-c-3',
        label: 'Anusaya Govind Deshmukh (Daughter / Excluded Co-heir)',
        generation: 2,
        status: 'MISSING_HEIR',
        transfer_type: 'Statutory Coparcener'
      }
    ],
    edges: [
      {
        id: 'edge-c-1-2',
        source: 'node-c-1',
        target: 'node-c-2',
        transfer_type: 'Challenged Gift Deed (बक्षीसपत्र)',
        date: '2023-01-10',
        mutation_number: 'M-789'
      }
    ],
    anomalies: [
      {
        anomaly_type: 'FRAUDULENT_EXCLUSION',
        description: 'Daughter Anusaya Deshmukh unlawfully excluded from ancestral agricultural property.',
        severity: 'CRITICAL',
        affected_nodes: ['node-c-3']
      }
    ]
  },
  ledger_blocks: [
    {
      block_height: 1,
      block_hash: '99887766554433221100aabbccddeeff99887766554433221100aabbccddeeff',
      previous_hash: '0000000000000000000000000000000000000000000000000000000000000000',
      event_type: 'INGEST_SATBARA_RECORD',
      timestamp: '2026-03-15T14:10:00Z',
      payload: { document_hash: '998877...', case_number: 'BV-2026-MH-760', village: 'Wadner Gangai' },
      merkle_root: '112233...4455',
      is_valid: true
    },
    {
      block_height: 2,
      block_hash: '11223344556677889900aabbccddeeff11223344556677889900aabbccddeeff',
      previous_hash: '99887766554433221100aabbccddeeff99887766554433221100aabbccddeeff',
      event_type: 'LEGAL_FREEZE_ISSUED',
      timestamp: '2026-03-15T16:20:00Z',
      payload: { officer: 'Vikram More (SDM)', decision: 'REJECTED_AND_FROZEN', reason: 'Active Court Stay & Excluded Co-heir' },
      merkle_root: '998877...6655',
      is_valid: true
    }
  ]
};

export const MOCK_CASES: CaseDossier[] = [SCENARIO_A, SCENARIO_B, SCENARIO_C];

export const MOCK_DASHBOARD_STATS: DashboardStats = {
  total_digitized: 14892,
  auto_reconciled_count: 12540,
  auto_reconciled_pct: 84.2,
  flagged_for_officer: 2352,
  avg_processing_time_sec: 4.8,
  state_breakdown: [
    { state_code: 'MH', state_name: 'Maharashtra', total: 4210, flagged: 580, verified: 3630 },
    { state_code: 'UP', state_name: 'Uttar Pradesh', total: 3840, flagged: 710, verified: 3130 },
    { state_code: 'KA', state_name: 'Karnataka', total: 2950, flagged: 390, verified: 2560 },
    { state_code: 'GJ', state_name: 'Gujarat', total: 2120, flagged: 290, verified: 1830 },
    { state_code: 'MP', state_name: 'Madhya Pradesh', total: 1772, flagged: 382, verified: 1390 },
  ],
  risk_distribution: [
    { name: 'Low Risk (0-25)', value: 10420, color: '#059669' },
    { name: 'Medium Risk (26-50)', value: 2120, color: '#d97706' },
    { name: 'High Risk (51-75)', value: 1680, color: '#e11d48' },
    { name: 'Critical Risk (76-100)', value: 672, color: '#991b1b' },
  ],
  discrepancy_types: [
    { name: 'Area Deviation (>1.5%)', count: 940 },
    { name: 'Missing Succession Link', count: 620 },
    { name: 'Unresolved Bank Lien', count: 480 },
    { name: 'Name Transliteration Mismatch', count: 312 },
  ]
};
