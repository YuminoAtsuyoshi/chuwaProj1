const express = require("express");
const router = express.Router();
const upload = require("../utils/fileStorage");

const {
  getEmployeeInfo,
  updateEmployeeInfo,
  submitForm,
} = require("../controllers/EmployeeInfoController.js");

const authMiddleware = require("../middlewares/auth.js");

router.get("/:employeeId", authMiddleware, getEmployeeInfo);
router.put(
  "/:employeeId",
  authMiddleware,
  upload.single("profilePicture"),
  updateEmployeeInfo
);
router.post("/:employeeId", authMiddleware, submitForm);

module.exports = router;
