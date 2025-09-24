import { User } from "@packages/features/users/domain/user";
import { Request, Response } from "express";


const user: User = {
    id: "1",
    name: "equindar"
}

export async function getUser(_req: Request, res: Response<User>) {
    res.appendHeader("Test", "test")
    return res.status(200).json(user);

}
