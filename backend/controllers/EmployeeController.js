const Employee = require("../models/Employee.js");
const Opt = require("../models/Opt.js");

const createEmployee = async (req, res, next) => {
  try {
    const employeeByUsername = await Employee.findOne({
      username: req.body.username,
    });
    const employeeByEmail = await Employee.findOne({
      email: req.body.email,
    });
    if (employeeByUsername) {
      const err = new Error("Username already used");
      err.statusCode = 409;
      next(err);
      return;
    }
    if (employeeByEmail) {
      const err = new Error("Email already used");
      err.statusCode = 409;
      next(err);
      return;
    }
    const employee = new Employee(req.body);
    if (req.body.stage === undefined || req.body.stage === "") {
      employee.stage = "onboarding";
    }
    if (req.body.status === undefined || req.body.status === "") {
      employee.status = "never_submit";
    }
    await employee.save();
    const employeeObj = employee.toObject();
    delete employeeObj.password;
    res.status(200).json(employeeObj);
  } catch (err) {
    err.statusCode = 500;
    next(err);
  }
};

const getEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.params?.employeeId, {
      password: 0,
    }).populate("personInfo");
    if (!employee) {
      const err = new Error("Employee not found");
      err.statusCode = 404;
      next(err);
      return;
    }
    res.status(200).json(employee);
  } catch (err) {
    err.statusCode = 500;
    next(err);
  }
};

const getAllEmployee = async (req, res, next) => {
  try {
    let page,
      limit = 0;
    let searchQuery = {};
    if (req.query?.page === undefined) {
      page = 1;
    } else {
      page = parseInt(req.query?.page);
    }
    if (req.query?.limit === undefined) {
      limit = 1000;
    } else {
      limit = parseInt(req.query?.limit);
    }
    const skip = (page - 1) * limit;

    if (req.query?.stage !== undefined) {
      searchQuery.stage = req.query?.stage;
    }
    if (req.query?.status !== undefined) {
      searchQuery.status = req.query?.status;
    }
    if (req.query?.isHr !== undefined) {
      searchQuery.isHr = JSON.parse(req.query?.isHr); // "true" or "false" into boolean
    }
    if (req.query?.q !== undefined) {
      searchQuery.$or = [{ username: req.query?.q }, { email: req.query?.q }];
    }

    // Sort by last name
    let query = Employee.find(searchQuery, { password: 0 }).populate(
      "personInfo"
    );

    query = query.sort({
      "personInfo.lastName": 1,
    });

    const employees = await query.skip(skip).limit(limit);
    res.status(200).json(employees);
  } catch (err) {
    err.statusCode = 500;
    next(err);
  }
};

const linkOpt = async (req, res, next) => {
  try {
    const opt = await Opt.findById(req.body.id);
    if (!opt) {
      const err = new Error("OPT Not Found");
      err.statusCode = 404;
      next(err);
      return;
    }
    if (opt.employeeId.toString() !== req.body.id) {
      const err = new Error("OPT Not Match");
      err.statusCode = 500;
      next(err);
      return;
    }
    const updatedEmployee = await Employee.findOneAndUpdate(
      opt.employeeId,
      { $push: { optList: opt._id } },
      { new: true }
    ).populate("personInfo");
    const { password, ...employeeWithoutPassword } = updatedEmployee;
    res.status(200).json(employeeWithoutPassword);
  } catch (err) {
    err.statusCode = 500;
    next(err);
  }
};

const unlinkOpt = async (req, res, next) => {
  try {
    const opt = await Opt.findById(req.body.id);
    if (!opt) {
      const err = new Error("OPT Not Found");
      err.statusCode = 404;
      next(err);
      return;
    }
    if (opt.employeeId.toString() !== req.body.id) {
      const err = new Error("OPT Not Match");
      err.statusCode = 500;
      next(err);
      return;
    }
    const updatedEmployee = await Employee.findOneAndUpdate(
      opt.employeeId,
      { $pull: { optList: opt._id } },
      { new: true }
    ).populate("personInfo");
    const { password, ...employeeWithoutPassword } = updatedEmployee;
    res.status(200).json(employeeWithoutPassword);
  } catch (err) {
    err.statusCode = 500;
    next(err);
  }
};

const makeDecision = async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.params?.employeeId);
    const decision = req.body.decision;
    if (employee.status === "approved") {
      const err = new Error("This stage has been approved");
      err.statusCode = 500;
      next(err);
      return;
    }
    if (decision === "approved") {
      employee.status = "approved";
    } else if (decision === "rejected") {
      employee.status = "rejected";
      employee.feedback = req.body.feedback;
    } else {
      const err = new Error("Wrong decision content");
      err.statusCode = 500;
      next(err);
      return;
    }
    await employee.save();
    res.status(200).json({ stage: employee.stage, status: employee.status });
  } catch (err) {
    err.statusCode = 500;
    next(err);
  }
};

const makeAdvance = async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.params?.employeeId);
    if (employee.status !== "approved") {
      const err = new Error("Current stage not approved");
      err.statusCode = 500;
      next(err);
      return;
    }
    if (employee.stage === "onboarding") {
      employee.stage = "OPT Receipt";
    } else if (employee.stage === "OPT Receipt") {
      employee.stage = "OPT EAD";
    } else if (employee.stage === "OPT EAD") {
      employee.stage = "I-983";
    } else if (employee.stage === "I-983") {
      employee.stage = "I-20";
    } else if (employee.stage === "I-20") {
      const err = new Error("I-20 stage is the last stage");
      err.statusCode = 500;
      next(err);
      return;
    }
    const currentDate = new Date();
    employee.submissionDate = currentDate.toLocaleDateString("en-CA");
    await employee.save();
    res.status(200).json({ stage: employee.stage, status: employee.status });
  } catch (err) {
    err.statusCode = 500;
    next(err);
  }
};

module.exports = {
  createEmployee,
  getEmployee,
  getAllEmployee,
  linkOpt,
  unlinkOpt,
  makeDecision,
  makeAdvance,
};
