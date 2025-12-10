import express from "express";
import { 
  getAllMajors, 
  createMajor, 
  updateMajor, 
  deleteMajor 
} from "../controllers/majorController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

// Public: Get list for dropdowns
router.get("/", getAllMajors);

// Admin: CRUD (Protected)
// These routes run authMiddleware first (to get the user), 
// then adminMiddleware (to check the role), 
// then the controller logic.
router.post("/", authMiddleware, adminMiddleware, createMajor);
router.put("/:id", authMiddleware, adminMiddleware, updateMajor);
router.delete("/:id", authMiddleware, adminMiddleware, deleteMajor);

export default router;