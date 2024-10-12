import express from "express";
import { sendMessage, getMessage } from "../controllers/message.controller.js";
import portectRoute from "./../middlewares/protectRoute.js";
const router = express.Router();

router.get("/:id", portectRoute, getMessage);
router.post("/send/:id", portectRoute, sendMessage);
export default router;
