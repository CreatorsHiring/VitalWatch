import { Router } from 'express';
import {
  getAllPatients,
  getPatientById,
  createPatient,
  updateMedicalHistory,
  lookupAbhaDemo,
  importAbhaDemoToPatient,
} from '../controllers/patients.controller.js';

const router = Router();

router.get('/abha/lookup', lookupAbhaDemo);
router.get('/', getAllPatients);
router.get('/:patientId', getPatientById);
router.post('/', createPatient);
router.post('/:patientId/medical-history', updateMedicalHistory);
router.post('/:patientId/medical-history/abha-demo', importAbhaDemoToPatient);

export default router;
