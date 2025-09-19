import express, { Request, Response } from 'express';

const router = express.Router();

router.get('/discord/login', async (res: Response) => {
  const url: string =
    'https://discord.com/oauth2/authorize?client_id=1327391006731272226&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3001%2Fauth%2Fdiscord%2Fcallback&scope=identify';
  res.redirect(url);
});

router.get('discord/callback', async (req: Request, res: Response) => {
  const { code } = req.query;
  req.body = code;
});

export default router;
