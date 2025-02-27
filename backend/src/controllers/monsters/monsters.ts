import { Request, Response } from 'express';
import { db } from 'database';
import { usersTable } from 'database/schema';

export async function getMonsters(_req: Request, res: Response) {
  const response = await db.select().from(usersTable)
  res.json(response);
  res.statusCode = 200;
};

export function getMonsterById(_req: Request, res: Response) {
    res.json({})
    res.statusCode = 200;
  };
  
  