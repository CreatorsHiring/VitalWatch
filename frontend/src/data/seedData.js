/**
 * VitalWatch Deterministic Seed Dataset
 * Contains synthetic patients, encounters, bedside devices, historical vital observations,
 * initial alerts, and versioned fictional medication rules.
 */

export const INITIAL_ROLES = [
  { id: 'CARETAKER', name: 'Nurse / Caretaker', title: 'Bedside Caretaker', defaultPage: '/overview' },
  { id: 'RECEPTIONIST', name: 'Receptionist', title: 'Admissions Specialist', defaultPage: '/patients' },
  { id: 'DOCTOR', name: 'Doctor / Clinician', title: 'Attending Physician', defaultPage: '/overview' },
  { id: 'PHARMACIST', name: 'Pharmacist', title: 'Clinical Pharmacist', defaultPage: '/medication-safety' },
  { id: 'ADMIN', name: 'Administrator', title: 'System Admin', defaultPage: '/overview' },
  { id: 'EVALUATOR', name: 'Evaluator / Operator', title: 'Demo Operator', defaultPage: '/monitoring-activity' },
];

export const INITIAL_WARDS = [
  { id: 'WARD-ICU-A', name: 'ICU Ward A', rooms: ['Bed 101', 'Bed 102', 'Bed 103', 'Bed 104'] },
  { id: 'WARD-ICU-B', name: 'ICU Ward B', rooms: ['Bed 201', 'Bed 202', 'Bed 203', 'Bed 204'] },
  { id: 'WARD-STEPDOWN', name: 'Stepdown Ward C', rooms: ['Bed 301', 'Bed 302', 'Bed 303', 'Bed 304'] },
];

export const INITIAL_DEVICES = [
  { id: 'DEV-ICU-001', name: 'Bedside Monitor Alpha', status: 'ACTIVE', battery: 98, lastSeen: new Date().toISOString() },
  { id: 'DEV-ICU-002', name: 'Bedside Monitor Beta', status: 'ACTIVE', battery: 94, lastSeen: new Date().toISOString() },
  { id: 'DEV-ICU-003', name: 'Bedside Monitor Gamma', status: 'ACTIVE', battery: 88, lastSeen: new Date().toISOString() },
  { id: 'DEV-ICU-004', name: 'Bedside Monitor Delta', status: 'STALE', battery: 45, lastSeen: new Date(Date.now() - 360000).toISOString() },
  { id: 'DEV-ICU-005', name: 'Bedside Monitor Epsilon', status: 'ACTIVE', battery: 99, lastSeen: new Date().toISOString() },
  { id: 'DEV-ICU-006', name: 'Bedside Monitor Zeta', status: 'ACTIVE', battery: 91, lastSeen: new Date().toISOString() },
];

// Generate synthetic observations helper
const nowMs = Date.now();
const hourMs = 3600 * 1000;

function generateObsHistory(baseHR, baseSpO2, baseTemp, baseSys, baseDia, anomalyLastHour = false) {
  const points = [];
  for (let i = 24; i >= 0; i--) {
    const timestamp = new Date(nowMs - i * hourMs).toISOString();
    // Simulate missing point at i = 12
    if (i === 12) {
      points.push({
        timestamp,
        hr: null,
        spo2: null,
        temp: null,
        sysBP: null,
        diaBP: null,
        quality: 'MISSING',
      });
      continue;
    }

    let hr = baseHR + Math.floor(Math.sin(i) * 4) + (Math.random() > 0.5 ? 2 : -2);
    let spo2 = baseSpO2 + Math.floor(Math.cos(i) * 1);
    let temp = Number((baseTemp + (Math.random() * 0.4 - 0.2)).toFixed(1));
    let sysBP = baseSys + Math.floor(Math.sin(i * 0.5) * 5);
    let diaBP = baseDia + Math.floor(Math.cos(i * 0.5) * 3);
    let quality = 'VALID';

    // Inject anomaly in recent hour if flagged
    if (anomalyLastHour && i <= 2) {
      hr += 35;
      spo2 -= 5;
      sysBP += 20;
    }

    // Clamp values
    spo2 = Math.min(100, Math.max(70, spo2));

    points.push({
      timestamp,
      hr,
      spo2,
      temp,
      sysBP,
      diaBP,
      quality,
    });
  }
  return points;
}

export const INITIAL_PATIENTS = [
  {
    id: 'PAT-8801',
    mrn: 'MRN-90214',
    name: 'Eleanor Vance',
    age: 68,
    gender: 'Female',
    admissionReason: 'Severe Post-Operative Sepsis Monitoring',
    ward: 'ICU Ward A',
    room: 'Bed 101',
    deviceId: 'DEV-ICU-001',
    careTeam: 'Dr. S. Jenkins (ICU Lead), Nurse M. Davis',
    admissionDate: new Date(Date.now() - 3 * 86400000).toISOString(),
    status: 'CRITICAL',
    vitals: {
      hr: 124,
      spo2: 93,
      temp: 38.6,
      sysBP: 148,
      diaBP: 94,
      timestamp: new Date().toISOString(),
      quality: 'VALID',
    },
    history: {
      allergies: [
        { ingredient: 'alpha-sensitivity', name: 'Alpha Synthetic Compound Sensitivity', severity: 'High', recordedAt: '2025-11-10' }
      ],
      conditions: [
        { code: 'SEPTIC-SHOCK', name: 'Septic Shock (Resolving)', status: 'Active', recordedAt: '2026-10-06' },
        { code: 'HYPERTENSION', name: 'Essential Hypertension', status: 'Active', recordedAt: '2024-03-15' }
      ],
      medications: [
        { code: 'synthetic-vasodilator-v', name: 'Synthetic Vasodilator-V 10mg', status: 'Active', prescribedAt: '2026-10-07' }
      ],
      allergiesHistoryStatus: 'VERIFIED',
    },
    observations: generateObsHistory(115, 94, 38.2, 140, 90, true),
  },
  {
    id: 'PAT-8802',
    mrn: 'MRN-90215',
    name: 'Robert Chen',
    age: 74,
    gender: 'Male',
    admissionReason: 'Post-CABG Hemodynamic Surveillance',
    ward: 'ICU Ward A',
    room: 'Bed 102',
    deviceId: 'DEV-ICU-002',
    careTeam: 'Dr. A. Patel, Nurse R. Torres',
    admissionDate: new Date(Date.now() - 5 * 86400000).toISOString(),
    status: 'STABLE',
    vitals: {
      hr: 76,
      spo2: 98,
      temp: 37.1,
      sysBP: 122,
      diaBP: 78,
      timestamp: new Date().toISOString(),
      quality: 'VALID',
    },
    history: {
      allergies: [],
      conditions: [
        { code: 'CAD-POST-CABG', name: 'Coronary Artery Disease s/p CABG', status: 'Active', recordedAt: '2026-10-04' }
      ],
      medications: [
        { code: 'synthetic-beta-blocker-x', name: 'Synthetic Beta-Blocker X 25mg', status: 'Active', prescribedAt: '2026-10-05' }
      ],
      allergiesHistoryStatus: 'VERIFIED',
    },
    observations: generateObsHistory(74, 98, 37.0, 120, 76, false),
  },
  {
    id: 'PAT-8803',
    mrn: 'MRN-90216',
    name: 'Sarah Miller',
    age: 52,
    gender: 'Female',
    admissionReason: 'Acute Respiratory Failure & Oxygenation Monitoring',
    ward: 'ICU Ward B',
    room: 'Bed 201',
    deviceId: 'DEV-ICU-003',
    careTeam: 'Dr. S. Jenkins, Nurse M. Davis',
    admissionDate: new Date(Date.now() - 2 * 86400000).toISOString(),
    status: 'HIGH_RISK',
    vitals: {
      hr: 104,
      spo2: 89,
      temp: 37.8,
      sysBP: 134,
      diaBP: 86,
      timestamp: new Date().toISOString(),
      quality: 'VALID',
    },
    history: {
      allergies: [],
      conditions: [
        { code: 'ARDS', name: 'Acute Respiratory Distress Syndrome', status: 'Active', recordedAt: '2026-10-07' }
      ],
      medications: [],
      allergiesHistoryStatus: 'UNKNOWN', // Explicitly test unknown history state!
    },
    observations: generateObsHistory(98, 91, 37.6, 130, 84, false),
  },
  {
    id: 'PAT-8804',
    mrn: 'MRN-90217',
    name: 'Marcus Thorne',
    age: 61,
    gender: 'Male',
    admissionReason: 'Cardiogenic Shock & Telemetry Monitoring',
    ward: 'ICU Ward B',
    room: 'Bed 202',
    deviceId: 'DEV-ICU-004',
    careTeam: 'Dr. E. Vance, Nurse J. Smith',
    admissionDate: new Date(Date.now() - 4 * 86400000).toISOString(),
    status: 'STALE_FEED',
    vitals: {
      hr: 82,
      spo2: 95,
      temp: 36.9,
      sysBP: 115,
      diaBP: 74,
      timestamp: new Date(Date.now() - 400000).toISOString(),
      quality: 'STALE',
    },
    history: {
      allergies: [],
      conditions: [
        { code: 'severe-bradycardia-syndrome', name: 'Severe Sinus Bradycardia Syndrome', status: 'Active', recordedAt: '2025-08-12' }
      ],
      medications: [],
      allergiesHistoryStatus: 'VERIFIED',
    },
    observations: generateObsHistory(80, 95, 36.8, 112, 72, false),
  },
  {
    id: 'PAT-8805',
    mrn: 'MRN-90218',
    name: 'David Kowalski',
    age: 59,
    gender: 'Male',
    admissionReason: 'Stepdown Ward Recovery Post-Pneumonia',
    ward: 'Stepdown Ward C',
    room: 'Bed 301',
    deviceId: 'DEV-ICU-005',
    careTeam: 'Dr. A. Patel, Nurse K. Lin',
    admissionDate: new Date(Date.now() - 1 * 86400000).toISOString(),
    status: 'STABLE',
    vitals: {
      hr: 68,
      spo2: 99,
      temp: 36.7,
      sysBP: 118,
      diaBP: 76,
      timestamp: new Date().toISOString(),
      quality: 'VALID',
    },
    history: {
      allergies: [],
      conditions: [
        { code: 'PNEUMONIA', name: 'Bacterial Pneumonia (Resolving)', status: 'Active', recordedAt: '2026-10-08' }
      ],
      medications: [],
      allergiesHistoryStatus: 'VERIFIED',
    },
    observations: generateObsHistory(68, 99, 36.6, 118, 76, false),
  }
];

export const INITIAL_ALERTS = [
  {
    id: 'ALT-9001',
    patientId: 'PAT-8801',
    patientName: 'Eleanor Vance',
    bed: 'ICU Ward A • Bed 101',
    category: 'PHYSIOLOGICAL',
    title: 'Sustained Tachycardia Alert',
    severity: 'CRITICAL',
    detectedAt: new Date(Date.now() - 1800000).toISOString(),
    updatedAt: new Date(Date.now() - 1800000).toISOString(),
    status: 'NEW',
    ruleId: 'RULE-PHY-HR-HIGH',
    evidence: {
      metric: 'Heart Rate',
      value: 124,
      threshold: '110 bpm',
      unit: 'bpm',
      baseline: '85 bpm',
      dataQuality: 'VALID',
    },
    explanation: 'Heart rate exceeded 110 bpm for >15 minutes continuously during sepsis surveillance.',
    reviewNotes: [],
  },
  {
    id: 'ALT-9002',
    patientId: 'PAT-8803',
    patientName: 'Sarah Miller',
    bed: 'ICU Ward B • Bed 201',
    category: 'PHYSIOLOGICAL',
    title: 'Acute Oxygen Desaturation',
    severity: 'CRITICAL',
    detectedAt: new Date(Date.now() - 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 1200000).toISOString(),
    status: 'ACKNOWLEDGED',
    acknowledgedBy: 'Nurse M. Davis',
    acknowledgedAt: new Date(Date.now() - 1200000).toISOString(),
    ruleId: 'RULE-PHY-SPO2-LOW',
    evidence: {
      metric: 'SpO2 Oxygen Saturation',
      value: 89,
      threshold: '90%',
      unit: '%',
      baseline: '96%',
      dataQuality: 'VALID',
    },
    explanation: 'Pulse oximetry dropped below critical threshold of 90%. Increased O2 flow initiated.',
    reviewNotes: [
      { author: 'Nurse M. Davis', text: 'Checked nasal cannula positioning. Increased FiO2 to 40%.', timestamp: new Date(Date.now() - 1200000).toISOString() }
    ],
  },
  {
    id: 'ALT-9003',
    patientId: 'PAT-8804',
    patientName: 'Marcus Thorne',
    bed: 'ICU Ward B • Bed 202',
    category: 'TECHNICAL',
    title: 'Stale Bedside Telemetry Stream',
    severity: 'HIGH',
    detectedAt: new Date(Date.now() - 400000).toISOString(),
    updatedAt: new Date(Date.now() - 400000).toISOString(),
    status: 'NEW',
    ruleId: 'RULE-TECH-FEED-STALE',
    evidence: {
      metric: 'Telemetry Feed Packet Gap',
      value: '400 seconds',
      threshold: '120 seconds',
      unit: 'sec',
      dataQuality: 'STALE',
    },
    explanation: 'Bedside monitor DEV-ICU-004 has failed to publish telemetry observations for over 6 minutes.',
    reviewNotes: [],
  },
  {
    id: 'ALT-9004',
    patientId: 'PAT-8801',
    patientName: 'Eleanor Vance',
    bed: 'ICU Ward A • Bed 101',
    category: 'ML_ANOMALY',
    title: 'Multi-Parameter Telemetry Pattern Anomaly',
    severity: 'HIGH',
    detectedAt: new Date(Date.now() - 900000).toISOString(),
    updatedAt: new Date(Date.now() - 900000).toISOString(),
    status: 'UNDER_REVIEW',
    ruleId: 'MODEL-IFOREST-v2.4',
    evidence: {
      metric: 'Isolation Forest Anomaly Score',
      value: 0.88,
      threshold: '0.70',
      unit: 'score',
      features: 'HR elevated (+35%), MAP elevated (+15%), Temp elevated (38.6°C)',
      dataQuality: 'VALID',
    },
    explanation: 'Unusual combination relative to the synthetic baseline. Multi-parameter shift detected by unsupervised anomaly model.',
    reviewNotes: [
      { author: 'Dr. S. Jenkins', text: 'Evaluating for septic shock progression. Ordering STAT blood cultures.', timestamp: new Date(Date.now() - 600000).toISOString() }
    ],
  },
];

export const FICTIONAL_MEDICATION_RULES = {
  version: 'v2026.1-DEMO-RULESET',
  disclaimer: 'SYNTHETIC DEMO RULESET — NOT FOR CLINICAL USE',
  exactNoMatchMessage: 'No matching rule found in this demo rule set; this does not establish safety.',
  rules: [
    {
      id: 'RULE-DRUG-ALL-01',
      category: 'DRUG_ALLERGY',
      proposedIngredient: 'synthetic-compound-alpha',
      matchedAllergy: 'alpha-sensitivity',
      severity: 'CRITICAL',
      title: 'Severe Pseudo-Histamine Reaction Risk',
      description: 'Proposed ingredient synthetic-compound-alpha conflicts with documented alpha-sensitivity allergy.',
      evidence: 'Synthetic Pharmacokinetic Rule Set v2026.1 • Section 4.1',
    },
    {
      id: 'RULE-DRUG-DIS-01',
      category: 'DRUG_DISEASE',
      proposedIngredient: 'synthetic-beta-blocker-x',
      matchedCondition: 'severe-bradycardia-syndrome',
      severity: 'HIGH',
      title: 'Contraindicated in Severe Sinus Bradycardia',
      description: 'Synthetic beta-blocker-x reduces AV node conduction and is contraindicated in severe bradycardia syndrome.',
      evidence: 'Fictional Clinical Pharmacology Guidelines • Rule Dis-01',
    },
    {
      id: 'RULE-DRUG-DIS-02',
      category: 'DRUG_DISEASE',
      proposedIngredient: 'synthetic-anticoagulant-gamma',
      matchedCondition: 'active-gastrointestinal-bleed',
      severity: 'CRITICAL',
      title: 'High Hemorrhagic Exacerbation Risk',
      description: 'Anticoagulant therapy contraindicated with active GI bleeding history.',
      evidence: 'Fictional Clinical Pharmacology Guidelines • Rule Dis-02',
    },
    {
      id: 'RULE-DRUG-DRUG-01',
      category: 'DRUG_DRUG',
      // Unordered pair matching! Order doesn't matter.
      pair: ['synthetic-nitrate-z', 'synthetic-vasodilator-v'],
      severity: 'CRITICAL',
      title: 'Profound Hypotension & Vasodilation Synergy',
      description: 'Co-administration of synthetic-nitrate-z and synthetic-vasodilator-v induces severe uncompensated hypotension.',
      evidence: 'Fictional Interaction Matrix 2026 • Pair DRUG-01',
    }
  ],
  // Pre-configured searchable synthetic medications for UI dropdown
  availableMeds: [
    { id: 'MED-01', name: 'Synthetic Compound Alpha (Alpha-100)', ingredient: 'synthetic-compound-alpha' },
    { id: 'MED-02', name: 'Synthetic Beta-Blocker X (CardioX 25mg)', ingredient: 'synthetic-beta-blocker-x' },
    { id: 'MED-03', name: 'Synthetic Nitrate Z (NitroZ 10mg)', ingredient: 'synthetic-nitrate-z' },
    { id: 'MED-04', name: 'Synthetic Vasodilator V (VasoV 5mg)', ingredient: 'synthetic-vasodilator-v' },
    { id: 'MED-05', name: 'Synthetic Anticoagulant Gamma (Gammparin 5000U)', ingredient: 'synthetic-anticoagulant-gamma' },
    { id: 'MED-06', name: 'Synthetic Antibiotic Omega (Omegacillin 1g)', ingredient: 'synthetic-antibiotic-omega' },
  ]
};
