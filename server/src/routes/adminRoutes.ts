import { Router } from "express";
import { getStats, createCategory, createSubCategory, getAllUsers, getAllLessons, deleteLessonByAdmin } from "../controllers/adminController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = Router();

router.get("/stats", authMiddleware, adminMiddleware, getStats);
router.get("/users", authMiddleware, adminMiddleware, getAllUsers);
router.get("/lessons", authMiddleware, adminMiddleware, getAllLessons);
router.post("/categories", authMiddleware, adminMiddleware, createCategory);
router.post("/subcategories", authMiddleware, adminMiddleware, createSubCategory);
router.delete("/lessons/:id", authMiddleware, adminMiddleware, deleteLessonByAdmin);

export default router;
