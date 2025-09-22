import { Request } from "express";

// Standard-Request mit Versionierung
export interface ApiRequest extends Request {
    apiVersion?: string;
}

// Request mit Authentifizierung (z. B. User ID im Token)
export interface AuthenticatedRequest extends Request {
    userId?: string;
}

// Request, das zusätzlich "Protected" ist (z. B. nur für eingeloggte Nutzer)
export interface ProtectedRequest extends AuthenticatedRequest {
    permissions?: string[];
}

// Kombinierte Typen möglich
export type CustomRequest = ApiRequest & ProtectedRequest & AuthenticatedRequest;