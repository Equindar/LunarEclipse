import express, { Router } from "express";
import CharactersController from "../../controllers/characters.controller";
import { Database } from "../../app";
import logger from "../../utils/apiLogger";

export default function createCharacterRouter(database: Database) {
    // --- Init 
    // Router
    const router = Router();
    // Controller for UseCases
    const controller = new CharactersController(database);

    router.get("/", controller.onListCharacters);
    // router.get("/:id", controller.onGetCharacter);

    router.get("/new/:id", controller.onGetCharacter_new);

    // router.post("/", controller.onCreateCharacter);
    router.patch("/:id", controller.onUpdateCharacter);

    return router;
}
