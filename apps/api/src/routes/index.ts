import { Request, Response, NextFunction, Router } from "express";
import { VersionStrategy } from "../types/versionStrategy";

export default class apiRouter {
    private strategies: Map<string, VersionStrategy> = new Map();

    register(version: string, strategy: VersionStrategy) {
        this.strategies.set(version, strategy);
    }

    useVersion() {
        return (req: Request, res: Response, next: NextFunction) => {
            const strategy = this.strategies.get(req.apiVersion);
            if (!strategy) {
                return res.status(400).json({ error: "Unsupported API version blabla" });
            }

            const router: Router = strategy.getRouter();
            return router(req, res, next);
        };
    }
}
