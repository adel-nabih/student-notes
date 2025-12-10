import express from "express";
import { 
  getAllUsers, 
  deleteUser, 
  updateUserRole 
} from "../controllers/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

// All routes here require Admin access
router.get("/", authMiddleware, adminMiddleware, getAllUsers);
router.put("/:id/role", authMiddleware, adminMiddleware, updateUserRole);
router.delete("/:id", authMiddleware, adminMiddleware, deleteUser);

export default router;