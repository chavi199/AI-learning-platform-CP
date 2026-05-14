import mongoose from "mongoose";
import dotenv from "dotenv";
import Category from "../models/Category";
import SubCategory from "../models/SubCategory";

dotenv.config();

// Define the seed data structure
interface SeedCategory {
  name: string;
  subCategories: string[];
}

const seedData: SeedCategory[] = [
  {
    name: "Software Development",
    subCategories: ["Frontend", "Backend", "AI", "DevOps"],
  },
  {
    name: "Exact Sciences",
    subCategories: ["Physics", "Mathematics", "Space"],
  },
  {
    name: "Languages",
    subCategories: ["English", "Hebrew"],
  },
  {
    name: "Business",
    subCategories: ["Project Management", "Economics", "Entrepreneurship"],
  },
  {
    name: "Cyber Security",
    subCategories: ["Ethical Hacking", "Encryption"],
  },
  {
    name: "Data Science",
    subCategories: ["SQL", "Visualization", "Big Data"],
  },
  {
    name: "Psychology",
    subCategories: ["Cognitive", "Body Language"],
  },
  {
    name: "History",
    subCategories: ["Industrial Revolution", "Ancient Greece"],
  },
  {
    name: "Photography",
    subCategories: ["Composition", "Editing"],
  },
  {
    name: "Cooking",
    subCategories: ["Italian", "Baking"],
  },
];

const seedDatabase = async (): Promise<void> => {
  try {
    // Connect to MongoDB
    console.log("🔗 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("✅ MongoDB connected successfully");

    // Delete existing categories and sub-categories
    console.log("\n🗑️  Deleting existing categories and sub-categories...");
    await Category.deleteMany({});
    await SubCategory.deleteMany({});
    console.log("✅ Existing data cleared");

    // Create categories
    console.log("\n📁 Creating categories...");
    const categoryNames = seedData.map((cat) => ({ name: cat.name }));
    const createdCategories = await Category.insertMany(categoryNames);
    console.log(`✅ Created ${createdCategories.length} categories`);

    // Create a map of category names to their MongoDB IDs
    const categoryMap: { [key: string]: string } = {};
    createdCategories.forEach((cat) => {
      categoryMap[cat.name] = cat._id.toString();
    });

    // Create sub-categories
    console.log("\n📂 Creating sub-categories...");
    const subCategoryData: any[] = [];

    for (const seedCategory of seedData) {
      const categoryId = categoryMap[seedCategory.name];
      if (!categoryId) {
        console.warn(
          `⚠️  Category ID not found for: ${seedCategory.name}`
        );
        continue;
      }

      const subCats = seedCategory.subCategories.map((subCatName) => ({
        name: subCatName,
        category_id: new mongoose.Types.ObjectId(categoryId),
      }));

      subCategoryData.push(...subCats);
    }

    const createdSubCategories = await SubCategory.insertMany(subCategoryData);
    console.log(`✅ Created ${createdSubCategories.length} sub-categories`);

    // Display summary
    console.log("\n📊 Seeding Summary:");
    console.log("═".repeat(50));
    seedData.forEach((category) => {
      const categoryId = categoryMap[category.name];
      console.log(`\n📁 ${category.name} (ID: ${categoryId})`);
      category.subCategories.forEach((subCat) => {
        console.log(`   └─ ${subCat}`);
      });
    });

    console.log("\n" + "═".repeat(50));
    console.log("✅ Database seeding completed successfully!");
    console.log(`Total Categories: ${Object.keys(categoryMap).length}`);
    console.log(`Total Sub-Categories: ${createdSubCategories.length}`);

    await mongoose.connection.close();
    console.log("\n🔌 MongoDB connection closed");
  } catch (error) {
    console.error("❌ Error during seeding:", error);
    process.exit(1);
  }
};

// Run the seed script
seedDatabase();
