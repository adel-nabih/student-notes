// backend/controllers/authController.js
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Signup controller
export const signup = async (req, res) => {
  try {
    const { name, email, password, universityId } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { universityId }] });
    if (existingUser) {
      return res.status(400).json({ message: "Email or University ID already in use" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      universityId,
    });

    await newUser.save();

    // Generate JWT
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({ token, user: { name: newUser.name, email: newUser.email, universityId: newUser.universityId } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
