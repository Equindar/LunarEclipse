// import { Request, Response } from 'express';
// import { User } from 'packages/features/users/core/user';

// export async function getUser(_req: Request, res: Response<User>) {
//   res.appendHeader('Test', 'test');
//   return res.status(200).json(new User);
// }


import { Request, Response, Router } from 'express';

const router = Router();

router.get('/', (_req: Request, res: Response) => {
  let value: number = Math.floor(Math.random() * 100);
  return res.status(200).json({ data: { online: true, latency: value } });
});

export default router;