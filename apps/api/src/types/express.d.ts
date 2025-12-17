import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      // Mandatory
      apiVersion: string;

      // Optional
      userId?: string;
      permissions?: string[];
      auth?: {
        payload: JwtPayload;
        token: string;
      };
    }
  }
}
