// interface/controllers/UserControllerV1.ts
import { Request, Response } from "express";
import { GetUsersV1 } from "packages/features/users/application/getUsersV1";

export class UserControllerV1 {
    private useCase: GetUsersV1;

    constructor(useCase: GetUsersV1) {
        this.useCase = useCase;
    }

    getUsers = (req: Request, res: Response) => {
        const result = this.useCase.execute();
        res.json({ version: "1.0", users: result });
    };
}
