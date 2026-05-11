import type { Response } from "express";
import type { AuthRequest } from "../middleware/authMiddleware.js";
import Lesson from "../models/Lesson.js";
import Category from "../models/Category.js";
import SubCategory from "../models/SubCategory.js";
import { generateLesson } from "../services/aiService.js";

export const createLesson = async (req: AuthRequest, res: Response): Promise<void> => {
  console.log("📥 Received lesson request for:", req.body);
  console.log("👤 User ID:", req.userId);
  
  try {
    const { topic, category, sub_category_id } = req.body;
    const userId = req.userId;

    // Fetch category and subcategory names from DB
    const categoryDoc = await Category.findById(category);
    const subCategoryDoc = await SubCategory.findById(sub_category_id);

    const categoryName = categoryDoc?.name || "General";
    const subCategoryName = subCategoryDoc?.name || "General";

    console.log("📚 Context:", { categoryName, subCategoryName, topic });

    let lessonData;
    
    try {
      console.log("🤖 Attempting to generate lesson with OpenAI...");
      lessonData = await generateLesson(topic, categoryName, subCategoryName);
      console.log("✅ OpenAI API call successful");
    } catch (aiError: any) {
      console.error("❌ DETAILED AI ERROR:", {
        message: aiError.message,
        stack: aiError.stack,
        response: aiError.response?.data,
      });
      console.log("⚠️ Falling back to mock lesson");
      
      // Fallback to mock
      lessonData = {
        title: `Lesson about ${topic}`,
        content: `## Introduction to ${topic}\n\nWelcome to this lesson about **${topic}** in the context of ${categoryName} - ${subCategoryName}.\n\n### What you will learn\n- The basics of ${topic}\n- Key concepts and definitions\n- Real-world applications\n\n### Overview\nThis lesson covers the fundamentals of ${topic}. By the end, you will have a solid understanding of the core principles.\n\n### Key Concepts\n1. **Definition**: ${topic} is an important subject in its field.\n2. **Applications**: Used widely in modern contexts.\n3. **Summary**: Understanding ${topic} opens many doors.`,
        quiz: [
          {
            question: `What is the main focus of this lesson?`,
            options: [topic, "Mathematics", "Art", "Music"],
            answer: topic,
          },
          {
            question: `Which best describes ${topic}?`,
            options: ["An important subject", "A cooking technique", "A sport", "A language"],
            answer: "An important subject",
          },
          {
            question: `What can understanding ${topic} help you with?`,
            options: ["Opens many doors", "Nothing useful", "Only cooking", "Only sports"],
            answer: "Opens many doors",
          },
        ],
      };
    }

    const lesson = await Lesson.create({
      ...lessonData,
      topic,
      category,
      sub_category_id,
      user_id: userId,
    });

    console.log("💾 Lesson saved to DB:", lesson._id);
    res.status(201).json(lesson);
  } catch (err) {
    console.error("❌ createLesson error:", err);
    res.status(500).json({ message: "Failed to create lesson" });
  }
};

export const getUserLessons = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    const lessons = await Lesson.find({ user_id: userId }).sort({ createdAt: -1 });
    res.json(lessons);
  } catch (err) {
    console.error("getUserLessons error:", err);
    res.status(500).json({ message: "Failed to fetch lessons" });
  }
};

export const deleteLesson = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const lesson = await Lesson.findById(id);
    if (!lesson) {
      res.status(404).json({ message: "Lesson not found" });
      return;
    }

    if (lesson.user_id.toString() !== userId) {
      res.status(403).json({ message: "Not authorized to delete this lesson" });
      return;
    }

    await Lesson.findByIdAndDelete(id);
    res.json({ message: "Lesson deleted successfully" });
  } catch (err) {
    console.error("deleteLesson error:", err);
    res.status(500).json({ message: "Failed to delete lesson" });
  }
};
