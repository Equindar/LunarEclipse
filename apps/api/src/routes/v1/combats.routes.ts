
import { Router } from 'express';

import { Database } from "../../app";
import CombatsController from '../../controllers/combats.controller';

export default function createCombatRouter(database: Database) {
  // --- Init
  // Router
  const router = Router();
  // Controller for UseCases
  const controller = new CombatsController(database);

  // router.get("/", controller.onListUsers);
  // router.get("/:id", controller.onGetUser);
  // router.post("/", controller.onCreateUser);

  router.get('/', controller.onGetCombat);

  return router;
}
