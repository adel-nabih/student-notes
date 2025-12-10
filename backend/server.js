//just some packages and stuff like that idk
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// these are all the route imports we need
import authRoutes from "./routes/auth.js";
import complaintRoutes from "./routes/complaint.routes.js";
import courseRoutes from "./routes/course.routes.js";
import noteRoutes from "./routes/note.routes.js";
import majorRoutes from "./routes/major.routes.js";
import userRoutes from "./routes/user.routes.js";


dotenv.config();

// i don't know what this does but it's important apparently
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());

// upload folder for pdfs and images and everything else
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// using the routes we did a bit ago
app.use("/auth", authRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/majors", majorRoutes);
app.use("/api/users", userRoutes);

// mongodb
mongoose
  .connect(process.env.MONGO_URI, { dbName: "student_notes_app" })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));