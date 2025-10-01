import { Request, Response } from 'express';
import getUserImpl from '@features/users/data/getUser.impl'



export const listUsers = async (req: Request, res: Response) => {
    const users = await getUserImpl();
    res.status(200).send(users);
}

export const getUser = async (req: Request, res: Response) => {
    res.status(200).send("getUser");
}

export const createUser = async (req: Request, res: Response) => {
    res.status(200).json({ name: "Rat", health: 150, short_description: "short", description: "long desc" });
}

export const updateUser = async (req: Request, res: Response) => {
    res.status(200).send("updateUser");
}

export const deleteUser = async (req: Request, res: Response) => {
    res.status(200).send("deleteUser");
}