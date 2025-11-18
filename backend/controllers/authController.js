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

// SIGNUP
export const signup = async (req, res) => {
  try {
    const { name, email, universityId, password } = req.body;

    

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      universityId,
      password: hashed,
      // the role will automatically be set to 'user' by default from the model
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
        role: user.role 
      },
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ msg: err.message });
    }
    console.error(err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};


// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    
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
        role: user.role 
      },
    });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};


// GET ME (for protected routes)
export const getMe = async (req, res) => {
  try {
    // ... (code is fine)
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ msg: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(4404).json({ msg: "User not found" });
    }
    
    // This route already sends the full user object (including role)
    res.json({ user }); 
  } catch (err) {
    res.status(401).json({ msg: "Invalid token", error: err.message });
  }
};