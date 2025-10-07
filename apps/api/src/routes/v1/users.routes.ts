
import { Router } from 'express';
import UsersController from '../../controllers/users.controller';
import { Database } from "../../app";

export default function createUserRouter(database: Database) {
    // --- Init 
    // Router
    const router = Router();
    // Controller for UseCases
    const controller = new UsersController(database);

    router.get("/:id", controller.onGetUser);
    router.post("/", controller.onCreateUser);

    return router;
}