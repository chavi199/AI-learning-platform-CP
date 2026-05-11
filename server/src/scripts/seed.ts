import "dotenv/config";
import mongoose from "mongoose";
import Category from "../models/Category.js";
import SubCategory from "../models/SubCategory.js";

const seedData = async () => {
  await mongoose.connect(process.env.MONGO_URI as string);
  console.log("Connected to MongoDB");

  await Category.deleteMany({});
  await SubCategory.deleteMany({});
  console.log("Cleared existing data");

  const science = await Category.create({ name: "Science" });
  const history = await Category.create({ name: "History" });
  const technology = await Category.create({ name: "Technology" });

  await SubCategory.create({ name: "Physics", category_id: science._id });
  await SubCategory.create({ name: "Biology", category_id: science._id });

  await SubCategory.create({ name: "Ancient History", category_id: history._id });
  await SubCategory.create({ name: "Modern History", category_id: history._id });

  await SubCategory.create({ name: "Programming", category_id: technology._id });
  await SubCategory.create({ name: "AI & Machine Learning", category_id: technology._id });

  console.log("Seed data created successfully!");
  process.exit(0);
};

seedData().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
