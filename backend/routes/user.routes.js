import express from "express";
import portectRoute from "./../middlewares/protectRoute.js";
import { getUsersForSideBar } from "./../controllers/user.controller.js";
const router = express.Router();

router.get("/", portectRoute, getUsersForSideBar);

export default router;
