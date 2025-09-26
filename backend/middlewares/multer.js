
// // middleware/upload.js
// import multer from "multer";
// import path from "path";

// // Set destination and filename
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/'); // Save to /uploads folder
//   },
//   filename: function (req, file, cb) {
//     const uniqueName = Date.now() + '-' + file.originalname;
//     cb(null, uniqueName);
//   },
// });

// const upload = multer({ storage });

// export default upload;

import multer from "multer";
import path from "path";

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // adjust if you store somewhere else
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + "-" + file.fieldname + ext);
  },
});

// Multer upload config
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // max 5MB per file
    fieldSize: 10 * 1024 * 1024, // max 10MB per text field
  },
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    if (!allowed.includes(file.mimetype)) {
      return cb(new Error("Only image files are allowed"));
    }
    cb(null, true);
  },
});

export default upload;
