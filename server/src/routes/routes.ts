import express from "express";
import { loginUser, logout, registerUser } from "../controllers/auth";
import { addLikes, removeLikes } from "../controllers/likes";
import { createPost, deletePost, getAllPost, updatePost } from "../controllers/post";
import checkAuthorization from "../middleware/authMiddleWare";

const router = express.Router();

/**
 * Auth route
 */
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(checkAuthorization, logout);

/**
 * post route
 */
router.route("/post").post(checkAuthorization, createPost);
router.route("/post").put(checkAuthorization, updatePost);
router.route("/post").delete(checkAuthorization, deletePost);
router.route("/posts").get(checkAuthorization, getAllPost);

/**
 * likes route
 */
router.route("/likes/add").put(checkAuthorization, addLikes);
router.route("/likes/remove").delete(checkAuthorization, removeLikes);

export default router;
