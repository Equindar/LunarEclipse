import { Request, Response } from 'express';
import getMonsterImpl from '@features/monsters/data/getMonster.impl'

export const listMonsters = async (req: Request, res: Response) => {
    res.status(200).send("listMonsters");
}

export const getMonster = async (req: Request, res: Response) => {
    const id = +req.params['id'];
    const monster = await getMonsterImpl(id);
    res.status(200).send(monster);
}

export const createMonster = async (req: Request, res: Response) => {
    res.status(200).json({ name: "Rat", health: 150, short_description: "short", description: "long desc" });
}

export const updateMonster = async (req: Request, res: Response) => {
    res.status(200).send("updateUser");
}

export const deleteMonster = async (req: Request, res: Response) => {
    res.status(200).send("deleteUser");
}