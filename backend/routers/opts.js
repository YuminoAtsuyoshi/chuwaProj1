const express = require("express");
const router = express.Router();

const {
  createOpt,
  getOpts,
  getOneOpt,
  deleteOpt,
} = require("../controllers/OptController.js");

const authMiddleware = require("../middlewares/auth.js");

router.post("/", authMiddleware, createOpt);
router.get("/", authMiddleware, getOpts);
router.get("/:optId", authMiddleware, getOneOpt);
router.delete("/:optId", authMiddleware, deleteOpt);

module.exports = router;
