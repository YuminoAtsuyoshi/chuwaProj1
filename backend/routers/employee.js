const express = require("express");
const router = express.Router();

const {
  createEmployee,
  getEmployee,
  getAllEmployee,
  linkOpt,
  unlinkOpt,
  makeDecision,
  makeAdvance,
} = require("../controllers/EmployeeController.js");

const authMiddleware = require("../middlewares/auth.js");

router.post("/", authMiddleware, createEmployee);
router.get("/:employeeId", authMiddleware, getEmployee);
router.get("/", authMiddleware, getAllEmployee);
router.post("/:employeeId/optsLink", authMiddleware, linkOpt);
router.post("/:employeeId/optsUnlink", authMiddleware, unlinkOpt);
router.post("/:employeeId/stage/decision", authMiddleware, makeDecision);
router.post("/:employeeId/stage/advance", authMiddleware, makeAdvance);

module.exports = router;
