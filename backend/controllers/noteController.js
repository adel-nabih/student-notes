import Note from "../models/Note.js";

// 1. Upload a new Note
export const uploadNote = async (req, res) => {
  try {
    // req.file is provided by the 'uploadMiddleware' (Multer)
    if (!req.file) {
      return res.status(400).json({ msg: "No file uploaded" });
    }

    const { title, course } = req.body;

    // Create the new Note in MongoDB
    const newNote = new Note({
      title,
      course, // The Course ID sent from frontend
      uploadedBy: req.user.id, // The User ID (from authMiddleware)
      // We save the relative path to the file so the frontend can link to it
      fileUrl: `uploads/${req.file.filename}` 
    });

    await newNote.save();

    res.status(201).json({ msg: "Note uploaded successfully", note: newNote });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server Error", error: error.message });
  }
};

// 2. Get all notes for a specific Course
export const getNotesByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    // Find notes where 'course' matches the ID
    // .populate() swaps the 'uploadedBy' ID for the actual User object
    // so we can display the name of the student who uploaded it.
    const notes = await Note.find({ course: courseId })
      .populate("uploadedBy", "name email") 
      .sort({ createdAt: -1 }); // Newest first

    res.json(notes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server Error" });
  }
};

export const getAllNotes = async (req, res) => {
  try {
    const notes = await Note.find()
      .populate('course', 'name code') // Show Course Name
      .populate('uploadedBy', 'name email') // Show Student Name
      .sort({ createdAt: -1 });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ msg: "Server Error" });
  }
};

// DELETE Note (Admin)
export const deleteNote = async (req, res) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);
    // Optional: You could also use fs.unlink() here to delete the actual file from the 'uploads' folder
    if (!note) return res.status(404).json({ msg: "Note not found" });
    res.json({ msg: "Note deleted" });
  } catch (error) {
    res.status(500).json({ msg: "Server Error" });
  }
};