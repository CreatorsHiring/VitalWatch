import { Router } from 'express';
import {
  getAllAdmissions,
  getAdmissionById,
  createAdmission,
} from '../controllers/admissions.controller.js';

const router = Router();

router.get('/', getAllAdmissions);
router.get('/:admissionId', getAdmissionById);
router.post('/', createAdmission);

export default router;
