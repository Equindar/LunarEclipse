import express from 'express';
import { getStatus } from '../controllers/status';
import { getTest } from '../controllers/test';
import { getUser } from '../controllers/user';

// --- Init
const router = express.Router();

// Register custom routes
router.use('/status', getStatus);
router.use('/test', getTest);

router.get('/user', getUser);

// Default-Route
router.get('/', async (_req, res) => {
    res.json({ hello: 'world' });
});

export default router;
