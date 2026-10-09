import { patients, abhaDemoRecords } from '../data/store.js';

export function getAllPatients(req, res) {
  const { search, wardId, admissionStatus, historyStatus } = req.query;

  let filtered = [...patients];

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.fullName.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        (p.phone && p.phone.includes(q))
    );
  }

  if (wardId) {
    filtered = filtered.filter((p) => p.currentWardId === wardId);
  }

  if (admissionStatus) {
    filtered = filtered.filter(
      (p) => p.admissionStatus.toLowerCase() === admissionStatus.toLowerCase()
    );
  }

  if (historyStatus) {
    filtered = filtered.filter(
      (p) => p.medicalHistory?.status?.toLowerCase() === historyStatus.toLowerCase()
    );
  }

  return res.json({
    success: true,
    total: filtered.length,
    data: filtered,
  });
}

export function getPatientById(req, res) {
  const { patientId } = req.params;
  const patient = patients.find((p) => p.id === patientId);

  if (!patient) {
    return res.status(404).json({
      success: false,
      message: `Patient with ID '${patientId}' not found.`,
    });
  }

  return res.json({
    success: true,
    data: patient,
  });
}

export function createPatient(req, res) {
  const { fullName, dob, gender, phone, emergencyContact, medicalHistory } = req.body;

  if (!fullName || !dob) {
    return res.status(400).json({
      success: false,
      message: 'Patient Full Name and Date of Birth are required.',
    });
  }

  const newPatientId = `VW-PAT-${1000 + patients.length + 1}`;
  const nowIso = new Date().toISOString();

  const newPatient = {
    id: newPatientId,
    fullName: fullName.trim(),
    dob,
    gender: gender || 'Unspecified',
    phone: phone || '',
    emergencyContact: emergencyContact || 'Not provided',
    admissionStatus: 'Unassigned',
    currentWardId: null,
    currentWardName: null,
    currentRoomNumber: null,
    createdAt: nowIso,
    medicalHistory: {
      status: medicalHistory?.status || (medicalHistory?.conditions?.length > 0 ? 'verified' : 'unverified'),
      source: medicalHistory?.source || 'manual',
      conditions: medicalHistory?.conditions || [],
      allergies: medicalHistory?.allergies || [],
      medications: medicalHistory?.medications || [],
      notes: medicalHistory?.notes || '',
    },
  };

  patients.unshift(newPatient);

  return res.status(201).json({
    success: true,
    message: `Patient ${newPatient.fullName} registered successfully with ID ${newPatient.id}`,
    data: newPatient,
  });
}

export function updateMedicalHistory(req, res) {
  const { patientId } = req.params;
  const { conditions, allergies, medications, notes, status, source } = req.body;

  const patient = patients.find((p) => p.id === patientId);

  if (!patient) {
    return res.status(404).json({
      success: false,
      message: `Patient with ID '${patientId}' not found.`,
    });
  }

  patient.medicalHistory = {
    status: status || (conditions && conditions.length > 0 ? 'verified' : 'unverified'),
    source: source || 'manual',
    conditions: conditions || patient.medicalHistory.conditions,
    allergies: allergies || patient.medicalHistory.allergies,
    medications: medications || patient.medicalHistory.medications,
    notes: notes !== undefined ? notes : patient.medicalHistory.notes,
    updatedAt: new Date().toISOString(),
  };

  return res.json({
    success: true,
    message: 'Medical history updated successfully.',
    data: patient.medicalHistory,
  });
}

// Simulated ABHA Lookup & Import (Hackathon Prototype)
export function lookupAbhaDemo(req, res) {
  const { query } = req.query;

  if (!query) {
    return res.json({
      success: true,
      data: abhaDemoRecords,
      note: 'Simulated ABHA Hackathon Repository',
    });
  }

  const q = query.toLowerCase();
  const matched = abhaDemoRecords.filter(
    (r) =>
      r.abhaId.toLowerCase().includes(q) ||
      r.name.toLowerCase().includes(q) ||
      r.abhaAddress.toLowerCase().includes(q)
  );

  return res.json({
    success: true,
    data: matched,
    note: 'Simulated ABHA Demo Records (Not real ABDM network)',
  });
}

export function importAbhaDemoToPatient(req, res) {
  const { patientId } = req.params;
  const { abhaId } = req.body;

  const patient = patients.find((p) => p.id === patientId);
  if (!patient) {
    return res.status(404).json({
      success: false,
      message: `Patient with ID '${patientId}' not found.`,
    });
  }

  const record = abhaDemoRecords.find((r) => r.abhaId === abhaId || r.name.toLowerCase() === patient.fullName.toLowerCase()) || abhaDemoRecords[0];

  patient.medicalHistory = {
    status: 'verified',
    source: 'abha_demo',
    abhaId: record.abhaId,
    verifiedFacility: record.verifiedHealthFacility,
    conditions: record.conditions,
    allergies: record.allergies,
    medications: record.medications,
    notes: `Simulated ABHA Import from ${record.verifiedHealthFacility}. Past hospitalizations: ${record.pastHospitalizations.join(', ')}.`,
    importedAt: new Date().toISOString(),
  };

  return res.json({
    success: true,
    message: `Medical history successfully imported from ABHA record (${record.abhaId}).`,
    data: patient.medicalHistory,
  });
}
