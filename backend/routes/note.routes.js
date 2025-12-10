import express from "express";
import { 
  uploadNote, 
  getNotesByCourse, 
  getAllNotes, // <-- Import
  deleteNote   // <-- Import
} from "../controllers/noteController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
// Import Admin Middleware
import adminMiddleware from "../middleware/adminMiddleware.js"; 

const router = express.Router();

// Public / User Routes
router.post("/upload", authMiddleware, upload.single("file"), uploadNote);
router.get("/:courseId", getNotesByCourse);

// --- ADD ADMIN ROUTES ---
router.get("/admin/all", authMiddleware, adminMiddleware, getAllNotes);
router.delete("/admin/:id", authMiddleware, adminMiddleware, deleteNote);

export default router;