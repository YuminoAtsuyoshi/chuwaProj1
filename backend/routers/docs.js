const express = require("express");
const router = express.Router();
const upload = require("../utils/fileStorage");

const { createDoc, getDoc } = require("../controllers/DocumentController.js");

const authMiddleware = require("../middlewares/auth.js");

router.post("/", authMiddleware, upload.single("file"), createDoc);
router.get("/:docId", authMiddleware, getDoc);

module.exports = router;
