import "dotenv/config";
import mongoose from "mongoose";
import User from "../models/User.js";

const createAdmin = async () => {
  await mongoose.connect(process.env.MONGO_URI as string);
  console.log("Connected to MongoDB");

  const name = "חוי";
  const phone = "0548525371";

  const existingUser = await User.findOne({ phone });

  if (existingUser) {
    existingUser.role = "admin";
    await existingUser.save();
    console.log(`✅ User '${name}' (${phone}) upgraded to admin`);
  } else {
    await User.create({ name, phone, role: "admin" });
    console.log(`✅ Admin user '${name}' (${phone}) created successfully`);
  }

  process.exit(0);
};

createAdmin().catch((err) => {
  console.error("createAdmin failed:", err);
  process.exit(1);
});
