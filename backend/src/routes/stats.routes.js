import { Router } from 'express';
import { getOverviewStats } from '../controllers/stats.controller.js';

const router = Router();

router.get('/overview', getOverviewStats);

export default router;
