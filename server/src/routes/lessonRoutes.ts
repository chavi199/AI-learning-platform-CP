import { Router } from "express";
import { createLesson, getUserLessons, deleteLesson } from "../controllers/lessonController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = Router();

router.post("/generate", authMiddleware, createLesson);
router.get("/user", authMiddleware, getUserLessons);
router.delete("/:id", authMiddleware, deleteLesson);

export default router;
