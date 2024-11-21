import express from "express";
import { sendMessage, getMessage } from "../controllers/message.controller.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.route("/send/:id").post(isAuthenticated, sendMessage);
router.route("/all/:id").post(isAuthenticated, getMessage);

export default router;
