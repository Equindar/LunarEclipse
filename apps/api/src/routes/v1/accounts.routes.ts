import express, { Router } from "express";
import { Database } from "../../app";
import logger from "../../utils/apiLogger";
import AccountsController from "../../controllers/accounts.controller";

export default function createAccountsRouter(database: Database) {
    // --- Init
    // Controller for UseCases
    const controller = new AccountsController();

    // Router
    const router = Router();
    // Controller for UseCases
    router.get("/login", controller.onLogin);
    router.get("/token/:code", controller.onGetAccessToken);

    router.post("/token", (_req, res) => {
        logger.debug(_req.body);
        res.sendStatus(201);
    });


    return router;
}
