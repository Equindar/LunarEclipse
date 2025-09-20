import express from 'express';
import { getStatus } from '../controllers/status';

const router = express.Router();

router.use('/status', getStatus);

export default router;
