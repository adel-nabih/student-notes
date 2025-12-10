import Course from "../models/Course.js";

// GET All Courses
export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find()
      .populate('major', 'name') 
      .sort({ name: 1 });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ msg: "Server Error", error: error.message });
  }
};

// CREATE Course (Admin) - DEBUG VERSION
export const createCourse = async (req, res) => {
  try {
    // 1. Log what we received from the frontend
    console.log("📥 Received payload:", req.body); 

    const { name, code, major } = req.body;
    
    // 2. Check for missing fields
    if (!name || !code || !major) {
      console.log("❌ Missing fields in request"); 
      return res.status(400).json({ msg: "All fields are required" });
    }

    // 3. Try to create the course
    const newCourse = await Course.create({ name, code, major });
    
    // 4. Populate the major name
    await newCourse.populate('major', 'name');
    
    console.log("✅ Course created successfully:", newCourse); 
    res.status(201).json(newCourse);

  } catch (error) {
    // 5. Log the EXACT error to the terminal
    console.error("❌ CREATE COURSE ERROR:", error); 
    
    if (error.code === 11000) {
      return res.status(400).json({ msg: "Course code already exists" });
    }
    
    // Send the detailed error back to the frontend
    res.status(500).json({ msg: error.message });
  }
};

// UPDATE Course (Admin)
export const updateCourse = async (req, res) => {
  try {
    const { name, code, major } = req.body;
    
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { name, code, major },
      { new: true, runValidators: true }
    ).populate('major', 'name');

    if (!course) return res.status(404).json({ msg: "Course not found" });

    res.json(course);
  } catch (error) {
    res.status(500).json({ msg: "Server Error" });
  }
};

// DELETE Course (Admin)
export const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return res.status(404).json({ msg: "Course not found" });
    
    res.json({ msg: "Course deleted" });
  } catch (error) {
    res.status(500).json({ msg: "Server Error" });
  }
};