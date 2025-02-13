import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { currentUser, register,refreshToken, login, logout, findUser } from "../controller/userController.js";

const router = express.Router();

router.get("/", authMiddleware, currentUser);
router.get("/find", authMiddleware, findUser);
router.post("/logout", authMiddleware, logout);



router.post("/register", register);
router.post("/login", login);
router.post("/refresh-token", refreshToken);

const userRoute = router;
export default userRoute;


