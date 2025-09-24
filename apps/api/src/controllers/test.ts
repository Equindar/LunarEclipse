import { Request, Response } from "express";
import logger from "../utils/apiLogger";
import { AuthRequest } from "../types/requests";

export async function getTest(_req: Request, res: Response) {
  const authReq: AuthRequest = new AuthRequest(_req); // Wrapper
  const apiVersion = authReq.apiVersion;

  if (!authReq.getBearerToken()) {
    return res.status(401).json({ statusCode: 401, success: false, apiVersion, errorMessage: "Missing token" });
  }

  logger.info(`Token: ${authReq.getBearerToken()}`)
  logger.info(`Version (Req): ${authReq.apiVersion}`)

  return res.status(200).send({});
}
