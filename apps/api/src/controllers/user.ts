
import { Request, Response } from "express";
import { User } from "packages/features/users/core/user";


const user: User = {
    id: "1",
    name: "equindar"
}

export async function getUser(_req: Request, res: Response<User>) {
    res.appendHeader("Test", "test")
    return res.status(200).json(user);

}
