import Express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { getUsers, login, logout, register } from "../controller/users.js";
import { refreshToken } from "../controller/refresh-token.js";


const router = Express.Router();

router.get('/users', verifyToken, getUsers);
router.post('/users', register);
router.post('/login', login);
router.get('/token', refreshToken);
router.delete('/logout', logout);
export default router;