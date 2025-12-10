import Major from "../models/Major.js";

// GET All Majors (Public or Admin)
export const getAllMajors = async (req, res) => {
  try {
    const majors = await Major.find().sort({ name: 1 });
    res.json(majors);
  } catch (error) {
    res.status(500).json({ msg: "Server Error" });
  }
};

// CREATE Major (Admin)
export const createMajor = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ msg: "Name is required" });

    const existing = await Major.findOne({ name });
    if (existing) return res.status(400).json({ msg: "Major already exists" });

    const major = await Major.create({ name });
    res.status(201).json(major);
  } catch (error) {
    res.status(500).json({ msg: "Server Error" });
  }
};

// UPDATE Major (Admin)
export const updateMajor = async (req, res) => {
  try {
    const { name } = req.body;
    const major = await Major.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true }
    );
    res.json(major);
  } catch (error) {
    res.status(500).json({ msg: "Server Error" });
  }
};

// DELETE Major (Admin)
export const deleteMajor = async (req, res) => {
  try {
    await Major.findByIdAndDelete(req.params.id);
    res.json({ msg: "Major deleted" });
  } catch (error) {
    res.status(500).json({ msg: "Server Error" });
  }
};