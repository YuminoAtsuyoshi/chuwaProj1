const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Configure disk storage with absolute uploads dir and auto-create
const UPLOAD_DIR = path.join(__dirname, "..", "uploads");
console.log("Upload directory:", UPLOAD_DIR);

if (!fs.existsSync(UPLOAD_DIR)) {
  console.log("Creating upload directory:", UPLOAD_DIR);
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
} else {
  console.log("Upload directory already exists");
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("Multer destination called, UPLOAD_DIR:", UPLOAD_DIR);
    cb(null, UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    const filename = file.fieldname + "-" + Date.now() + path.extname(file.originalname);
    console.log("Generated filename:", filename);
    cb(null, filename);
  },
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

module.exports = upload;
