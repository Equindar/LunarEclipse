
import { Router } from 'express';
import { createUser, getUser, listUsers, updateUser } from '../../controllers/users.controller';

const router = Router();

router.get('/', listUsers);
router.get("/:id", getUser);
router.post("/", createUser);
router.put("/", updateUser);

export default router;