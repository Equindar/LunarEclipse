// interface/controllers/UserControllerV2.ts
import { Request, Response } from 'express';
import { GetUsersV2 } from 'packages/features/users/application/getUsersV2';

export class UserControllerV2 {
  private useCase: GetUsersV2;

  constructor(useCase: GetUsersV2) {
    this.useCase = useCase;
  }

  getUsers = (req: Request, res: Response) => {
    const result = this.useCase.execute();
    res.json({ version: '2.0', users: result });
  };
}
