import type { Request, Response } from "express";
import mongoose from "mongoose";
import SubCategory from "../models/SubCategory.js";

export const getSubCategories = async (req: Request, res: Response): Promise<void> => {
  const categoryId = req.params["categoryId"];
  if (!categoryId || Array.isArray(categoryId)) { res.status(400).json({ message: "categoryId is required" }); return; }
  const subCategories = await SubCategory.find({ category_id: new mongoose.Types.ObjectId(categoryId) });
  res.json(subCategories);
};

export const createSubCategory = async (req: Request, res: Response): Promise<void> => {
  const { name, category_id } = req.body;
  const subCategory = await SubCategory.create({ name, category_id });
  res.status(201).json(subCategory);
};
