import { Request, Response, NextFunction, Router } from "express";
import { VersionStrategy } from "../types/versionStrategy";
import UnsupportedApiVersionError from "../errors/UnsupportedAPIVersion";

export default class apiRouter {
  private strategies: Map<string, VersionStrategy> = new Map();

  register(version: string, strategy: VersionStrategy) {
    this.strategies.set(version, strategy);
  }

  useVersion() {
    return (req: Request, res: Response, next: NextFunction) => {
      const strategy = this.strategies.get(req.apiVersion);
      if (!strategy) {
        throw new UnsupportedApiVersionError({
          message: 'Unsupported X-API-Version.',
          statusCode: 400,
          code: 'ERR_API'
        });
      }

      const router: Router = strategy.getRouter();
      return router(req, res, next);
    };
  }
}
