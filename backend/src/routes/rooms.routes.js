import { Router } from 'express';
import { getAllRooms, getRoomById } from '../controllers/rooms.controller.js';

const router = Router();

router.get('/', getAllRooms);
router.get('/:roomId', getRoomById);

export default router;
