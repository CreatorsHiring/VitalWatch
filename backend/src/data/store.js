// In-memory data store for VitalWatch Hospital Platform

export const wards = [
  {
    id: 'ward-gen-a',
    name: 'General Ward A',
    type: 'General Ward',
    floor: '1st Floor - Wing North',
    icon: 'Building2',
    totalRooms: 12,
    description: 'Medical-surgical general inpatient care and post-operative recovery.',
  },
  {
    id: 'ward-gen-b',
    name: 'General Ward B',
    type: 'General Ward',
    floor: '2nd Floor - Wing North',
    icon: 'Building2',
    totalRooms: 12,
    description: 'Internal medicine, general observations, and subacute care.',
  },
  {
    id: 'ward-icu',
    name: 'Intensive Care Unit (ICU)',
    type: 'ICU',
    floor: '3rd Floor - Critical Wing',
    icon: 'Activity',
    totalRooms: 8,
    description: 'Continuous telemetry, advanced life-support, and multi-organ monitoring.',
  },
  {
    id: 'ward-emer',
    name: 'Emergency Ward',
    type: 'Emergency',
    floor: 'Ground Floor - Trauma Bay',
    icon: 'AlertCircle',
    totalRooms: 10,
    description: 'Acute emergency triage, rapid stabilization, and high-turnover admission.',
  },
  {
    id: 'ward-pvt',
    name: 'Private Ward',
    type: 'Private Ward',
    floor: '4th Floor - Executive Wing',
    icon: 'Shield',
    totalRooms: 8,
    description: 'Single-occupancy private inpatient suites with dedicated telemetry.',
  },
];

// Initialize rooms across wards
export let rooms = [
  // General Ward A (Rooms 101 - 112)
  { id: 'room-101', wardId: 'ward-gen-a', roomNumber: 'Room 101', status: 'occupied', currentPatientId: 'VW-PAT-1001', currentAdmissionId: 'ADM-2026-001' },
  { id: 'room-102', wardId: 'ward-gen-a', roomNumber: 'Room 102', status: 'available', currentPatientId: null, currentAdmissionId: null },
  { id: 'room-103', wardId: 'ward-gen-a', roomNumber: 'Room 103', status: 'available', currentPatientId: null, currentAdmissionId: null },
  { id: 'room-104', wardId: 'ward-gen-a', roomNumber: 'Room 104', status: 'occupied', currentPatientId: 'VW-PAT-1002', currentAdmissionId: 'ADM-2026-002' },
  { id: 'room-105', wardId: 'ward-gen-a', roomNumber: 'Room 105', status: 'available', currentPatientId: null, currentAdmissionId: null },
  { id: 'room-106', wardId: 'ward-gen-a', roomNumber: 'Room 106', status: 'available', currentPatientId: null, currentAdmissionId: null },
  { id: 'room-107', wardId: 'ward-gen-a', roomNumber: 'Room 107', status: 'occupied', currentPatientId: 'VW-PAT-1003', currentAdmissionId: 'ADM-2026-003' },
  { id: 'room-108', wardId: 'ward-gen-a', roomNumber: 'Room 108', status: 'available', currentPatientId: null, currentAdmissionId: null },
  { id: 'room-109', wardId: 'ward-gen-a', roomNumber: 'Room 109', status: 'available', currentPatientId: null, currentAdmissionId: null },
  { id: 'room-110', wardId: 'ward-gen-a', roomNumber: 'Room 110', status: 'occupied', currentPatientId: 'VW-PAT-1004', currentAdmissionId: 'ADM-2026-004' },
  { id: 'room-111', wardId: 'ward-gen-a', roomNumber: 'Room 111', status: 'available', currentPatientId: null, currentAdmissionId: null },
  { id: 'room-112', wardId: 'ward-gen-a', roomNumber: 'Room 112', status: 'available', currentPatientId: null, currentAdmissionId: null },

  // General Ward B (Rooms 201 - 212)
  { id: 'room-201', wardId: 'ward-gen-b', roomNumber: 'Room 201', status: 'occupied', currentPatientId: 'VW-PAT-1005', currentAdmissionId: 'ADM-2026-005' },
  { id: 'room-202', wardId: 'ward-gen-b', roomNumber: 'Room 202', status: 'available', currentPatientId: null, currentAdmissionId: null },
  { id: 'room-203', wardId: 'ward-gen-b', roomNumber: 'Room 203', status: 'available', currentPatientId: null, currentAdmissionId: null },
  { id: 'room-204', wardId: 'ward-gen-b', roomNumber: 'Room 204', status: 'available', currentPatientId: null, currentAdmissionId: null },
  { id: 'room-205', wardId: 'ward-gen-b', roomNumber: 'Room 205', status: 'occupied', currentPatientId: 'VW-PAT-1006', currentAdmissionId: 'ADM-2026-006' },
  { id: 'room-206', wardId: 'ward-gen-b', roomNumber: 'Room 206', status: 'available', currentPatientId: null, currentAdmissionId: null },
  { id: 'room-207', wardId: 'ward-gen-b', roomNumber: 'Room 207', status: 'available', currentPatientId: null, currentAdmissionId: null },
  { id: 'room-208', wardId: 'ward-gen-b', roomNumber: 'Room 208', status: 'available', currentPatientId: null, currentAdmissionId: null },
  { id: 'room-209', wardId: 'ward-gen-b', roomNumber: 'Room 209', status: 'occupied', currentPatientId: 'VW-PAT-1007', currentAdmissionId: 'ADM-2026-007' },
  { id: 'room-210', wardId: 'ward-gen-b', roomNumber: 'Room 210', status: 'available', currentPatientId: null, currentAdmissionId: null },
  { id: 'room-211', wardId: 'ward-gen-b', roomNumber: 'Room 211', status: 'available', currentPatientId: null, currentAdmissionId: null },
  { id: 'room-212', wardId: 'ward-gen-b', roomNumber: 'Room 212', status: 'available', currentPatientId: null, currentAdmissionId: null },

  // ICU (Rooms ICU-01 - ICU-08)
  { id: 'room-icu-01', wardId: 'ward-icu', roomNumber: 'ICU Bed 01', status: 'occupied', currentPatientId: 'VW-PAT-1008', currentAdmissionId: 'ADM-2026-008' },
  { id: 'room-icu-02', wardId: 'ward-icu', roomNumber: 'ICU Bed 02', status: 'occupied', currentPatientId: 'VW-PAT-1009', currentAdmissionId: 'ADM-2026-009' },
  { id: 'room-icu-03', wardId: 'ward-icu', roomNumber: 'ICU Bed 03', status: 'available', currentPatientId: null, currentAdmissionId: null },
  { id: 'room-icu-04', wardId: 'ward-icu', roomNumber: 'ICU Bed 04', status: 'available', currentPatientId: null, currentAdmissionId: null },
  { id: 'room-icu-05', wardId: 'ward-icu', roomNumber: 'ICU Bed 05', status: 'occupied', currentPatientId: 'VW-PAT-1010', currentAdmissionId: 'ADM-2026-010' },
  { id: 'room-icu-06', wardId: 'ward-icu', roomNumber: 'ICU Bed 06', status: 'available', currentPatientId: null, currentAdmissionId: null },
  { id: 'room-icu-07', wardId: 'ward-icu', roomNumber: 'ICU Bed 07', status: 'available', currentPatientId: null, currentAdmissionId: null },
  { id: 'room-icu-08', wardId: 'ward-icu', roomNumber: 'ICU Bed 08', status: 'available', currentPatientId: null, currentAdmissionId: null },

  // Emergency (Rooms ER-01 - ER-10)
  { id: 'room-er-01', wardId: 'ward-emer', roomNumber: 'ER Bay 01', status: 'occupied', currentPatientId: 'VW-PAT-1011', currentAdmissionId: 'ADM-2026-011' },
  { id: 'room-er-02', wardId: 'ward-emer', roomNumber: 'ER Bay 02', status: 'available', currentPatientId: null, currentAdmissionId: null },
  { id: 'room-er-03', wardId: 'ward-emer', roomNumber: 'ER Bay 03', status: 'available', currentPatientId: null, currentAdmissionId: null },
  { id: 'room-er-04', wardId: 'ward-emer', roomNumber: 'ER Bay 04', status: 'occupied', currentPatientId: 'VW-PAT-1012', currentAdmissionId: 'ADM-2026-012' },
  { id: 'room-er-05', wardId: 'ward-emer', roomNumber: 'ER Bay 05', status: 'available', currentPatientId: null, currentAdmissionId: null },
  { id: 'room-er-06', wardId: 'ward-emer', roomNumber: 'ER Bay 06', status: 'available', currentPatientId: null, currentAdmissionId: null },
  { id: 'room-er-07', wardId: 'ward-emer', roomNumber: 'ER Bay 07', status: 'available', currentPatientId: null, currentAdmissionId: null },
  { id: 'room-er-08', wardId: 'ward-emer', roomNumber: 'ER Bay 08', status: 'available', currentPatientId: null, currentAdmissionId: null },
  { id: 'room-er-09', wardId: 'ward-emer', roomNumber: 'ER Bay 09', status: 'available', currentPatientId: null, currentAdmissionId: null },
  { id: 'room-er-10', wardId: 'ward-emer', roomNumber: 'ER Bay 10', status: 'available', currentPatientId: null, currentAdmissionId: null },

  // Private Ward (Rooms PVT-101 - PVT-108)
  { id: 'room-pvt-101', wardId: 'ward-pvt', roomNumber: 'Suite 101', status: 'occupied', currentPatientId: 'VW-PAT-1013', currentAdmissionId: 'ADM-2026-013' },
  { id: 'room-pvt-102', wardId: 'ward-pvt', roomNumber: 'Suite 102', status: 'available', currentPatientId: null, currentAdmissionId: null },
  { id: 'room-pvt-103', wardId: 'ward-pvt', roomNumber: 'Suite 103', status: 'available', currentPatientId: null, currentAdmissionId: null },
  { id: 'room-pvt-104', wardId: 'ward-pvt', roomNumber: 'Suite 104', status: 'available', currentPatientId: null, currentAdmissionId: null },
  { id: 'room-pvt-105', wardId: 'ward-pvt', roomNumber: 'Suite 105', status: 'available', currentPatientId: null, currentAdmissionId: null },
  { id: 'room-pvt-106', wardId: 'ward-pvt', roomNumber: 'Suite 106', status: 'available', currentPatientId: null, currentAdmissionId: null },
  { id: 'room-pvt-107', wardId: 'ward-pvt', roomNumber: 'Suite 107', status: 'available', currentPatientId: null, currentAdmissionId: null },
  { id: 'room-pvt-108', wardId: 'ward-pvt', roomNumber: 'Suite 108', status: 'available', currentPatientId: null, currentAdmissionId: null },
];

// Patients Store
export let patients = [
  {
    id: 'VW-PAT-1001',
    fullName: 'Eleanor Vance',
    dob: '1958-04-12',
    gender: 'Female',
    phone: '+1 (555) 234-8901',
    emergencyContact: 'Thomas Vance (Spouse) - +1 (555) 234-8909',
    admissionStatus: 'Admitted',
    currentWardId: 'ward-gen-a',
    currentWardName: 'General Ward A',
    currentRoomNumber: 'Room 101',
    createdAt: '2026-10-07T09:30:00Z',
    medicalHistory: {
      status: 'verified',
      source: 'manual',
      conditions: ['Hypertension', 'Type 2 Diabetes', 'Post-Op Knee Arthroplasty'],
      allergies: ['Penicillin (Moderate rash)', 'Sulfa drugs'],
      medications: ['Metformin 500mg BD', 'Amlodipine 5mg OD', 'Enoxaparin 40mg SC'],
      notes: 'Patient had successful left knee replacement on Oct 07. Monitor surgical site and blood pressure.',
    },
  },
  {
    id: 'VW-PAT-1002',
    fullName: 'Arthur Miller',
    dob: '1972-08-23',
    gender: 'Male',
    phone: '+1 (555) 456-1122',
    emergencyContact: 'Linda Miller (Wife) - +1 (555) 456-1199',
    admissionStatus: 'Admitted',
    currentWardId: 'ward-gen-a',
    currentWardName: 'General Ward A',
    currentRoomNumber: 'Room 104',
    createdAt: '2026-10-08T14:15:00Z',
    medicalHistory: {
      status: 'verified',
      source: 'abha_demo',
      conditions: ['Community-Acquired Pneumonia', 'Mild Asthma'],
      allergies: ['No known drug allergies (NKDA)'],
      medications: ['Azithromycin 500mg OD', 'Salbutamol Inhaler PRN'],
      notes: 'Admitted with productive cough and fever. SpO2 stabilizing on room air.',
    },
  },
  {
    id: 'VW-PAT-1003',
    fullName: 'Marcus Sterling',
    dob: '1965-11-30',
    gender: 'Male',
    phone: '+1 (555) 789-3344',
    emergencyContact: 'Claire Sterling (Daughter) - +1 (555) 789-3300',
    admissionStatus: 'Admitted',
    currentWardId: 'ward-gen-a',
    currentWardName: 'General Ward A',
    currentRoomNumber: 'Room 107',
    createdAt: '2026-10-08T18:00:00Z',
    medicalHistory: {
      status: 'unverified',
      source: 'manual',
      conditions: ['Acute Gastroenteritis', 'Dehydration'],
      allergies: ['Aspirin (GI upset)'],
      medications: ['IV Normal Saline', 'Ondansetron 4mg IV'],
      notes: 'Rehydration protocol active.',
    },
  },
  {
    id: 'VW-PAT-1004',
    fullName: 'Sofia Rodriguez',
    dob: '1989-02-14',
    gender: 'Female',
    phone: '+1 (555) 901-7788',
    emergencyContact: 'Mateo Rodriguez (Brother) - +1 (555) 901-7700',
    admissionStatus: 'Admitted',
    currentWardId: 'ward-gen-a',
    currentWardName: 'General Ward A',
    currentRoomNumber: 'Room 110',
    createdAt: '2026-10-09T08:20:00Z',
    medicalHistory: {
      status: 'verified',
      source: 'abha_demo',
      conditions: ['Post-Appendectomy', 'Mild Anemia'],
      allergies: ['Codeine (Nausea/vomiting)'],
      medications: ['Paracetamol 1g QDS', 'Cefuroxime 500mg BD'],
      notes: 'Routine recovery following laparoscopic appendectomy.',
    },
  },
  {
    id: 'VW-PAT-1005',
    fullName: 'Robert Chen',
    dob: '1965-06-18',
    gender: 'Male',
    phone: '+1 (555) 678-9900',
    emergencyContact: 'Grace Chen (Spouse) - +1 (555) 678-9911',
    admissionStatus: 'Admitted',
    currentWardId: 'ward-gen-b',
    currentWardName: 'General Ward B',
    currentRoomNumber: 'Room 201',
    createdAt: '2026-10-06T11:00:00Z',
    medicalHistory: {
      status: 'verified',
      source: 'manual',
      conditions: ['Coronary Artery Disease', 'Hyperlipidemia'],
      allergies: ['Latex (Skin redness)'],
      medications: ['Atorvastatin 40mg OD', 'Aspirin 75mg OD', 'Clopidogrel 75mg OD'],
      notes: 'Post-coronary stent placement. Continuous telemetry active.',
    },
  },
  {
    id: 'VW-PAT-1006',
    fullName: 'Helena Thorne',
    dob: '1980-09-05',
    gender: 'Female',
    phone: '+1 (555) 345-6677',
    emergencyContact: 'Julian Thorne (Husband) - +1 (555) 345-6688',
    admissionStatus: 'Admitted',
    currentWardId: 'ward-gen-b',
    currentWardName: 'General Ward B',
    currentRoomNumber: 'Room 205',
    createdAt: '2026-10-08T16:30:00Z',
    medicalHistory: {
      status: 'unverified',
      source: 'manual',
      conditions: ['Complicated Pyelonephritis'],
      allergies: ['Ciprofloxacin'],
      medications: ['Ceftriaxone 1g IV daily'],
      notes: 'Urine culture pending. Temperature stabilizing.',
    },
  },
  {
    id: 'VW-PAT-1007',
    fullName: 'David K. O’Connor',
    dob: '1953-12-01',
    gender: 'Male',
    phone: '+1 (555) 890-1234',
    emergencyContact: 'Sarah O’Connor (Daughter) - +1 (555) 890-1200',
    admissionStatus: 'Admitted',
    currentWardId: 'ward-gen-b',
    currentWardName: 'General Ward B',
    currentRoomNumber: 'Room 209',
    createdAt: '2026-10-09T07:15:00Z',
    medicalHistory: {
      status: 'verified',
      source: 'abha_demo',
      conditions: ['Chronic Obstructive Pulmonary Disease (COPD) Stage II', 'Hypertension'],
      allergies: ['NKDA'],
      medications: ['Tiotropium Inhaler', 'Losartan 50mg OD'],
      notes: 'COPD exacerbation triggered by seasonal viral infection.',
    },
  },
  {
    id: 'VW-PAT-1008',
    fullName: 'Clara Oswald',
    dob: '1954-03-21',
    gender: 'Female',
    phone: '+1 (555) 432-8765',
    emergencyContact: 'Danny Pink (Partner) - +1 (555) 432-8700',
    admissionStatus: 'Admitted',
    currentWardId: 'ward-icu',
    currentWardName: 'Intensive Care Unit (ICU)',
    currentRoomNumber: 'ICU Bed 01',
    createdAt: '2026-10-09T02:00:00Z',
    medicalHistory: {
      status: 'verified',
      source: 'manual',
      conditions: ['Septic Shock - Tier 1 Protocol', 'Acute Kidney Injury'],
      allergies: ['Vancomycin (Flushing reaction)'],
      medications: ['Norepinephrine infusion', 'Meropenem 1g IV TDS'],
      notes: 'Continuous invasive arterial line and central venous pressure monitoring.',
    },
  },
  {
    id: 'VW-PAT-1009',
    fullName: 'James T. Wilson',
    dob: '1961-07-19',
    gender: 'Male',
    phone: '+1 (555) 654-3210',
    emergencyContact: 'Margaret Wilson (Wife) - +1 (555) 654-3299',
    admissionStatus: 'Admitted',
    currentWardId: 'ward-icu',
    currentWardName: 'Intensive Care Unit (ICU)',
    currentRoomNumber: 'ICU Bed 02',
    createdAt: '2026-10-08T22:45:00Z',
    medicalHistory: {
      status: 'verified',
      source: 'abha_demo',
      conditions: ['Post-CABG (Triple Bypass)', 'Atrial Fibrillation'],
      allergies: ['Amiodarone'],
      medications: ['Metoprolol Tartrate 25mg BD', 'Warfarin 3mg OD'],
      notes: 'Post-op cardiac telemetry lead II active.',
    },
  },
  {
    id: 'VW-PAT-1010',
    fullName: 'Fatima Al-Mansoor',
    dob: '1976-10-10',
    gender: 'Female',
    phone: '+1 (555) 789-0123',
    emergencyContact: 'Zayd Al-Mansoor (Husband) - +1 (555) 789-0199',
    admissionStatus: 'Admitted',
    currentWardId: 'ward-icu',
    currentWardName: 'Intensive Care Unit (ICU)',
    currentRoomNumber: 'ICU Bed 05',
    createdAt: '2026-10-09T05:30:00Z',
    medicalHistory: {
      status: 'verified',
      source: 'manual',
      conditions: ['Severe Acute Respiratory Distress (ARDS)'],
      allergies: ['Penicillin'],
      medications: ['Mechanical ventilation protocol', 'Dexamethasone 6mg IV OD'],
      notes: 'Lung-protective ventilation in progress.',
    },
  },
  {
    id: 'VW-PAT-1011',
    fullName: 'Liam Patel',
    dob: '1995-12-12',
    gender: 'Male',
    phone: '+1 (555) 123-9876',
    emergencyContact: 'Aarav Patel (Father) - +1 (555) 123-9800',
    admissionStatus: 'Admitted',
    currentWardId: 'ward-emer',
    currentWardName: 'Emergency Ward',
    currentRoomNumber: 'ER Bay 01',
    createdAt: '2026-10-09T19:20:00Z',
    medicalHistory: {
      status: 'unverified',
      source: 'manual',
      conditions: ['Multiple Fracture Traumas (MVA)'],
      allergies: ['None recorded'],
      medications: ['Morphine 5mg IV PRN', 'Tetanus Toxoid'],
      notes: 'Orthopedic surgeon consult scheduled.',
    },
  },
  {
    id: 'VW-PAT-1012',
    fullName: 'Maya Lin',
    dob: '1984-05-17',
    gender: 'Female',
    phone: '+1 (555) 987-4561',
    emergencyContact: 'Kenji Lin (Spouse) - +1 (555) 987-4500',
    admissionStatus: 'Admitted',
    currentWardId: 'ward-emer',
    currentWardName: 'Emergency Ward',
    currentRoomNumber: 'ER Bay 04',
    createdAt: '2026-10-09T20:10:00Z',
    medicalHistory: {
      status: 'verified',
      source: 'abha_demo',
      conditions: ['Acute Severe Allergic Reaction (Anaphylaxis - resolved)'],
      allergies: ['Peanuts', 'Tree nuts', 'Shellfish'],
      medications: ['Epinephrine 0.3mg IM (Given prior to arrival)', 'Hydrocortisone 100mg IV'],
      notes: 'Observation for 6 hours post-epinephrine.',
    },
  },
  {
    id: 'VW-PAT-1013',
    fullName: 'Sir Jonathan Vance-Sterling',
    dob: '1950-01-25',
    gender: 'Male',
    phone: '+1 (555) 555-0199',
    emergencyContact: 'Lady Elizabeth Sterling - +1 (555) 555-0100',
    admissionStatus: 'Admitted',
    currentWardId: 'ward-pvt',
    currentWardName: 'Private Ward',
    currentRoomNumber: 'Suite 101',
    createdAt: '2026-10-08T10:00:00Z',
    medicalHistory: {
      status: 'verified',
      source: 'manual',
      conditions: ['Hypertensive Heart Disease', 'Mild Gout'],
      allergies: ['Allopurinol (Rash)'],
      medications: ['Febuxostat 40mg OD', 'Valsartan 80mg OD'],
      notes: 'Executive suite admission. Continuous quiet telemetry.',
    },
  },
  // Registered but discharged/unassigned patient for search testing
  {
    id: 'VW-PAT-1014',
    fullName: 'Evelyn Reed',
    dob: '1991-03-14',
    gender: 'Female',
    phone: '+1 (555) 234-5678',
    emergencyContact: 'Mark Reed - +1 (555) 234-5600',
    admissionStatus: 'Discharged',
    currentWardId: null,
    currentWardName: null,
    currentRoomNumber: null,
    createdAt: '2026-09-15T10:00:00Z',
    medicalHistory: {
      status: 'verified',
      source: 'abha_demo',
      conditions: ['Hypothyroidism', 'Migraines'],
      allergies: ['Sulfa antibiotics'],
      medications: ['Levothyroxine 50mcg OD', 'Sumatriptan 50mg PRN'],
      notes: 'Previous admission for migraine with aura, discharged stable.',
    },
  },
];

// Admissions Store
export let admissions = [
  {
    id: 'ADM-2026-001',
    patientId: 'VW-PAT-1001',
    patientName: 'Eleanor Vance',
    wardId: 'ward-gen-a',
    wardName: 'General Ward A',
    roomId: 'room-101',
    roomNumber: 'Room 101',
    admittedAt: '2026-10-07T09:30:00Z',
    attendingDoctor: 'Dr. Sarah Mehta, MD (Orthopedics)',
    admissionReason: 'Elective left total knee arthroplasty post-op recovery',
    assignedNurse: 'Nurse Vance, RN',
    status: 'active',
  },
  {
    id: 'ADM-2026-002',
    patientId: 'VW-PAT-1002',
    patientName: 'Arthur Miller',
    wardId: 'ward-gen-a',
    wardName: 'General Ward A',
    roomId: 'room-104',
    roomNumber: 'Room 104',
    admittedAt: '2026-10-08T14:15:00Z',
    attendingDoctor: 'Dr. Robert Thorne, MD (Pulmonology)',
    admissionReason: 'Community-acquired bacterial pneumonia requiring IV antibiotics',
    assignedNurse: 'Nurse Rachel Kim, RN',
    status: 'active',
  },
  {
    id: 'ADM-2026-003',
    patientId: 'VW-PAT-1003',
    patientName: 'Marcus Sterling',
    wardId: 'ward-gen-a',
    wardName: 'General Ward A',
    roomId: 'room-107',
    roomNumber: 'Room 107',
    admittedAt: '2026-10-08T18:00:00Z',
    attendingDoctor: 'Dr. Emily Chen, MD (Gastroenterology)',
    admissionReason: 'Severe acute gastroenteritis with electrolyte imbalance',
    assignedNurse: 'Nurse Vance, RN',
    status: 'active',
  },
  {
    id: 'ADM-2026-004',
    patientId: 'VW-PAT-1004',
    patientName: 'Sofia Rodriguez',
    wardId: 'ward-gen-a',
    wardName: 'General Ward A',
    roomId: 'room-110',
    roomNumber: 'Room 110',
    admittedAt: '2026-10-09T08:20:00Z',
    attendingDoctor: 'Dr. Sarah Mehta, MD (General Surgery)',
    admissionReason: 'Post-operative observation following emergency appendectomy',
    assignedNurse: 'Nurse Carlos Diaz, RN',
    status: 'active',
  },
  {
    id: 'ADM-2026-005',
    patientId: 'VW-PAT-1005',
    patientName: 'Robert Chen',
    wardId: 'ward-gen-b',
    wardName: 'General Ward B',
    roomId: 'room-201',
    roomNumber: 'Room 201',
    admittedAt: '2026-10-06T11:00:00Z',
    attendingDoctor: 'Dr. Gregory House, MD (Cardiology)',
    admissionReason: 'Elective coronary stent placement with continuous rhythm telemetry',
    assignedNurse: 'Nurse Sarah Jenkins, RN',
    status: 'active',
  },
  {
    id: 'ADM-2026-006',
    patientId: 'VW-PAT-1006',
    patientName: 'Helena Thorne',
    wardId: 'ward-gen-b',
    wardName: 'General Ward B',
    roomId: 'room-205',
    roomNumber: 'Room 205',
    admittedAt: '2026-10-08T16:30:00Z',
    attendingDoctor: 'Dr. Emily Chen, MD (Internal Medicine)',
    admissionReason: 'Acute complicated pyelonephritis requiring IV cephalosporins',
    assignedNurse: 'Nurse Sarah Jenkins, RN',
    status: 'active',
  },
  {
    id: 'ADM-2026-007',
    patientId: 'VW-PAT-1007',
    patientName: 'David K. O’Connor',
    wardId: 'ward-gen-b',
    wardName: 'General Ward B',
    roomId: 'room-209',
    roomNumber: 'Room 209',
    admittedAt: '2026-10-09T07:15:00Z',
    attendingDoctor: 'Dr. Robert Thorne, MD (Pulmonology)',
    admissionReason: 'Moderate COPD exacerbation on high-flow nasal cannula',
    assignedNurse: 'Nurse David Bradley, RN',
    status: 'active',
  },
  {
    id: 'ADM-2026-008',
    patientId: 'VW-PAT-1008',
    patientName: 'Clara Oswald',
    wardId: 'ward-icu',
    wardName: 'Intensive Care Unit (ICU)',
    roomId: 'room-icu-01',
    roomNumber: 'ICU Bed 01',
    admittedAt: '2026-10-09T02:00:00Z',
    attendingDoctor: 'Dr. Alistair Gordon, MD (Intensivist)',
    admissionReason: 'Severe sepsis with hypotension requiring central line and pressors',
    assignedNurse: 'Nurse Clara Dupont, CCRN',
    status: 'active',
  },
  {
    id: 'ADM-2026-009',
    patientId: 'VW-PAT-1009',
    patientName: 'James T. Wilson',
    wardId: 'ward-icu',
    wardName: 'Intensive Care Unit (ICU)',
    roomId: 'room-icu-02',
    roomNumber: 'ICU Bed 02',
    admittedAt: '2026-10-08T22:45:00Z',
    attendingDoctor: 'Dr. Alistair Gordon, MD (Cardiothoracic)',
    admissionReason: 'Immediate post-CABG x3 recovery and hemodynamic optimization',
    assignedNurse: 'Nurse Clara Dupont, CCRN',
    status: 'active',
  },
  {
    id: 'ADM-2026-010',
    patientId: 'VW-PAT-1010',
    patientName: 'Fatima Al-Mansoor',
    wardId: 'ward-icu',
    wardName: 'Intensive Care Unit (ICU)',
    roomId: 'room-icu-05',
    roomNumber: 'ICU Bed 05',
    admittedAt: '2026-10-09T05:30:00Z',
    attendingDoctor: 'Dr. Alistair Gordon, MD (Critical Care)',
    admissionReason: 'Severe acute respiratory distress syndrome on synchronized ventilation',
    assignedNurse: 'Nurse Mark Sullivan, CCRN',
    status: 'active',
  },
  {
    id: 'ADM-2026-011',
    patientId: 'VW-PAT-1011',
    patientName: 'Liam Patel',
    wardId: 'ward-emer',
    wardName: 'Emergency Ward',
    roomId: 'room-er-01',
    roomNumber: 'ER Bay 01',
    admittedAt: '2026-10-09T19:20:00Z',
    attendingDoctor: 'Dr. Vikram Sen, MD (Trauma / Emergency)',
    admissionReason: 'Motor vehicle accident multiple limb fracture stabilization',
    assignedNurse: 'Nurse Jenny Park, RN',
    status: 'active',
  },
  {
    id: 'ADM-2026-012',
    patientId: 'VW-PAT-1012',
    patientName: 'Maya Lin',
    wardId: 'ward-emer',
    wardName: 'Emergency Ward',
    roomId: 'room-er-04',
    roomNumber: 'ER Bay 04',
    admittedAt: '2026-10-09T20:10:00Z',
    attendingDoctor: 'Dr. Vikram Sen, MD (Emergency Medicine)',
    admissionReason: 'Post-anaphylaxis observation following intramuscular epinephrine',
    assignedNurse: 'Nurse Jenny Park, RN',
    status: 'active',
  },
  {
    id: 'ADM-2026-013',
    patientId: 'VW-PAT-1013',
    patientName: 'Sir Jonathan Vance-Sterling',
    wardId: 'ward-pvt',
    wardName: 'Private Ward',
    roomId: 'room-pvt-101',
    roomNumber: 'Suite 101',
    admittedAt: '2026-10-08T10:00:00Z',
    attendingDoctor: 'Dr. Gregory House, MD (Cardiology)',
    admissionReason: 'Elective VIP cardiology evaluation and telemetry titration',
    assignedNurse: 'Nurse Vance, RN',
    status: 'active',
  },
];

// Fictional Simulated ABHA Demo Records (for Hackathon Simulation)
export const abhaDemoRecords = [
  {
    abhaId: '91-8273-9012-4451',
    name: 'Eleanor Vance',
    gender: 'Female',
    dob: '1958-04-12',
    abhaAddress: 'eleanor.vance@abdm',
    conditions: ['Essential Hypertension (2018)', 'Type 2 Diabetes Mellitus (2020)'],
    allergies: ['Penicillin (Allergic cutaneous rash)'],
    medications: ['Metformin 500mg BD', 'Amlodipine 5mg OD'],
    pastHospitalizations: ['Knee arthroscopy (2022)'],
    verifiedHealthFacility: 'Apollo City Hospital, Care Network',
  },
  {
    abhaId: '91-3847-1920-8833',
    name: 'Arthur Miller',
    gender: 'Male',
    dob: '1972-08-23',
    abhaAddress: 'arthur.miller@abdm',
    conditions: ['Mild Childhood Asthma', 'Seasonal Rhinitis'],
    allergies: ['No known drug allergies (NKDA)'],
    medications: ['Salbutamol 100mcg MDI PRN'],
    pastHospitalizations: ['Appendectomy (2010)'],
    verifiedHealthFacility: 'Max Healthcare Centre, Central Branch',
  },
  {
    abhaId: '91-5501-7892-3344',
    name: 'David K. O’Connor',
    gender: 'Male',
    dob: '1953-12-01',
    abhaAddress: 'david.oconnor@abdm',
    conditions: ['COPD Stage II (2019)', 'Stage 1 Hypertension (2016)'],
    allergies: ['Sulfa drugs (Moderate pruritus)'],
    medications: ['Tiotropium Respimat 2.5mcg OD', 'Losartan 50mg OD'],
    pastHospitalizations: ['Bronchitis admission (2023)'],
    verifiedHealthFacility: 'Fortis Memorial Clinical Trust',
  },
  {
    abhaId: '91-9922-4411-0088',
    name: 'Sample Patient ABHA',
    gender: 'Female',
    dob: '1988-06-20',
    abhaAddress: 'sample.abha@abdm',
    conditions: ['Chronic Migraine', 'Hypothyroidism'],
    allergies: ['Ibuprofen / NSAIDs (Gastritis)'],
    medications: ['Levothyroxine 75mcg OD', 'Propranolol 40mg BD'],
    pastHospitalizations: ['None in last 5 years'],
    verifiedHealthFacility: 'Manipal Health Network Registry',
  },
];

// Helper: Calculate Ward Availability
export function getWardsWithStats() {
  return wards.map((ward) => {
    const wardRooms = rooms.filter((r) => r.wardId === ward.id);
    const total = wardRooms.length;
    const occupied = wardRooms.filter((r) => r.status === 'occupied').length;
    const available = total - occupied;
    const occupancyRate = total > 0 ? Math.round((occupied / total) * 100) : 0;

    return {
      ...ward,
      totalRooms: total,
      availableRooms: available,
      occupiedRooms: occupied,
      occupancyRate,
    };
  });
}

// Helper: Calculate Global Hospital Stats
export function getHospitalStats() {
  const totalWards = wards.length;
  const totalRooms = rooms.length;
  const occupiedRooms = rooms.filter((r) => r.status === 'occupied').length;
  const availableRooms = totalRooms - occupiedRooms;
  const occupancyPercentage = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;
  const activeAdmissions = admissions.filter((a) => a.status === 'active').length;

  return {
    totalWards,
    totalRooms,
    availableRooms,
    occupiedRooms,
    occupancyPercentage,
    activeAdmissions,
    lastUpdated: new Date().toISOString(),
  };
}

// Atomic helper: Assign room atomically
export function assignRoomAtomically({ patientData, admissionData, medicalHistoryData }) {
  // 1. Verify that the room exists
  const targetRoom = rooms.find((r) => r.id === admissionData.roomId || (r.wardId === admissionData.wardId && r.roomNumber === admissionData.roomNumber));

  if (!targetRoom) {
    throw new Error(`Target room ${admissionData.roomNumber || admissionData.roomId} does not exist in ward ${admissionData.wardId}`);
  }

  // 2. Critical atomic check: Room MUST be currently available
  if (targetRoom.status === 'occupied') {
    throw new Error(`Room ${targetRoom.roomNumber} is already occupied by patient ${targetRoom.currentPatientId}. Please refresh and select an available room.`);
  }

  const ward = wards.find((w) => w.id === targetRoom.wardId);
  const wardName = ward ? ward.name : admissionData.wardName || 'General Ward';

  // 3. Find or Create Patient Record
  let patient;
  if (patientData.id) {
    patient = patients.find((p) => p.id === patientData.id);
  }

  const nowIso = new Date().toISOString();

  if (patient) {
    // Update existing patient
    patient.fullName = patientData.fullName || patient.fullName;
    patient.dob = patientData.dob || patient.dob;
    patient.gender = patientData.gender || patient.gender;
    patient.phone = patientData.phone || patient.phone;
    patient.emergencyContact = patientData.emergencyContact || patient.emergencyContact;
    patient.admissionStatus = 'Admitted';
    patient.currentWardId = targetRoom.wardId;
    patient.currentWardName = wardName;
    patient.currentRoomNumber = targetRoom.roomNumber;

    if (medicalHistoryData) {
      patient.medicalHistory = {
        status: medicalHistoryData.status || (medicalHistoryData.conditions?.length > 0 ? 'verified' : 'unverified'),
        source: medicalHistoryData.source || 'manual',
        conditions: medicalHistoryData.conditions || patient.medicalHistory?.conditions || [],
        allergies: medicalHistoryData.allergies || patient.medicalHistory?.allergies || [],
        medications: medicalHistoryData.medications || patient.medicalHistory?.medications || [],
        notes: medicalHistoryData.notes || patient.medicalHistory?.notes || '',
      };
    }
  } else {
    // Generate unique Patient ID
    const newPatientId = `VW-PAT-${1000 + patients.length + 1}`;
    patient = {
      id: newPatientId,
      fullName: patientData.fullName,
      dob: patientData.dob,
      gender: patientData.gender || 'Unspecified',
      phone: patientData.phone,
      emergencyContact: patientData.emergencyContact || 'Not provided',
      admissionStatus: 'Admitted',
      currentWardId: targetRoom.wardId,
      currentWardName: wardName,
      currentRoomNumber: targetRoom.roomNumber,
      createdAt: nowIso,
      medicalHistory: {
        status: medicalHistoryData?.status || (medicalHistoryData?.conditions?.length > 0 ? 'verified' : 'unverified'),
        source: medicalHistoryData?.source || 'manual',
        conditions: medicalHistoryData?.conditions || [],
        allergies: medicalHistoryData?.allergies || [],
        medications: medicalHistoryData?.medications || [],
        notes: medicalHistoryData?.notes || (medicalHistoryData?.conditions?.length ? '' : 'Medical history unverified upon admission.'),
      },
    };
    patients.unshift(patient);
  }

  // 4. Create new Admission Record
  const newAdmissionId = `ADM-2026-${String(admissions.length + 1).padStart(3, '0')}`;
  const newAdmission = {
    id: newAdmissionId,
    patientId: patient.id,
    patientName: patient.fullName,
    wardId: targetRoom.wardId,
    wardName: wardName,
    roomId: targetRoom.id,
    roomNumber: targetRoom.roomNumber,
    admittedAt: admissionData.admittedAt || nowIso,
    attendingDoctor: admissionData.attendingDoctor || 'Dr. On Duty, MD',
    admissionReason: admissionData.admissionReason || 'General inpatient observation and monitoring',
    assignedNurse: admissionData.assignedNurse || 'Floor Care Team',
    status: 'active',
  };
  admissions.unshift(newAdmission);

  // 5. Atomic state update: mark room as occupied
  targetRoom.status = 'occupied';
  targetRoom.currentPatientId = patient.id;
  targetRoom.currentAdmissionId = newAdmission.id;

  return {
    patient,
    admission: newAdmission,
    room: targetRoom,
    ward,
  };
}
