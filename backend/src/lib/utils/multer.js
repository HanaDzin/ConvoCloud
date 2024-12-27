import multer from "multer";

// configure where and how the files are stored
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/profile-pics"); // stored in this directory
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // under the name constructed from the date + original name
  },
});

// filter the file to allow only image uploads
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

// initialize Multer middleware
export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // max file size 2MB
});