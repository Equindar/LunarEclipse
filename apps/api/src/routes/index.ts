import express from 'express';
import { getStatus } from '../controllers/status';

// --- Init
const router = express.Router();

// Register custom routes
router.use('/status', getStatus);
// Default-Route
router.get('/', async (_req, res) => {
    res.json({ hello: 'world' });
});

export default router;
