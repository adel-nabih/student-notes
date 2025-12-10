import multer from "multer";
import path from "path";
import fs from "fs";

// 1. Ensure the 'uploads' folder exists
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// 2. Configure Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Save files in the 'uploads' folder
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    // Create a unique name: "file-123456789.pdf" to prevent overwriting
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});

// 3. Filter Files (Optional: Only accept PDFs and Images)
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "application/pdf" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" || 
    file.mimetype === "image/jpg"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only PDFs, JPEGs, and PNGs are allowed!"), false);
  }
};

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // Limit to 5MB
  fileFilter: fileFilter
});

export default upload;