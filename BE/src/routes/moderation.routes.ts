import { Router } from "express";
import { moderateComment } from "../controllers/moderation.controller";

const router = Router();
router.post("/moderate", moderateComment);

export default router;
