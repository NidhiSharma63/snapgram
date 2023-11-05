import express from "express";
import { loginUser, logout, registerUser } from "../controllers/auth";
const router = express.Router();

/**
 * Auth route
 */
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(logout);

export default router;
