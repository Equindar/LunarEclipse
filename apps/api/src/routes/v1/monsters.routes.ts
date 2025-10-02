import { Router, Request, Response } from "express";
import { createMonster } from "../../controllers/monstersController";
import validateRequests from "../../middlewares/validateRequests";
import { createMonsterSchema } from "../../data/validation/monsters.requestSchemas";
import { getMonster } from "../../controllers/monsters.controller";
import { Database } from "../../app";

export default function createCharacterRouter(database: Database) {
    // --- Init 
    // Router
    const router = Router();
    // Controller for UseCases

    router.get("/", (_req: Request, res: Response) => {
        return res.status(200).send({ monsters: [] });
    });

    router.get("/:id", getMonster);

    router.post("/", validateRequests(createMonsterSchema), createMonster);

    return router;
}