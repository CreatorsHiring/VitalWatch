// VitalWatch Frontend API Service

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Generic Fetch Wrapper with Error Handling
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Request failed with status ${response.status}`);
    }

    return data;
  } catch (error) {
    console.warn(`API request to ${endpoint} failed:`, error.message);
    throw error;
  }
}

// 1. Authentication
export async function loginStaff({ identifier, password, role }) {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ identifier, password, role }),
  });
}

// 2. Statistics & Overview
export async function getHospitalStats() {
  return request('/stats/overview');
}

// 3. Wards
export async function getWards() {
  return request('/wards');
}

export async function getWardById(wardId) {
  return request(`/wards/${wardId}`);
}

export async function getWardRooms(wardId) {
  return request(`/wards/${wardId}/rooms`);
}

// 4. Rooms
export async function getRooms(params = {}) {
  const query = new URLSearchParams(params).toString();
  return request(`/rooms${query ? `?${query}` : ''}`);
}

export async function getRoomById(roomId) {
  return request(`/rooms/${roomId}`);
}

// 5. Patients
export async function getPatients(params = {}) {
  const query = new URLSearchParams(params).toString();
  return request(`/patients${query ? `?${query}` : ''}`);
}

export async function getPatientById(patientId) {
  return request(`/patients/${patientId}`);
}

export async function createPatient(patientData) {
  return request('/patients', {
    method: 'POST',
    body: JSON.stringify(patientData),
  });
}

export async function updatePatientMedicalHistory(patientId, historyData) {
  return request(`/patients/${patientId}/medical-history`, {
    method: 'POST',
    body: JSON.stringify(historyData),
  });
}

// 6. Admissions & Room Assignment (Atomic Backend Operation)
export async function createAdmission({ patient, admission, medicalHistory }) {
  return request('/admissions', {
    method: 'POST',
    body: JSON.stringify({ patient, admission, medicalHistory }),
  });
}

export async function getAdmissions(params = {}) {
  const query = new URLSearchParams(params).toString();
  return request(`/admissions${query ? `?${query}` : ''}`);
}

export async function getAdmissionById(admissionId) {
  return request(`/admissions/${admissionId}`);
}

// 7. Simulated ABHA Lookup & Import
export async function lookupAbhaDemo(query = '') {
  return request(`/patients/abha/lookup${query ? `?query=${encodeURIComponent(query)}` : ''}`);
}

export async function importAbhaDemoToPatient(patientId, abhaId) {
  return request(`/patients/${patientId}/medical-history/abha-demo`, {
    method: 'POST',
    body: JSON.stringify({ abhaId }),
  });
}

// 8. Nurse Dashboard & Clinical Telemetry
export async function getNurseStats() {
  return request('/nurse/stats');
}

export async function getNursePatients() {
  return request('/nurse/patients');
}

export async function getPatientProfileDetail(patientId) {
  return request(`/nurse/patients/${patientId}`);
}

export async function getPatientLogs(patientId, range = 'all') {
  return request(`/nurse/patients/${patientId}/logs?range=${range}`);
}

export async function getAllAlerts(status) {
  const query = status ? `?status=${status}` : '';
  return request(`/nurse/alerts${query}`);
}

export async function acknowledgeAlert(alertId, payload = {}) {
  return request(`/nurse/alerts/${alertId}/acknowledge`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function checkMedicationSafety(patientId, payload) {
  return request(`/nurse/patients/${patientId}/check-medicine`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function ocrParseMedicine(payload) {
  return request('/nurse/ocr-parse', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function getMedicineCatalog() {
  return request('/nurse/catalog');
}

export async function getNotifications() {
  return request('/nurse/notifications');
}

export async function markNotificationRead(id) {
  return request(`/nurse/notifications/${id}/read`, {
    method: 'PATCH',
  });
}
