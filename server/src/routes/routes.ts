import express from "express";
import { getAllUser, getUser, loginUser, logout, registerUser, updateUser } from "../controllers/auth";
import { addLike, getAllLikePost, removeLike } from "../controllers/likes";
import { addMessage, deleteMessage, getAllMessages, markMessageRead } from "../controllers/messages";
import { createPost, deletePost, getAllPost, getOnePost, getUsersAllPost, updatePost } from "../controllers/post";
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
router.route("/user/posts").get(checkAuthorization, getUsersAllPost);

/**
 * likes route
 */
router.route("/like/add").put(checkAuthorization, addLike);
router.route("/like/remove").delete(checkAuthorization, removeLike);
router.route("/likes").get(checkAuthorization, getAllLikePost);

/**
 * save routes
 */
router.route("/save/add").put(checkAuthorization, addSaves);
router.route("/save/remove").delete(checkAuthorization, removeSaves);
router.route("/saves").get(checkAuthorization, getAllSavePost);
router.route("/messages").get(checkAuthorization, getAllMessages);
router.route("/message").post(checkAuthorization, addMessage);
router.route("/message/delete").delete(checkAuthorization,deleteMessage);
router.route("/message/mark-as-read").post(checkAuthorization,markMessageRead);
// router.route("/pusher/auth").post(checkAuthorization, (req, res) => {
//   const socketId = req.body.socket_id;
//   const channel = req.body.channel_name;
//   const auth = pusher.authenticate(socketId, channel);
//   res.send(auth);
// })
export default router;
