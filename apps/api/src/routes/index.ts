import express from 'express';
import { getStatus } from '../controllers/statusController';
import { getTest } from '../controllers/test';
// --- Init

const router = express.Router();

router.use('/status', getStatus);
router.use('/test', getTest);

export default router;
