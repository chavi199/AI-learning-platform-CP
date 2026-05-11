import type { Response, NextFunction } from "express";
import type { AuthRequest } from "./authMiddleware.js";
import User from "../models/User.js";

const adminMiddleware = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  const userId = req.userId;

  if (!userId) {
    res.status(401).json({ message: "Not authenticated" });
    return;
  }

  const user = await User.findById(userId);

  if (!user || user.role !== "admin") {
    res.status(403).json({ message: "Access denied. Admin only." });
    return;
  }

  next();
};

export default adminMiddleware;
