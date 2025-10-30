const express = require("express");
const router = express.Router();

const { createToken, getTokens } = require("../controllers/TokenController.js");

const authMiddleware = require("../middlewares/auth.js");

router.post("/", authMiddleware, createToken);
router.get("/", authMiddleware, getTokens);

module.exports = router;
