import express from 'express';
import { getStatus } from '../controllers/statusController';
import test from './v1/temp/test';
// --- Init

const router = express.Router();
const authRouter = express.Router();

router.use('/status', getStatus);
router.use('/test', test);

export default router;
