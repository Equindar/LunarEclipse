import express from "express";
import CharactersController from "../../controllers/characters.controller";


const controller = new CharactersController();

const router = express.Router();

router.get("/", controller.onListCharacters);
// router.get("/:id", controller.onGetCharacter);

router.get("/new/:id", controller.onGetCharacter_new);

// router.post("/", controller.onCreateCharacter);
router.patch("/:id", controller.onUpdateCharacter);

export default router;