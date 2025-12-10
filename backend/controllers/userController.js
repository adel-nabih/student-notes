import User from "../models/User.js";

// GET All Users (Admin)
export const getAllUsers = async (req, res) => {
  try {
    // -password means "don't send the encrypted password back"
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ msg: "Server Error" });
  }
};

// DELETE User (Admin)
export const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ msg: "User deleted" });
  } catch (error) {
    res.status(500).json({ msg: "Server Error" });
  }
};

// UPDATE Role (Admin) - Promote/Demote
export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body; // e.g., { role: "admin" }
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select("-password");

    res.json(user);
  } catch (error) {
    res.status(500).json({ msg: "Server Error" });
  }
};