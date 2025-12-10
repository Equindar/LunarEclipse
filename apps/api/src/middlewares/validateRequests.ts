import { Request, Response, NextFunction } from 'express';
import { ObjectSchema } from 'joi';
import logger from '../utils/apiLogger';

export default function validateRequests(schema: ObjectSchema) {
    return async function validator(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        logger.debug("Validation triggered...");
        const validated = await schema.validateAsync(req.body, {
            abortEarly: false
        });
        req.body = validated;
        logger.debug("Validation passed...");
        next();
    }
};
