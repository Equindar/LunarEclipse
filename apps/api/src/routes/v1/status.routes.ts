import { Router } from 'express';

export default function createStatusRouter(database: any) {
  const router = Router();

  router.get('/', (_req, res) => {
    let value: number = Math.floor(Math.random() * 100);
    return res.status(200).json({ data: { online: true, latency: value } });
  });

  return router;
}