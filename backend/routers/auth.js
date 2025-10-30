const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Employee = require("../models/Employee");
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
    const { username, password, email, isHr } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new Employee({
      username: username,
      password: hashedPassword,
      email: email,
      isHr: JSON.parse(isHr),
    });
    user.save();

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
