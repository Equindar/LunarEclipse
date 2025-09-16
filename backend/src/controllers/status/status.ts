import app from 'app';
import { Request, Response } from 'express';

export async function getStatus(_req: Request, res: Response) {

  let value: number = Math.floor(Math.random() * 100);
  res.setHeader("Content-Type", "application/json");
  res.appendHeader("API-Version", "1.0")
  res.json({ online: true, latency: value });
  res.statusCode = 200;
};

// app.get('/', async (_req: Request, res: Response) => {
//   res.setHeader("Content-Type", "application/json");
//   res.appendHeader("API-Version", "1.0")
//   res.json({msg: "haha"});
//   res.statusCode = 200;
// }); 