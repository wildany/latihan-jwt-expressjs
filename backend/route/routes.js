import Express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { getUsers, login, register } from "../controller/users.js";
const router = Express.Router();

router.get('/users', verifyToken, getUsers);
router.post('/users', register);
router.post('/login', login);

export default router;