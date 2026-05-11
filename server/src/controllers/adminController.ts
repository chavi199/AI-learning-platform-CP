import type { Request, Response } from "express";
import User from "../models/User.js";
import Lesson from "../models/Lesson.js";
import Category from "../models/Category.js";
import SubCategory from "../models/SubCategory.js";

export const getStats = async (_req: Request, res: Response): Promise<void> => {
  try {
    const totalUsers = await User.countDocuments();
    const totalLessons = await Lesson.countDocuments();
    const categories = await Category.find();

    res.json({
      totalUsers,
      totalLessons,
      categories,
    });
  } catch (err) {
    console.error("getStats error:", err);
    res.status(500).json({ message: "Failed to fetch stats" });
  }
};

export const getAllUsers = async (_req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find().select("name phone role createdAt").sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    console.error("getAllUsers error:", err);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

export const getAllLessons = async (_req: Request, res: Response): Promise<void> => {
  try {
    const lessons = await Lesson.find()
      .populate("user_id", "name")
      .populate("category", "name")
      .select("title topic user_id category createdAt")
      .sort({ createdAt: -1 });
    res.json(lessons);
  } catch (err) {
    console.error("getAllLessons error:", err);
    res.status(500).json({ message: "Failed to fetch lessons" });
  }
};

export const deleteLessonByAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await Lesson.findByIdAndDelete(id);
    res.json({ message: "Lesson deleted successfully" });
  } catch (err) {
    console.error("deleteLessonByAdmin error:", err);
    res.status(500).json({ message: "Failed to delete lesson" });
  }
};

export const createCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name } = req.body;
    const category = await Category.create({ name });
    res.status(201).json(category);
  } catch (err) {
    console.error("createCategory error:", err);
    res.status(500).json({ message: "Failed to create category" });
  }
};

export const createSubCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, category_id } = req.body;
    const subCategory = await SubCategory.create({ name, category_id });
    res.status(201).json(subCategory);
  } catch (err) {
    console.error("createSubCategory error:", err);
    res.status(500).json({ message: "Failed to create sub-category" });
  }
};
