import { Request, Response, Router } from 'express';
import logger from '../../utils/apiLogger';
import authenticateUser from '../../middlewares/authenticateUser';


export default function createTestRouter() {
  const router = Router();

  router.use(authenticateUser);


  router.get('/', (_req: Request, res: Response) => {
    logger.debug("here in /test");
    return res.status(200).send({ test: "test v1" });
  });

  return router;
}
