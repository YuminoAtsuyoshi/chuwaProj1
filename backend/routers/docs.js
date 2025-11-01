const express = require("express");
const router = express.Router();
const upload = require("../utils/fileStorage");

const { createDoc, getDoc } = require("../controllers/DocumentController.js");

const authMiddleware = require("../middlewares/auth.js");

// Handle multer errors (e.g., file size limit exceeded)
const handleMulterError = (err, req, res, next) => {
  if (err) {
    console.error("Multer error:", err);
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ 
        message: "File too large. Maximum file size is 10MB." 
      });
    }
    return res.status(400).json({ 
      message: `File upload error: ${err.message || "Unknown error"}` 
    });
  }
  next();
};

router.post(
  "/",
  authMiddleware,
  upload.single("file"),
  handleMulterError,
  createDoc
);
router.get("/:docId", authMiddleware, getDoc);

module.exports = router;
