import { patients, admissions, rooms, wards } from '../data/store.js';
import {
  patientLogs,
  alerts,
  notifications,
  ingestVitalReading,
  acknowledgeAlert,
} from '../data/vitalsAndAlertsStore.js';
import { evaluateMedicationSafety } from '../services/medicationSafetyService.js';
import { demoMedicationRules } from '../data/demoMedicationRules.js';

// Helper to calculate age from DOB
function getPatientAge(dob, fallbackAge) {
  if (fallbackAge) return fallbackAge;
  if (!dob) return 52;
  const diffMs = Date.now() - new Date(dob).getTime();
  const ageDt = new Date(diffMs);
  return Math.abs(ageDt.getUTCFullYear() - 1970);
}

// GET /api/nurse/stats
export const getNurseStats = (req, res) => {
  try {
    const admittedPatients = patients.filter(
      (p) =>
        p.admissionStatus?.toLowerCase() === 'admitted' ||
        p.status === 'admitted' ||
        !!p.currentRoomNumber
    );
    const totalAssigned = admittedPatients.length;

    const unacknowledgedAlerts = alerts.filter((a) => !a.isAcknowledged);
    const activeAlertsCount = unacknowledgedAlerts.length;

    // Normal monitoring: latest log is normal status and no unacknowledged alert
    let normalCount = 0;
    admittedPatients.forEach((p) => {
      const logs = patientLogs[p.id] || [];
      const latest = logs.length > 0 ? logs[logs.length - 1] : null;
      const hasActiveAlert = unacknowledgedAlerts.some((a) => a.patientId === p.id);

      if (latest && latest.monitoringStatus === 'Monitoring' && !hasActiveAlert) {
        normalCount++;
      }
    });

    res.json({
      success: true,
      stats: {
        assignedPatients: totalAssigned,
        normalMonitoring: normalCount,
        activeAlerts: activeAlertsCount,
        pendingReviews: activeAlertsCount,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/nurse/patients
export const getNursePatients = (req, res) => {
  try {
    const admittedPatients = patients.filter(
      (p) =>
        p.admissionStatus?.toLowerCase() === 'admitted' ||
        p.status === 'admitted' ||
        !!p.currentRoomNumber
    );

    const result = admittedPatients.map((p) => {
      const logs = patientLogs[p.id] || [];
      const latestLog = logs.length > 0 ? logs[logs.length - 1] : null;
      const unackAlert = alerts.find((a) => a.patientId === p.id && !a.isAcknowledged);

      // Determine explicit status
      let status = 'Monitoring';
      let statusBadgeColor = 'emerald';

      if (unackAlert) {
        if (unackAlert.priority.includes('Critical')) {
          status = 'Critical Rule Alert';
          statusBadgeColor = 'red';
        } else if (unackAlert.priority.includes('Freshness') || unackAlert.type.includes('Stale')) {
          status = 'Stale Data';
          statusBadgeColor = 'amber';
        } else {
          status = 'Review Required';
          statusBadgeColor = 'amber';
        }
      } else if (!latestLog) {
        status = 'Data Missing';
        statusBadgeColor = 'slate';
      } else if (latestLog.monitoringStatus) {
        status = latestLog.monitoringStatus;
        if (status === 'Critical Rule Alert') statusBadgeColor = 'red';
        else if (status === 'Review Required') statusBadgeColor = 'amber';
        else if (status === 'Stale Data') statusBadgeColor = 'amber';
      }

      // Calculate admission duration
      let admissionDuration = 'Today';
      const admissionDate = p.admissionDate || p.createdAt;
      if (admissionDate) {
        const admissionTime = new Date(admissionDate).getTime();
        const now = Date.now();
        const diffHours = Math.floor((now - admissionTime) / (1000 * 60 * 60));
        if (diffHours < 24) {
          admissionDuration = `${Math.max(1, diffHours)}h ago`;
        } else {
          const days = Math.floor(diffHours / 24);
          admissionDuration = `${days} day${days > 1 ? 's' : ''} ago`;
        }
      }

      return {
        id: p.id,
        fullName: p.fullName,
        age: getPatientAge(p.dob, p.age),
        gender: p.gender,
        wardId: p.currentWardId,
        wardName: p.currentWardName,
        roomNumber: p.currentRoomNumber,
        admissionDate: admissionDate,
        admissionDuration,
        medicalHistory: p.medicalHistory,
        attendingDoctor: p.attendingDoctor || 'Dr. Gordon, MD',
        latestReading: latestLog
          ? {
              timestamp: latestLog.timestamp,
              heartRate: latestLog.heartRate,
              spo2: latestLog.spo2,
              systolicBp: latestLog.systolicBp,
              diastolicBp: latestLog.diastolicBp,
              temperature: latestLog.temperature,
              signalQuality: latestLog.signalQuality,
              isAnomaly: latestLog.isAnomaly,
              isolationForestScore: latestLog.isolationForestScore,
            }
          : null,
        monitoringStatus: status,
        statusBadgeColor,
        activeAlert: unackAlert || null,
      };
    });

    res.json({ success: true, patients: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/nurse/patients/:patientId
export const getPatientProfileDetail = (req, res) => {
  try {
    const { patientId } = req.params;
    const patient = patients.find((p) => p.id === patientId);

    if (!patient) {
      return res.status(404).json({ success: false, message: `Patient ${patientId} not found.` });
    }

    const logs = patientLogs[patientId] || [];
    const latestLog = logs.length > 0 ? logs[logs.length - 1] : null;
    const patientAlertsList = alerts.filter((a) => a.patientId === patientId);

    res.json({
      success: true,
      patient: {
        ...patient,
        latestReading: latestLog,
        activeAlerts: patientAlertsList.filter((a) => !a.isAcknowledged),
        alertHistory: patientAlertsList,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/nurse/patients/:patientId/logs
export const getPatientLogs = (req, res) => {
  try {
    const { patientId } = req.params;
    const { range = 'all' } = req.query;

    const allLogs = patientLogs[patientId] || [];

    let filtered = [...allLogs];
    const now = Date.now();

    if (range === '1h') {
      const cutoff = now - 60 * 60 * 1000;
      filtered = filtered.filter((l) => new Date(l.timestamp).getTime() >= cutoff);
    } else if (range === '6h') {
      const cutoff = now - 6 * 60 * 60 * 1000;
      filtered = filtered.filter((l) => new Date(l.timestamp).getTime() >= cutoff);
    } else if (range === '24h') {
      const cutoff = now - 24 * 60 * 60 * 1000;
      filtered = filtered.filter((l) => new Date(l.timestamp).getTime() >= cutoff);
    }

    res.json({
      success: true,
      patientId,
      range,
      count: filtered.length,
      logs: filtered,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/nurse/alerts
export const getAllAlerts = (req, res) => {
  try {
    const { status } = req.query; // 'unacknowledged', 'acknowledged', or undefined (all)
    let list = [...alerts];

    if (status === 'unacknowledged') {
      list = list.filter((a) => !a.isAcknowledged);
    } else if (status === 'acknowledged') {
      list = list.filter((a) => a.isAcknowledged);
    }

    res.json({ success: true, alerts: list });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/nurse/alerts/:alertId/acknowledge
export const postAcknowledgeAlert = (req, res) => {
  try {
    const { alertId } = req.params;
    const { nurseName = 'Sarah Vance, RN', reviewNote } = req.body;

    const updatedAlert = acknowledgeAlert(alertId, nurseName, reviewNote);

    // Also mark related notifications as read
    notifications.forEach((n) => {
      if (n.alertId === alertId) {
        n.isRead = true;
      }
    });

    res.json({
      success: true,
      message: 'Alert acknowledged successfully.',
      alert: updatedAlert,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// POST /api/nurse/patients/:patientId/check-medicine
export const postCheckMedicine = (req, res) => {
  try {
    const { patientId } = req.params;
    const { medicineName, activeIngredient, rawText } = req.body;

    const patient = patients.find((p) => p.id === patientId);
    if (!patient) {
      return res.status(404).json({ success: false, message: `Patient ${patientId} not found.` });
    }

    const evaluation = evaluateMedicationSafety({
      patient,
      proposedMedicine: {
        name: medicineName,
        activeIngredient,
        rawText,
      },
    });

    res.json({
      success: true,
      evaluation,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/nurse/ocr-parse (Simulated OCR image intelligence with predefined matches)
export const postOcrParse = (req, res) => {
  try {
    const { imageBase64, filename, textHint } = req.body;

    let identifiedDrug = null;
    let confidence = 0.94;
    let rawExtractedText = 'Rx Label: Ibuprofen Tablets 400mg USP - Take 1 tablet every 6 hours';

    const hint = (textHint || filename || '').toLowerCase();

    if (hint.includes('amox') || hint.includes('clav') || hint.includes('augmentin')) {
      identifiedDrug = {
        name: 'Amoxicillin-Clavulanate (Augmentin)',
        activeIngredient: 'Amoxicillin',
        strength: '875 / 125 mg',
        dosageForm: 'Oral Tablet',
        manufacturer: 'GSK Pharmaceuticals',
        confidenceScore: 0.98,
        rawText: 'AUGMENTIN 875/125mg Amoxicillin and Clavulanate Potassium Tablets',
      };
    } else if (hint.includes('ibu') || hint.includes('advil') || hint.includes('motrin')) {
      identifiedDrug = {
        name: 'Ibuprofen (Advil / Motrin)',
        activeIngredient: 'Ibuprofen',
        strength: '400 mg',
        dosageForm: 'Film-Coated Tablet',
        manufacturer: 'Pfizer Health',
        confidenceScore: 0.96,
        rawText: 'IBUPROFEN TABLETS USP 400mg - Non-Steroidal Anti-Inflammatory Drug',
      };
    } else if (hint.includes('aspirin') || hint.includes('asa') || hint.includes('ecotrin')) {
      identifiedDrug = {
        name: 'Aspirin (Acetylsalicylic Acid)',
        activeIngredient: 'Aspirin',
        strength: '81 mg / 325 mg',
        dosageForm: 'Enteric Coated Tablet',
        manufacturer: 'Bayer Healthcare',
        confidenceScore: 0.97,
        rawText: 'BAYER ASPIRIN 325mg Genuine Coated Caplets - Pain Reliever',
      };
    } else if (hint.includes('warfarin') || hint.includes('coumadin')) {
      identifiedDrug = {
        name: 'Warfarin Sodium (Coumadin)',
        activeIngredient: 'Warfarin',
        strength: '5 mg',
        dosageForm: 'Scored Tablet',
        manufacturer: 'Bristol-Myers Squibb',
        confidenceScore: 0.99,
        rawText: 'COUMADIN 5mg Warfarin Sodium Tablets USP Anticoagulant',
      };
    } else if (hint.includes('metformin') || hint.includes('glucophage')) {
      identifiedDrug = {
        name: 'Metformin HCl (Glucophage)',
        activeIngredient: 'Metformin',
        strength: '500 mg',
        dosageForm: 'Extended-Release Tablet',
        manufacturer: 'Merck Healthcare',
        confidenceScore: 0.95,
        rawText: 'GLUCOPHAGE XR 500mg Metformin Hydrochloride Extended-Release Tablets',
      };
    } else if (hint.includes('cipro') || hint.includes('ciprofloxacin')) {
      identifiedDrug = {
        name: 'Ciprofloxacin (Cipro)',
        activeIngredient: 'Ciprofloxacin',
        strength: '500 mg',
        dosageForm: 'Film-Coated Tablet',
        manufacturer: 'Bayer Pharma',
        confidenceScore: 0.96,
        rawText: 'CIPRO 500mg Ciprofloxacin Tablets USP Fluoroquinolone Antibacterial',
      };
    } else if (hint.includes('lisinopril') || hint.includes('prinivil') || hint.includes('zestril')) {
      identifiedDrug = {
        name: 'Lisinopril (Zestril)',
        activeIngredient: 'Lisinopril',
        strength: '10 mg',
        dosageForm: 'Oral Tablet',
        manufacturer: 'AstraZeneca',
        confidenceScore: 0.97,
        rawText: 'ZESTRIL 10mg Lisinopril Tablets ACE Inhibitor',
      };
    } else {
      // Default plausible fallback for testing
      identifiedDrug = {
        name: 'Ibuprofen (Advil)',
        activeIngredient: 'Ibuprofen',
        strength: '400 mg',
        dosageForm: 'Oral Tablet',
        manufacturer: 'PharmaCore Labs',
        confidenceScore: 0.92,
        rawText: 'IBUPROFEN TABLETS 400MG - ACTIVE INGREDIENT: IBUPROFEN',
      };
    }

    res.json({
      success: true,
      ocrResult: {
        rawExtractedText: identifiedDrug.rawText,
        confidence: identifiedDrug.confidenceScore,
        candidateMedicine: identifiedDrug,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/nurse/catalog
export const getMedicineCatalog = (req, res) => {
  res.json({
    success: true,
    ingredients: demoMedicationRules.ingredients,
    disclaimer: demoMedicationRules.disclaimer,
  });
};

// GET /api/nurse/notifications
export const getNotifications = (req, res) => {
  res.json({
    success: true,
    notifications,
  });
};

// PATCH /api/nurse/notifications/:id/read
export const markNotificationRead = (req, res) => {
  const { id } = req.params;
  const notif = notifications.find((n) => n.id === id);
  if (notif) {
    notif.isRead = true;
  }
  res.json({ success: true, notification: notif });
};
