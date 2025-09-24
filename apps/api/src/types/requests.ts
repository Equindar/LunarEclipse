import { Request as ExpressRequest } from "express";
import { ApiRequest } from "./apiRequests";

export class AuthRequest extends ApiRequest {
    constructor(req: ExpressRequest) {
        super(req);
    }

    get userId(): string | undefined {
        return this.req.userId;
    }

    getBearerToken(): string | null {
        const auth = this.req.header("authorization") ?? this.req.headers["authorization"];
        if (!auth) return null;
        const header = Array.isArray(auth) ? auth[0] : String(auth);
        if (!header.startsWith("Bearer ")) return null;
        return header.slice("Bearer ".length);
    }
}

export class ProtectedRequest extends AuthRequest {
    hasPermission(permission: string): boolean {
        return (this.req.permissions ?? []).includes(permission);
    }
}
