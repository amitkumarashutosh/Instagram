import express from "express";
import {
  register,
  login,
  logout,
  getProfile,
  editProfile,
  getSuggestedUsers,
  followOrUnfollow,
} from "../controllers/user.controller.js";
import { isAuthenticated } from "../middlewares/auth.js";
import upload from "../middlewares/multer.js";

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/profile/:id").get(isAuthenticated, getProfile);
router
  .route("/profile/edit")
  .put(isAuthenticated, upload.single("avatar"), editProfile);
router.route("/suggested").get(isAuthenticated, getSuggestedUsers);
router.route("/ /:id").post(isAuthenticated, followOrUnfollow);

export default router;
