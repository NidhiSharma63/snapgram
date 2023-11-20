import express from "express";
import { getAllUser, getUser, loginUser, logout, registerUser, updateUser } from "../controllers/auth";
import { addLikes, removeLikes } from "../controllers/likes";
import { createPost, deletePost, getAllPost, getOnePost, updatePost } from "../controllers/post";
import { addSaves, getAllSavePost, removeSaves } from "../controllers/save";
import checkAuthorization from "../middleware/authMiddleWare";

const router = express.Router();

/**
 * Auth route
 */
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(checkAuthorization, logout);
router.route("/user").get(checkAuthorization, getUser);
router.route("/user").put(checkAuthorization, updateUser);
router.route("/users").get(checkAuthorization, getAllUser);

/**
 * post route
 */
router.route("/post").post(checkAuthorization, createPost);
router.route("/post").put(checkAuthorization, updatePost);
router.route("/post").delete(checkAuthorization, deletePost);
router.route("/posts").get(checkAuthorization, getAllPost);
router.route("/post").get(checkAuthorization, getOnePost);

/**
 * likes route
 */
router.route("/likes/add").put(checkAuthorization, addLikes);
router.route("/likes/remove").delete(checkAuthorization, removeLikes);

/**
 * save routes
 */
router.route("/save/add").put(checkAuthorization, addSaves);
router.route("/save/remove").delete(checkAuthorization, removeSaves);
router.route("/saves").delete(checkAuthorization, getAllSavePost);
export default router;
