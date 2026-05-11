import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, phone } = req.body;

    let user = await User.findOne({ phone });

    if (user) {
      // User exists - login
      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET as string,
        { expiresIn: "7d" }
      );
      res.json({ user, token, message: "Logged in successfully" });
      return;
    }

    // User doesn't exist - register
    user = await User.create({ name, phone });

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    res.status(201).json({ user, token, message: "Registered successfully" });
  } catch (err) {
    console.error("createUser error:", err);
    res.status(500).json({ message: "Authentication failed" });
  }
};
