// In-memory Vital Logs, Anomaly Scoring, Alert Episodes & In-App Notifications

import { patients, admissions, wards } from './store.js';

// Pre-seeded vital telemetry logs for admitted patients (last 12 hours)
export let patientLogs = {
  // Eleanor Vance: Elevated HR and low-grade temp (Moderate Risk / Anomaly Episode)
  'VW-PAT-1001': generateRealisticPatientLogs('VW-PAT-1001', {
    baseHr: 88,
    baseSpo2: 94,
    baseSbp: 128,
    baseDbp: 82,
    baseTemp: 37.8,
    trend: 'rising_hr_temp',
    status: 'Review Required',
    signalQuality: 'Good (98%)',
  }),

  // Arthur Miller: Pneumonia recovery, stabilizing
  'VW-PAT-1002': generateRealisticPatientLogs('VW-PAT-1002', {
    baseHr: 72,
    baseSpo2: 98,
    baseSbp: 120,
    baseDbp: 78,
    baseTemp: 36.9,
    trend: 'stable_normal',
    status: 'Monitoring',
    signalQuality: 'Excellent (100%)',
  }),

  // Marcus Sterling: Dehydration / gastroenteritis
  'VW-PAT-1003': generateRealisticPatientLogs('VW-PAT-1003', {
    baseHr: 82,
    baseSpo2: 97,
    baseSbp: 114,
    baseDbp: 74,
    baseTemp: 37.1,
    trend: 'stable_normal',
    status: 'Monitoring',
    signalQuality: 'Good (95%)',
  }),

  // Sofia Rodriguez: Post-appendectomy
  'VW-PAT-1004': generateRealisticPatientLogs('VW-PAT-1004', {
    baseHr: 76,
    baseSpo2: 99,
    baseSbp: 118,
    baseDbp: 76,
    baseTemp: 36.8,
    trend: 'stable_normal',
    status: 'Monitoring',
    signalQuality: 'Good (96%)',
  }),

  // Robert Chen: Post-cardiac stent, stable rhythm
  'VW-PAT-1005': generateRealisticPatientLogs('VW-PAT-1005', {
    baseHr: 68,
    baseSpo2: 99,
    baseSbp: 118,
    baseDbp: 76,
    baseTemp: 36.7,
    trend: 'stable_normal',
    status: 'Monitoring',
    signalQuality: 'Excellent (100%)',
  }),

  // Helena Thorne: Complicated pyelonephritis
  'VW-PAT-1006': generateRealisticPatientLogs('VW-PAT-1006', {
    baseHr: 84,
    baseSpo2: 96,
    baseSbp: 122,
    baseDbp: 80,
    baseTemp: 37.4,
    trend: 'stable_normal',
    status: 'Monitoring',
    signalQuality: 'Good (94%)',
  }),

  // David K. O’Connor: COPD Stage II
  'VW-PAT-1007': generateRealisticPatientLogs('VW-PAT-1007', {
    baseHr: 86,
    baseSpo2: 93,
    baseSbp: 134,
    baseDbp: 84,
    baseTemp: 37.0,
    trend: 'mild_copd_hypoxia',
    status: 'Review Required',
    signalQuality: 'Fair (88%)',
  }),

  // Clara Oswald: ICU Septic Shock (Critical Rule Alert)
  'VW-PAT-1008': generateRealisticPatientLogs('VW-PAT-1008', {
    baseHr: 108,
    baseSpo2: 91,
    baseSbp: 142,
    baseDbp: 90,
    baseTemp: 38.6,
    trend: 'tachycardia_hypoxia',
    status: 'Critical Rule Alert',
    signalQuality: 'Arterial Line (99%)',
  }),

  // James T. Wilson: ICU Post-CABG
  'VW-PAT-1009': generateRealisticPatientLogs('VW-PAT-1009', {
    baseHr: 82,
    baseSpo2: 97,
    baseSbp: 126,
    baseDbp: 78,
    baseTemp: 37.0,
    trend: 'stable_normal',
    status: 'Monitoring',
    signalQuality: 'Telemetry Lead II (98%)',
  }),

  // Fatima Al-Mansoor: ARDS Ventilation
  'VW-PAT-1010': generateRealisticPatientLogs('VW-PAT-1010', {
    baseHr: 92,
    baseSpo2: 92,
    baseSbp: 130,
    baseDbp: 84,
    baseTemp: 37.9,
    trend: 'hypoxia_fever',
    status: 'Critical Rule Alert',
    signalQuality: 'Ventilator Telemetry (99%)',
  }),

  // Liam Patel: Emergency MVA (Stale data demonstration)
  'VW-PAT-1011': generateRealisticPatientLogs('VW-PAT-1011', {
    baseHr: 90,
    baseSpo2: 96,
    baseSbp: 128,
    baseDbp: 82,
    baseTemp: 37.0,
    trend: 'stale_example',
    status: 'Stale Data',
    signalQuality: 'Intermittent (65%)',
  }),

  // Maya Lin: Emergency post-anaphylaxis
  'VW-PAT-1012': generateRealisticPatientLogs('VW-PAT-1012', {
    baseHr: 78,
    baseSpo2: 98,
    baseSbp: 120,
    baseDbp: 76,
    baseTemp: 36.8,
    trend: 'stable_normal',
    status: 'Monitoring',
    signalQuality: 'Good (95%)',
  }),

  // Sir Jonathan Vance-Sterling: Private suite
  'VW-PAT-1013': generateRealisticPatientLogs('VW-PAT-1013', {
    baseHr: 70,
    baseSpo2: 99,
    baseSbp: 132,
    baseDbp: 82,
    baseTemp: 36.6,
    trend: 'stable_normal',
    status: 'Monitoring',
    signalQuality: 'VIP Suite (100%)',
  }),
};

// Seeded Clinical Alert Episodes
export let alerts = [
  {
    id: 'ALT-9482',
    patientId: 'VW-PAT-1001',
    patientName: 'Eleanor Vance',
    wardName: 'General Ward A',
    roomNumber: 'Room 101',
    detectedAt: new Date(Date.now() - 14 * 60 * 1000).toISOString(),
    priority: 'High Priority Alert',
    type: 'Multi-Parameter Deterioration Risk',
    anomalyScore: 0.74,
    isolationForestLabel: 'anomalous',
    supportingMeasurements: {
      heartRate: '88 bpm (+14 bpm over 2h)',
      spo2: '94% (borderline low)',
      temperature: '37.8°C (low-grade fever)',
      bloodPressure: '128/82 mmHg',
    },
    reason: 'Heart rate elevation coupled with rising temperature and SpO2 dip to 94% on room air. Isolation Forest statistical anomaly detected.',
    isAcknowledged: false,
    acknowledgedBy: null,
    acknowledgedAt: null,
    reviewNote: null,
  },
  {
    id: 'ALT-9480',
    patientId: 'VW-PAT-1008',
    patientName: 'Clara Oswald',
    wardName: 'Intensive Care Unit (ICU)',
    roomNumber: 'ICU Bed 01',
    detectedAt: new Date(Date.now() - 38 * 60 * 1000).toISOString(),
    priority: 'Critical Rule Alert',
    type: 'Sepsis Screening Tier 1 Trigger',
    anomalyScore: 0.89,
    isolationForestLabel: 'anomalous',
    supportingMeasurements: {
      heartRate: '108 bpm',
      spo2: '91%',
      temperature: '38.6°C',
      bloodPressure: '142/90 mmHg',
    },
    reason: 'Severe tachycardia (>100 bpm) with pyrexia (>38.3°C) and acute hypoxemia (SpO2 91%). NEWS2 score = 6.',
    isAcknowledged: true,
    acknowledgedBy: 'Nurse Clara Dupont, CCRN',
    acknowledgedAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    reviewNote: 'Attending Intensivist Dr. Gordon notified. Blood cultures drawn and IV Meropenem administered.',
  },
  {
    id: 'ALT-9478',
    patientId: 'VW-PAT-1010',
    patientName: 'Fatima Al-Mansoor',
    wardName: 'Intensive Care Unit (ICU)',
    roomNumber: 'ICU Bed 05',
    detectedAt: new Date(Date.now() - 65 * 60 * 1000).toISOString(),
    priority: 'Critical Rule Alert',
    type: 'Desaturation Under Mechanical Ventilation',
    anomalyScore: 0.82,
    isolationForestLabel: 'anomalous',
    supportingMeasurements: {
      heartRate: '92 bpm',
      spo2: '92%',
      temperature: '37.9°C',
      bloodPressure: '130/84 mmHg',
    },
    reason: 'Persistent SpO2 < 93% under mechanical ventilation. PEEP titration protocol triggered.',
    isAcknowledged: false,
    acknowledgedBy: null,
    acknowledgedAt: null,
    reviewNote: null,
  },
  {
    id: 'ALT-9475',
    patientId: 'VW-PAT-1011',
    patientName: 'Liam Patel',
    wardName: 'Emergency Ward',
    roomNumber: 'ER Bay 01',
    detectedAt: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
    priority: 'Data Freshness Warning',
    type: 'Stale Sensor Telemetry',
    anomalyScore: 0.0,
    isolationForestLabel: 'normal',
    supportingMeasurements: {
      lastReading: '90m ago',
    },
    reason: 'Pulse oximeter lead disconnected or sensor battery depleted. Last reading exceeds 15-minute freshness threshold.',
    isAcknowledged: false,
    acknowledgedBy: null,
    acknowledgedAt: null,
    reviewNote: null,
  },
];

// Seeded In-App Notifications
export let notifications = [
  {
    id: 'NOTIF-001',
    patientId: 'VW-PAT-1001',
    patientName: 'Eleanor Vance',
    roomNumber: 'Room 101',
    title: 'Clinical Review Recommended',
    message: 'Eleanor Vance (Room 101): Heart rate +14 bpm and temp 37.8°C. Statistical anomaly score = 0.74.',
    type: 'alert',
    priority: 'high',
    timestamp: new Date(Date.now() - 14 * 60 * 1000).toISOString(),
    isRead: false,
    alertId: 'ALT-9482',
  },
  {
    id: 'NOTIF-002',
    patientId: 'VW-PAT-1008',
    patientName: 'Clara Oswald',
    roomNumber: 'ICU Bed 01',
    title: 'Critical Rule Alert: Sepsis Protocol',
    message: 'Clara Oswald (ICU Bed 01): HR 108 bpm, SpO2 91%, Temp 38.6°C. NEWS2 score = 6.',
    type: 'alert',
    priority: 'critical',
    timestamp: new Date(Date.now() - 38 * 60 * 1000).toISOString(),
    isRead: true,
    alertId: 'ALT-9480',
  },
  {
    id: 'NOTIF-003',
    patientId: 'VW-PAT-1010',
    patientName: 'Fatima Al-Mansoor',
    roomNumber: 'ICU Bed 05',
    title: 'Critical Desaturation Alert',
    message: 'Fatima Al-Mansoor (ICU Bed 05): SpO2 dropped to 92% under ventilation.',
    type: 'alert',
    priority: 'critical',
    timestamp: new Date(Date.now() - 65 * 60 * 1000).toISOString(),
    isRead: false,
    alertId: 'ALT-9478',
  },
  {
    id: 'NOTIF-004',
    patientId: 'VW-PAT-1011',
    patientName: 'Liam Patel',
    roomNumber: 'ER Bay 01',
    title: 'Telemetry Sensor Stale Warning',
    message: 'Liam Patel (ER Bay 01): No sensor data received for over 60 minutes. Check bedside lead.',
    type: 'warning',
    priority: 'medium',
    timestamp: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
    isRead: false,
    alertId: 'ALT-9475',
  },
];

// Helper: Generate realistic timestamped history (e.g. 144 points / 12 hours)
function generateRealisticPatientLogs(patientId, config) {
  const points = [];
  const now = Date.now();
  const intervalMinutes = 5;
  const count = 36; // 3 hours of 5-min intervals for instant responsiveness

  let prevHr = config.baseHr;
  let prevSpo2 = config.baseSpo2;
  let prevSbp = config.baseSbp;

  for (let i = count - 1; i >= 0; i--) {
    let pointTime = new Date(now - i * intervalMinutes * 60 * 1000).toISOString();
    
    // Stale example handling
    if (config.trend === 'stale_example' && i < 18) {
      // Intentionally omit recent readings to simulate stale/disconnected sensor
      continue;
    }

    const naturalVariation = Math.sin(i / 3) * 2;
    const hr = Math.round(config.baseHr + naturalVariation + (config.trend === 'rising_hr_temp' ? (count - i) * 0.4 : 0));
    const spo2 = Math.min(100, Math.round(config.baseSpo2 - naturalVariation * 0.3 - (config.trend === 'tachycardia_hypoxia' ? (count - i) * 0.2 : 0)));
    const sbp = Math.round(config.baseSbp + naturalVariation * 1.5);
    const dbp = Math.round(config.baseDbp + naturalVariation * 0.8);
    const temp = Number((config.baseTemp + (Math.sin(i / 4) * 0.1) + (config.trend === 'rising_hr_temp' ? ((count - i) * 0.015) : 0)).toFixed(1));

    const hrChange = Number((hr - prevHr).toFixed(1));
    const spo2Change = Number((spo2 - prevSpo2).toFixed(1));
    const sbpChange = Number((sbp - prevSbp).toFixed(1));

    prevHr = hr;
    prevSpo2 = spo2;
    prevSbp = sbp;

    // Isolation Forest anomaly scoring simulation matching model characteristics
    let isAnomalous = false;
    let anomalyScore = 0.22;
    let ruleAlert = null;

    if (hr > 100 || spo2 < 93 || temp > 38.2 || (hr > 85 && temp > 37.6 && spo2 < 95)) {
      isAnomalous = true;
      anomalyScore = Number((0.65 + Math.random() * 0.25).toFixed(2));
      ruleAlert = hr > 100 ? 'Tachycardia Alert' : temp > 38.0 ? 'Pyrexia Protocol' : 'Deterioration Early Warning';
    }

    points.push({
      id: `LOG-${patientId}-${i}`,
      patientId,
      timestamp: pointTime,
      heartRate: hr,
      spo2,
      systolicBp: sbp,
      diastolicBp: dbp,
      temperature: temp,
      hrChange5m: hrChange,
      spo2Change5m: spo2Change,
      sbpChange5m: sbpChange,
      signalQuality: config.signalQuality || 'Good (98%)',
      isolationForestScore: anomalyScore,
      isolationForestLabel: isAnomalous ? 'anomalous' : 'normal',
      isAnomaly: isAnomalous,
      ruleAlert,
      monitoringStatus: isAnomalous ? (hr > 100 || temp > 38.3 ? 'Critical Rule Alert' : 'Review Required') : 'Monitoring',
    });
  }

  return points;
}

// Ingestion helper: Add new reading
export function ingestVitalReading(patientId, reading) {
  if (!patientLogs[patientId]) {
    patientLogs[patientId] = [];
  }

  const logs = patientLogs[patientId];
  const lastReading = logs.length > 0 ? logs[logs.length - 1] : null;

  const hr = Number(reading.heartRate || 75);
  const spo2 = Number(reading.spo2 || 98);
  const sbp = Number(reading.systolicBp || 120);
  const dbp = Number(reading.diastolicBp || 80);
  const temp = Number(reading.temperature || 37.0);

  const hrChange = lastReading ? Number((hr - lastReading.heartRate).toFixed(1)) : 0;
  const spo2Change = lastReading ? Number((spo2 - lastReading.spo2).toFixed(1)) : 0;
  const sbpChange = lastReading ? Number((sbp - lastReading.systolicBp).toFixed(1)) : 0;

  const nowIso = new Date().toISOString();

  // Rule evaluation
  let isAnomalous = false;
  let anomalyScore = 0.25;
  let ruleAlert = null;
  let status = 'Monitoring';

  if (hr > 100 || spo2 < 93 || temp > 38.2) {
    isAnomalous = true;
    anomalyScore = 0.82;
    ruleAlert = 'High-Priority Parameter Escalation';
    status = 'Critical Rule Alert';
  } else if (hr > 86 || temp > 37.6 || spo2 <= 94) {
    isAnomalous = true;
    anomalyScore = 0.68;
    ruleAlert = 'Vital Trend Anomaly';
    status = 'Review Required';
  }

  const newLog = {
    id: `LOG-${patientId}-${Date.now()}`,
    patientId,
    timestamp: nowIso,
    heartRate: hr,
    spo2,
    systolicBp: sbp,
    diastolicBp: dbp,
    temperature: temp,
    hrChange5m: hrChange,
    spo2Change5m: spo2Change,
    sbpChange5m: sbpChange,
    signalQuality: reading.signalQuality || 'Good (98%)',
    isolationForestScore: anomalyScore,
    isolationForestLabel: isAnomalous ? 'anomalous' : 'normal',
    isAnomaly: isAnomalous,
    ruleAlert,
    monitoringStatus: status,
  };

  logs.push(newLog);

  // If anomalous, create alert and notification
  if (isAnomalous) {
    const patient = patients.find((p) => p.id === patientId);
    const newAlert = {
      id: `ALT-${Date.now().toString().slice(-4)}`,
      patientId,
      patientName: patient ? patient.fullName : 'Patient',
      wardName: patient ? patient.currentWardName : 'Ward',
      roomNumber: patient ? patient.currentRoomNumber : 'Room',
      detectedAt: nowIso,
      priority: status,
      type: ruleAlert,
      anomalyScore,
      isolationForestLabel: 'anomalous',
      supportingMeasurements: {
        heartRate: `${hr} bpm`,
        spo2: `${spo2}%`,
        temperature: `${temp}°C`,
        bloodPressure: `${sbp}/${dbp} mmHg`,
      },
      reason: `Automated detection: ${ruleAlert}. Anomaly score = ${anomalyScore}.`,
      isAcknowledged: false,
      acknowledgedBy: null,
      acknowledgedAt: null,
      reviewNote: null,
    };
    alerts.unshift(newAlert);

    notifications.unshift({
      id: `NOTIF-${Date.now().toString().slice(-4)}`,
      patientId,
      patientName: patient ? patient.fullName : 'Patient',
      roomNumber: patient ? patient.currentRoomNumber : 'Room',
      title: `${status}: ${ruleAlert}`,
      message: `${patient?.fullName || 'Patient'} (${patient?.currentRoomNumber || 'Bed'}): HR ${hr} bpm, SpO2 ${spo2}%, Temp ${temp}°C.`,
      type: 'alert',
      priority: status === 'Critical Rule Alert' ? 'critical' : 'high',
      timestamp: nowIso,
      isRead: false,
      alertId: newAlert.id,
    });
  }

  return newLog;
}

// Acknowledge alert helper
export function acknowledgeAlert(alertId, nurseName, reviewNote) {
  const alert = alerts.find((a) => a.id === alertId);
  if (!alert) {
    throw new Error(`Alert with ID '${alertId}' not found.`);
  }

  alert.isAcknowledged = true;
  alert.acknowledgedBy = nurseName || 'Nurse Staff';
  alert.acknowledgedAt = new Date().toISOString();
  alert.reviewNote = reviewNote || 'Acknowledged by clinical staff on duty.';

  return alert;
}
