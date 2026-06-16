import express, { Errback, NextFunction, Request, Response } from 'express';
import { getStatus } from '../application/status/status';
import { getMonsters } from '../application/monsters/monsters';
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
router.use('/status', getStatus);
// router.use(errorHandler);

// function errorHandler (err: Errback, _req: Request, res: Response, _next: NextFunction) {
//     res.status(500);
//     ConsoleLogger.log('error', err)
//     res.render('error', { error: err });
//   }
  

export default router;
