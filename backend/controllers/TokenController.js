const Token = require("../models/Token.js");
const Employee = require("../models/Employee.js");
const generateToken = require("../utils/tokenGenerator.js");
const {
  sendEmail,
  sendNotificationEmail,
} = require("../utils/emailService.js");

const createToken = async (req, res, next) => {
  try {
    const email = req.body.email;
    const tokenString = generateToken(email);
    const token = new Token({ email: email, token: tokenString });
    await token.save();
    await sendEmail(email, tokenString);
    res.status(200).json(token);
  } catch (err) {
    err.statusCode = 500;
    next(err);
  }
};

const getTokens = async (req, res, next) => {
  try {
    const tokens = await Token.find({}).lean();
    // fulfill with submitted flag and basic employee info if exists
    const emails = tokens.map((t) => t.email);
    const employees = await Employee.find(
      { email: { $in: emails } },
      {
        email: 1,
        status: 1,
        stage: 1,
        isHr: 1,
      }
    ).lean();
    const emailToEmployee = new Map(employees.map((e) => [e.email, e]));
    const enriched = tokens.map((t) => {
      const emp = emailToEmployee.get(t.email);
      const submitted = !!(emp && emp.isHr === false);
      return {
        ...t,
        submitted,
        employee: emp
          ? { email: emp.email, status: emp.status, stage: emp.stage }
          : null,
      };
    });
    res.status(200).json(enriched);
  } catch (err) {
    err.statusCode = 500;
    next(err);
  }
};

const SendNotification = async (req, res, next) => {
  try {
    const email = req.body.email;
    const oldStage = req.body.oldStage;
    const newStage = req.body.newStage;
    
    // Find employee by email and advance their stage
    const employee = await Employee.findOne({ email: email });
    if (employee) {
      // Advance stage only if currently approved at the old stage
      if (employee.stage === oldStage && employee.status === "approved") {
        employee.stage = newStage;
        employee.submissionDate = new Date().toISOString().slice(0, 10);
        await employee.save();
      }
    }
    
    await sendNotificationEmail(email, oldStage, newStage);
    res.status(200).json({ status: "Email sent" });
  } catch (err) {
    err.statusCode = 500;
    next(err);
  }
};

module.exports = {
  createToken,
  getTokens,
  SendNotification,
};
