import { Router } from "express";
import { getSubCategories, createSubCategory } from "../controllers/subCategoryController.js";

const router = Router();

router.get("/:categoryId", getSubCategories);
router.post("/", createSubCategory);

export default router;
