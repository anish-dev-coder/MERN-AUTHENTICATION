import express from "express";
import { getUserDetail } from "../controllers/user.controller.js";
import userAuth from "../middlewares/userAuth.middleware.js";

const router = express.Router();

router.get("/user-data", userAuth, getUserDetail);

export default router;
