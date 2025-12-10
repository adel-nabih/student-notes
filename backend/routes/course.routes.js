import express from "express";
import { 
  getAllCourses, 
  createCourse, 
  updateCourse, 
  deleteCourse 
} from "../controllers/courseController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

// Public: Get all courses
router.get("/", getAllCourses);

// --- ADD THESE MISSING LINES ---
// Admin: CRUD operations
router.post("/", authMiddleware, adminMiddleware, createCourse);
router.put("/:id", authMiddleware, adminMiddleware, updateCourse);
router.delete("/:id", authMiddleware, adminMiddleware, deleteCourse);

export default router;