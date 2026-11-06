import { Hono } from "hono";
import health from './health.route';
import status from './status.route';
import user from './user.route';

const router = new Hono()
  // --- Registering Middlewares

  // --- Registering Routes
  .route('/health', health)
  .route('/status', status)
  .route('/users', user);

  export default router;
