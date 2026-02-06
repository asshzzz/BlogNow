import express from "express";
import { registerUser, loginUser, getUserProfile, updateUserProfile  } from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", authMiddleware, getUserProfile);
router.put("/editProfile", authMiddleware, updateUserProfile);


export default router;
