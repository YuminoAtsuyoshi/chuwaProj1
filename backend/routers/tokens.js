const express = require("express");
const router = express.Router();

const {
  createToken,
  getTokens,
  SendNotification,
} = require("../controllers/TokenController.js");

const authMiddleware = require("../middlewares/auth.js");

router.post("/", authMiddleware, createToken);
router.get("/", authMiddleware, getTokens);
router.post("/sendNofitication", authMiddleware, SendNotification);

module.exports = router;
