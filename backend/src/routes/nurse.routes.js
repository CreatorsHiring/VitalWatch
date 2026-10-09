import express from 'express';
import {
  getNurseStats,
  getNursePatients,
  getPatientProfileDetail,
  getPatientLogs,
  getAllAlerts,
  postAcknowledgeAlert,
  postCheckMedicine,
  postOcrParse,
  getMedicineCatalog,
  getNotifications,
  markNotificationRead,
} from '../controllers/nurse.controller.js';

const router = express.Router();

// Nurse stats & assigned patients
router.get('/stats', getNurseStats);
router.get('/patients', getNursePatients);
router.get('/patients/:patientId', getPatientProfileDetail);
router.get('/patients/:patientId/logs', getPatientLogs);

// Clinical alerts & triage
router.get('/alerts', getAllAlerts);
router.post('/alerts/:alertId/acknowledge', postAcknowledgeAlert);

// Medication safety & OCR check
router.post('/patients/:patientId/check-medicine', postCheckMedicine);
router.post('/ocr-parse', postOcrParse);
router.get('/catalog', getMedicineCatalog);

// Notifications
router.get('/notifications', getNotifications);
router.patch('/notifications/:id/read', markNotificationRead);

export default router;
