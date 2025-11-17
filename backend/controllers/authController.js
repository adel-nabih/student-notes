import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Helper function to create a token
function createToken(userId) {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is missing in .env");
  }
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
}

// -----------------------------
// SIGNUP
// -----------------------------
export const signup = async (req, res) => {
  try {
    const { name, email, universityId, password } = req.body;

    // Validate required fields
    if (!name || !email || !universityId || !password) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    // Email already exists?
    // We can rely on the Mongoose 'unique' error, but this is cleaner
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(409).json({ msg: "Email already exists" });
    }

    // University ID already exists?
    const idExists = await User.findOne({ universityId });
    if (idExists) {
      return res.status(409).json({ msg: "University ID already exists" });
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    // Create user
    // Mongoose 'match' validation in User.js will run here
    const user = await User.create({
      name,
      email,
      universityId,
      password: hashed,
    });

    // Create token
    const token = createToken(user._id);

    res.status(201).json({
      msg: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        universityId: user.universityId,
      },
    });
  } catch (err) {
    // Handle Mongoose validation errors
    if (err.name === 'ValidationError') {
      return res.status(400).json({ msg: err.message });
    }
    console.error(err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// -----------------------------
// LOGIN
// -----------------------------
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate
    if (!email || !password) {
      return res.status(400).json({ msg: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ msg: "Invalid credentials" });

    const token = createToken(user._id);

    res.json({
      msg: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        universityId: user.universityId,
      },
    });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// -----------------------------
// GET ME (for protected routes)
// -----------------------------
export const getMe = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ msg: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json({ user });
  } catch (err) {
    res.status(401).json({ msg: "Invalid token", error: err.message });
  }
};