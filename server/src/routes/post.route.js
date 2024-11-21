import express from "express";
import {
  createPost,
  getAllPosts,
  getUserPosts,
  likePost,
  dislikePost,
  addComment,
  getPostComment,
  deletePost,
  bookmarkPost,
} from "../controllers/post.controller.js";
import { isAuthenticated } from "../middlewares/auth.js";
import upload from "../middlewares/multer.js";

const router = express.Router();

router
  .route("/createPost")
  .post(isAuthenticated, upload.single("image"), createPost);
router.route("/all").get(isAuthenticated, getAllPosts);
router.route("/userpost/all").get(isAuthenticated, getUserPosts);
router.route("/:id/like").get(isAuthenticated, likePost);
router.route("/dislike/:id").get(isAuthenticated, dislikePost);
router.route("/comment/:id").post(isAuthenticated, addComment);
router.route("/comment/all/:id").post(isAuthenticated, getPostComment);
router.route("/delete/:id").delete(isAuthenticated, deletePost);
router.route("/bookmark/:id").get(isAuthenticated, bookmarkPost);

export default router;
