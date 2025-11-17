import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      // --- THIS IS THE FIX ---
      // Allow for both @eslsca.edu AND @eslsca.edu.eg
      // The ( )? makes the '.eg' part optional, just in case
      match: /^[a-zA-Z0-9._%+-]+@eslsca\.edu(\.eg)?$/,
    },
    password: {
      type: String,
      required: true,
    },
    universityId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: /^[0-9]{5,10}$/, // This is still active
    }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);