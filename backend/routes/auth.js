import express from "express";
import { signup, login, getMe } from "../controllers/authController.js";

// 1. IMPORT THE MIDDLEWARE
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// --- Public Routes (No guard) ---
router.post("/signup", signup);
router.post("/login", login);

// --- Protected Routes (Guard is active) ---

// 2. ADD THE MIDDLEWARE to the route.
// This tells Express: "Run authMiddleware first. If it passes, run getMe."
router.get("/me", authMiddleware, getMe);

export default router;