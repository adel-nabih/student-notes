import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

// 1. IMPORT YOUR ROUTES
import authRoutes from "./routes/auth.js"; 
import complaintRoutes from "./routes/complaint.routes.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// --- MongoDB Connection ---
mongoose
  .connect(process.env.MONGO_URI, {
    dbName: "student_notes_app",
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

// --- Basic test route ---
app.get("/", (req, res) => {
  res.json({ message: "Server is running" });
});

// 2. USE YOUR ROUTES
// This tells Express that any request starting with '/auth'
// should be handled by your 'authRoutes' file.
app.use("/auth", authRoutes);
app.use("/api/complaints", complaintRoutes); // 2. USE

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});