import { Request, Response } from 'express';

export function getMonsters(_req: Request, res: Response) {
  res.setHeader("Content-Type", "application/json");
  res.appendHeader("API-Version", "1.0")
  res.json({msg: "monster2k4"});
  res.statusCode = 200;
};

export function getMonsterById(_req: Request, res: Response) {
    res.json({})
    res.statusCode = 200;
  };
  

  