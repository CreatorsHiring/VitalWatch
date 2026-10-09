import { Router } from 'express';
import { getAllWards, getWardById, getWardRooms } from '../controllers/wards.controller.js';

const router = Router();

router.get('/', getAllWards);
router.get('/:wardId', getWardById);
router.get('/:wardId/rooms', getWardRooms);

export default router;
