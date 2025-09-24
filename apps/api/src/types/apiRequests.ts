import { Request as ExpressRequest } from "express";

export interface BaseRequestContract {
  apiVersion?: string;
}

// Standard-Request mit Versionierung
export class ApiRequest implements BaseRequestContract {
  protected req: ExpressRequest;

  constructor(req: ExpressRequest) {
    this.req = req;
  }

  // Zugriff auf Felder (nutzt die augmentierten Felder)
  get apiVersion(): string {
    return this.req.apiVersion ?? "unknown";
  }

  header(name: string): string | undefined {
    return this.req.header(name) ?? undefined;
  }

  // Zugriff auf das originale Express-Request-Objekt
  get original(): ExpressRequest {
    return this.req;
  }
}