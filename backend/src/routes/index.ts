import express from 'express';
import { getStatus } from '../controllers/status/status';
import { getMonsters } from '../controllers/monsters/monsters';
import auth from './auth';

/**
 * Router Instance of express
 */
const router = express.Router();

/**
 * @summary this is a summary
 * @param no params required
 * @returns the status of the server
 */
    router.use('/monsters', getMonsters);
    router.use('/auth', auth);
    router.get('/login', getStatus);
    router.get('/status', getStatus);

export default router;
