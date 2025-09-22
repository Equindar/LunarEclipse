import { NextFunction } from "express";
import { ApiRequest } from "../types/requests";
import ApiResponse, { ErrorResponse } from "../types/responses";

export function apiVersionMiddleware(supportedVersions: string[]) {
    return (req: ApiRequest, res: ApiResponse, next: NextFunction) => {
        const version = req.header("X-API-Version");

        if (!version) {
            // Fehlende Version
            // Besser: latest version nutzen
            return new ErrorResponse("unknown", "Missing X-API-Version header", 400);
        }

        // Unsupported Version
        if (!supportedVersions.includes(version)) {
            return res.status(400).json({
                statusCode: 400,
                success: false,
                apiVersion: version,
                errorMessage: `Unsupported API version: ${version}. Supported versions are: ${supportedVersions.join(", ")}.`,
            });
        }

        // Erfolgreich → Version ins Request-Objekt hängen
        req.apiVersion = version;

        next();
    };
