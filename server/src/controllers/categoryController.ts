import type { Request, Response } from "express";
import Category from "../models/Category.js";

export const getCategories = async (_req: Request, res: Response): Promise<void> => {
  const categories = await Category.find();
  res.json(categories);
};

export const createCategory = async (req: Request, res: Response): Promise<void> => {
  const { name } = req.body;
  const category = await Category.create({ name });
  res.status(201).json(category);
};
