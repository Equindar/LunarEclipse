import { Router } from "express";
import { VersionStrategy } from "../types/versionStrategy";
import path from "path";
import { readdirSync } from "fs";

export class v1Strategy implements VersionStrategy {
    getRouter(): Router {
        const router = Router();
        const routesPath = path.join(__dirname, "../routes/v1");

        // Alle Dateien in /routes/v1 einlesen
        const files = readdirSync(routesPath).filter((file) =>
            file.endsWith(".routes.js") || file.endsWith(".routes.ts")
        );

        for (const file of files) {
            const routeModule = require(path.join(routesPath, file));

            // Default-Export = Router
            const route = routeModule.default;

            // Route mounten: Dateiname bestimmt den Pfad
            // z. B. users.routes.ts → /users
            const routeName = file.replace(".routes.ts", "").replace(".routes.js", "");
            const basePath = `/${routeName.replace(".routes", "")}`;

            router.use(basePath, route);
        }

        return router;
    }
}