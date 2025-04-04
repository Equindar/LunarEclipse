import { ConsoleLogger } from '../core/Logger';
import { NextFunction, Request, Response } from "express";

interface AuthRequest extends Request { }

const loggingMiddleware = function (req: AuthRequest, res: Response, next: NextFunction): void {

    ConsoleLogger.info(`REQUEST: ${req.protocol}://${req.get('host')}${req.originalUrl}\n`);
    ConsoleLogger.info(`${req.method} ${req.statusCode} ${res.strictContentLength} `);
    ConsoleLogger.debug(`${JSON.stringify(req.headers)}`);
    next();
}


export default loggingMiddleware;