import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    major: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Major", 
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("Course", courseSchema);