import express from "express";
import { loginUser, logout, registerUser } from "../controllers/auth";
import { createPost, updatePost } from "../controllers/post";
import checkAuthorization from "../middleware/authMiddleWare";
const router = express.Router();

/**
 * Auth route
 */
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(logout);

/**
 * post route
 */
router.route("/post").post(checkAuthorization, createPost);
router.route("/post").put(checkAuthorization, updatePost);
export default router;
