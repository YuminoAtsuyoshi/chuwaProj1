const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Employee = require("../models/Employee");
const Token = require("../models/Token");
const router = express.Router();

//使用的是jwt模式
router.post("/login", async (req, res, next) => {
  try {
    console.log("Login request body:", req.body);
    const { email, password } = req.body;
    let user = await Employee.findOne({ email: email });

    if (!user) {
      const err = new Error("Not Found");
      err.statusCode = 404;
      next(err);
      console.log(err);
      return;
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      const err = new Error("Invalid Credentials");
      err.statusCode = 400;
      next(err);
      return;
    }

    const payload = {
      user: {
        id: user._id,
      },
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    res.json({
      token,
      employeeId: user._id,
      username: user.username,
      email: user.email,
      stage: user.stage,
      status: user.status,
      personInfo: user.personInfo,
      optList: user.optList,
      isHr: user.isHr,
      feedback: user.feedback,
      submissionDate: user.submissionDate,
    });
  } catch (err) {
    next(err);
  }
});

router.post("/register", async (req, res, next) => {
  try {
    console.log("Register request body:", req.body);
    const { username, password, token: registrationToken } = req.body;

    // validate registration token
    if (!registrationToken) {
      const err = new Error("Registration token is required");
      err.statusCode = 400;
      next(err);
      return;
    }

    const tokenRecord = await Token.findOne({ token: registrationToken });
    if (!tokenRecord) {
      const err = new Error("Invalid registration token");
      err.statusCode = 400;
      next(err);
      return;
    }
    const now = new Date();
    if (tokenRecord.expiresAt && now > tokenRecord.expiresAt) {
      const err = new Error("Registration token has expired");
      err.statusCode = 400;
      next(err);
      return;
    }
    if (tokenRecord.status && tokenRecord.status !== "valid") {
      const err = new Error("Registration token has been used or is invalid");
      err.statusCode = 400;
      next(err);
      return;
    }

    const email = tokenRecord.email; // enforce email from token

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new Employee({
      username: username,
      password: hashedPassword,
      email: email,
      isHr: false,
    });
    await user.save();

    // mark token as used
    tokenRecord.status = "used";
    await tokenRecord.save();

    const payload = {
      user: {
        id: user._id,
      },
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    res.json({
      token,
      employeeId: user._id,
      username: user.username,
      email: user.email,
      stage: user.stage,
      status: user.status,
      personInfo: user.personInfo,
      optList: user.optList,
      isHr: user.isHr,
      feedback: user.feedback,
      submissionDate: user.submissionDate,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
