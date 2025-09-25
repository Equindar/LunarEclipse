import { Request, Response, NextFunction } from 'express';
import { StatusLookupContext } from '../context/statusLookupContext';

export async function getStatus(req: Request, res: Response, next: NextFunction) {
  try {
    // assume version extraction middleware set req.apiVersion
    const ctx = new StatusLookupContext(req.apiVersion);
    const status = await ctx.execute();
    res.json({ data: status });
  } catch (err) {
    next(err);
  }
}